import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { CreateUserDto , UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware, Authorization } from '@middlewares/auth.middleware';
import { TaskTypeController } from '@/controllers/TaskType.controller';


export class TaskTypeRoute implements Routes {
  public path = '/tasktype';
  public router = Router();
  public taskType = new TaskTypeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, Authorization(52), this.taskType.getAllTaskTaskType);
  }
}
