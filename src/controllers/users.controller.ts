import { NextFunction, raw, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { PagenationUsers } from '@/interfaces/pagenation.interface';
import { AuthService } from '@/services/auth.service';

export class UserController {
  public user = Container.get(UserService);
  public auth = Container.get(AuthService);

  private Filter(req: Request) {
    const page_number = Number(req.query.page) || 1;
    const status = req.query.record_status !== undefined ? Number(req.query.record_status) : null;
    const search = typeof req.query.search === 'string' ? req.query.search : null;

    return {
      page_number,
      status,
      search,
    };
  }

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pageNumber = Number(req.query.page) || 1;
      const filterUser = this.Filter(req);

      if (pageNumber < 0 || pageNumber > 100000000000000000) {
        return res.status(400).json({ message: "Page number is irregular" })
    }

      console.error(filterUser);
      const findAllUsersData: PagenationUsers = await this.user.findAllUser(filterUser.page_number, filterUser.status, filterUser.search);
      res.status(200).json(findAllUsersData);
    } catch (error) {
      next(error);
    }
  };


  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const findOneUserData: User = await this.user.findUserById(userId);
      const permissions: Number[] = await this.auth.getUserPermissions(userId);

      res.status(200).json({ ...findOneUserData, permissions, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const userData: CreateUserDto = req.body;
      const updateUserData: User = await this.user.updateUsers(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updateSettingUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const userId = req.user.uid;
        const userData: Partial<CreateUserDto> = req.body;
        const updatedUser: User = await this.user.updateSettingUser(userId, userData);
        res.status(200).json({ data: updatedUser, message: "Settings updated successfully" });
    } catch (error) {
        next(error);
    }
};


  public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = Number(req.params.id);
      const deleteUserData: User = await this.user.deleteUser(userId);

      res.status(200).json({ data: `User has been deleted`, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}
