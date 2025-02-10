import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto , UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware, Authorization } from '@middlewares/auth.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, Authorization(52), this.user.getUsers);
    this.router.get(`${this.path}/:id(\\d+)`,AuthMiddleware,Authorization(54), this.user.getUserById);
    this.router.post(`${this.path}`, AuthMiddleware,Authorization(53),ValidationMiddleware(CreateUserDto), this.user.createUser);
    this.router.put(`${this.path}/:id(\\d+)`, AuthMiddleware,Authorization(55),ValidationMiddleware(UpdateUserDto, true), this.user.updateUsers);
    this.router.get(`/user/:id(\\d+)`,this.user.getUserById);
    this.router.put(`/settings/me`, AuthMiddleware,ValidationMiddleware(UpdateUserDto, true),  this.user.updateSettingUser);
    
    this.router.delete(`${this.path}/:id(\\d+)`, AuthMiddleware,AuthMiddleware,Authorization(7), this.user.deleteUser);
  }
}
