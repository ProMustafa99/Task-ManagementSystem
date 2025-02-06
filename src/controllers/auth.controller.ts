import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto ,LoginDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';

export class AuthController {
  
  public auth = Container.get(AuthService);

  public userByToken = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    try {

      const permissions: Number[] = await this.auth.getUserPermissions(req.user.uid);
      
      res.status(200).json({ ...req.user, permissions});
      // res.status(200).json(req.user);
    } catch (error) {
      next(error);
    }
  }

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const signUpUserData: User = await this.auth.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    }
    catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try { 
      const userData: LoginDto = req.body;

      console.log("\n\nUser login: ", req.body);

      const { cookie, findUser } = await this.auth.login(userData);
      const permissions: Number[] = await this.auth.getUserPermissions(findUser.uid);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ ...findUser, permissions, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}
