import { Router } from 'express';
import { userPermissionController } from '@controllers/userPermission.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware ,Authorization} from '@middlewares/auth.middleware';

export class UserPermissionRoute implements Routes {
    public path = '/permissions';
    public router = Router();
    public permission = new userPermissionController();
  
    constructor() {
      this.initializeRoutes();
    }
  
    private initializeRoutes() {
      this.router.get(`${this.path}`,this.permission.getPermissionForAllUser);
    }
  }
  