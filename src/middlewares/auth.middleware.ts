import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { DB } from '@database';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';

const roleOwnership = {
  10: { table: 'Posts', ownershipField: 'created_by' },
  9: { table: 'Posts', ownershipField: 'created_by' },
  55: { table: 'Users', ownershipField: 'uid' },
};


const getAuthorization = (req) => {
  const coockie = req.cookies['Authorization'];
  
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
}

export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = getAuthorization(req);

    // console.log(""Authorization);

    if (Authorization) {
      const { id } = verify(Authorization, SECRET_KEY) as DataStoredInToken;
      const findUser = await DB.Users.findByPk(id);

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, 'Wrong authentication token'));
  }
};

export function Authorization(requiredRole) {
  return async (req, res, next) => {
    try {
      const uid = req.user.uid;
      const findUser = await DB.UserPermission.findAll({ where: { user_id: uid} });
      const permession = findUser.map(p => p.id_permission);

      if (permession.includes(requiredRole)) {
        next();
      }

      else {
        const roleConfig = roleOwnership[requiredRole];

        if (roleConfig) {
          const { table, ownershipField } = roleConfig;
          const recordId = req.params.id;
          const record = await DB[table].findByPk(recordId);

          if (record && record[ownershipField] === uid) {
            return next();
          }

          throw new HttpException(403, 'Access forbidden: Insufficient privileges');
        }

        throw new HttpException(403, 'Access forbidden: Insufficient privileges');
      }

    } catch (error) {
      next(new HttpException(403, `Error ${error}`));
    }
  };
}
