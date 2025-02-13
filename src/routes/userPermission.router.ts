import { Router } from 'express';
import { userPermissionController } from '@controllers/userPermission.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware ,Authorization} from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { CreateUserPermissionDto } from '@/dtos/user_permission.dto';

export class UserPermissionRoute implements Routes {
    public path = '/permissions';
    public router = Router();
    public permission = new userPermissionController();
  
    constructor() {
      this.initializeRoutes();
    }
  
    private initializeRoutes() {
      this.router.get(`${this.path}`,this.permission.getPermissionForAllUser);
      this.router.get(`${this.path}/names`,this.permission.getPermissionNames);
      this.router.post(`${this.path}`, AuthMiddleware, Authorization(100), ValidationMiddleware(CreateUserPermissionDto), this.permission.createUserPermission);
      this.router.post(`${this.path}/:permission_id/user/:user_id`, AuthMiddleware, Authorization(100), this.permission.deleteUserPermission);
    }
  }
  