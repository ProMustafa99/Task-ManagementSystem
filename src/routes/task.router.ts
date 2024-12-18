import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware, Authorization } from '@middlewares/auth.middleware';
import { TaskContrller } from '@/controllers/task.controller';


export class TaskRoute implements Routes {
  public path = '/task';
  public router = Router();
  public task = new TaskContrller();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, Authorization(52), this.task.getAllTask);
    this.router.patch(`${this.path}/:id(\\d+)`, AuthMiddleware,this.task.markTaskAsDone);
    this.router.put(`${this.path}/:id(\\d+)`, AuthMiddleware,this.task.updateTaskAssignee);
    this.router.delete(`${this.path}`, AuthMiddleware, Authorization(52), this.task.deleteAllTask);
  }
}
