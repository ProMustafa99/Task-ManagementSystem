import { DB } from '@/database';
import { TaskType } from '@interfaces/taskType.interface';
import { Service } from 'typedi';

@Service()
export class TaskTypeService {
    public async getAllTaskTaskType(): Promise<TaskType[]> {
        const finadAllTaskType: TaskType[] = await DB.TaskType.findAll();
        return finadAllTaskType;
    };
}