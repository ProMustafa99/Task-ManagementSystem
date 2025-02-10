import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { PagenationUsers } from '@/interfaces/pagenation.interface';

export class UserController {
  public user = Container.get(UserService);


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
      const filterUser = this.Filter(req);
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

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
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
