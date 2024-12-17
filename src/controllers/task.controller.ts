import { Task } from '@/interfaces/task.interface';
import { TaskService } from '@/services/task.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class TaskContrller {
    public task = Container.get(TaskService);

    public getAllTask = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const finadAllTask: Task[] = await this.task.getAllTask();
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
}