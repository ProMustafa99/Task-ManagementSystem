import { Task } from '@/interfaces/task.interface';
import { TaskService } from '@/services/task.service';
import { NextFunction, Request, Response } from 'express';
import { json } from 'sequelize';
import { Container } from 'typedi';

export class TaskContrller {
    public task = Container.get(TaskService);

    public getAllTask = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const pageNumber = Number(req.query.page) || 1;
            const finadAllTask: Task[] = await this.task.getAllTask(pageNumber);

            if (finadAllTask.length === 0) {
                res.status(200).json({ data: "No Tasks have been created" });
            }

            else {
                res.status(200).json({ data: finadAllTask });
            }

        }
        catch (error) {
            next(error);
        }

    }

    public deleteAllTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const finadAllTask = await this.task.deleteAllTasks();
            res.status(200).json({ data: finadAllTask });
        }
        catch (error) {
            next(error);
        }

    }

    public markTaskAsDone = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskId = Number(req.params.id);
            const updatTask = await this.task.markTaskAsDone(taskId);
            res.status(200).json({ message: `Task Is Done`, data: updatTask });
        }
        catch (error) {
            next(error);
        }
    }

    public updateTaskAssignee = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const taskId = Number(req.params.id);
            const agentId = req.body.assignee;
            const reassign = await this.task.updateTaskAssignee(taskId, agentId);
            res.status(200).json({ messgae: `Re-assinge the Task For User Id ${agentId}` });
        }

        catch (error) {
            next(error);
        }
    }
}