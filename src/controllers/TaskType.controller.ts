import { Container } from 'typedi';
import { TaskTypeService } from '@services/taskType.service';
import { NextFunction, Request, Response } from 'express';
import { TaskType } from '@/interfaces/taskType.interface';

export class TaskTypeController {
    public taskType = Container.get(TaskTypeService);

    public getAllTaskTaskType = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const finadAllTaskType: TaskType[] = await this.taskType.getAllTaskTaskType();
            res.status(200).json({ message: finadAllTaskType });
        } catch (error) {
            next(error);
        }
    };
}
