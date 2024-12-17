import { DB } from "@/database";
import { HttpException } from "@/exceptions/httpException";
import { Task } from "@/interfaces/task.interface";
import { Service } from 'typedi';
import sequelize, { Op } from 'sequelize';


@Service()
export class TaskService {

    public async getAllTask(): Promise<Task[]> {
        const findAllTask: Task[] = await DB.Task.findAll();
        return findAllTask;
    }

    public async fetchTaskCount(): Promise<number> {
        const countTask = await DB.Task.findOne({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'taskCount'],
            ],
            raw: true
        });

        if (countTask && countTask.taskCount) {
            return countTask.taskCount;
        } else {
            return 0;
        }
    }

    public async createNewTask(parent, parentTable: string, assignee: number) {

        await this.fetchTaskCount();
        await DB.Task.create({
            type: 1,
            title:"Active Post",
            parent_table: parentTable,
            parent_id: parent.id,
            assignee: 67,
            created_at: new Date(),
        });

        // const agentTasks: { [key: string]: number } = {
        //     agent1: Math.floor(0.4 * taskCount),
        //     agent2: Math.floor(0.4 * taskCount),
        //     agent3: Math.floor(0.2 * taskCount)
        // };

        // const agents = [
        //     { id: 67, tasks: agentTasks.agent1 }, 
        //     { id: 68, tasks: agentTasks.agent2 },
        //     { id: 69, tasks: agentTasks.agent3 }
        // ];

        // for (const agent of agents) {
        //     for (let i = 0; i < agent.tasks; i++) {

        //     }
        // }
    }

    public async deleteAllTasks(): Promise<void> {
        await DB.Task.destroy({
            where: {},
            truncate: true,
        });
        console.log("All tasks have been deleted.");
    }

}