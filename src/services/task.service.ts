import { DB } from "@/database";
import { Task } from "@/interfaces/task.interface";


export class TaskService {

    public async getAllTask(): Promise<Task[]> {
        const findAllTask: Task[] = await DB.Task.findAll();
        return findAllTask;
    }

}