import { DB } from "@/database";
import { HttpException } from "@/exceptions/httpException";
import { Task } from "@/interfaces/task.interface";
import { Service } from 'typedi';
import sequelize, { Op, literal, where } from 'sequelize';

@Service()
export class TaskService {

    public async getAllTask(pageNumber: number, filters: any): Promise<Task[]> {

        const offset = (pageNumber - 1) * 5;
        const whereConditions: any = {};

        if (filters.agentId)
            whereConditions.assignee = filters.agentId;

        if (filters.taskType)
            whereConditions.type = filters.taskType;

        if (filters.status)
            whereConditions.status_id = filters.status;

        if (filters.startDate)
            whereConditions.created_at = {
                [Op.gte]: filters.startDate,
            };

        const findAllTask: Task[] = await DB.Task.findAll({
            attributes: [
                ['id',"ID"],['parent_table','Parent table'],['created_at','Date added'],
                [
                    sequelize.literal(`
                        CASE
                            WHEN parent_table = 'User' THEN 
                                (SELECT user_name 
                                 FROM User
                                 WHERE User.uid = TaskModel.parent_id)
                            WHEN parent_table = 'Post' THEN
                                (SELECT title_en 
                                 FROM Post
                                 WHERE Post.id = TaskModel.parent_id)
                            ELSE NULL
                        END
                    `),
                    'Parent title'
                ],
                [
                    sequelize.literal(`
                        (SELECT user_name 
                         FROM User 
                         WHERE User.uid = TaskModel.assignee)
                    `),
                    'Agent name'
                ],
                [
                    sequelize.literal(`
                        (SELECT title_en 
                         FROM task_type 
                         WHERE task_type.id = TaskModel.type)
                    `),
                    'Task Type'
                ],
                [
                    sequelize.literal(`
                        (SELECT Name_en 
                         FROM Status 
                         WHERE Status.id = TaskModel.status_id)
                    `),
                    'status'
                ]
            ],
            where: whereConditions,
            offset: offset,
            limit: 5,
        });

        return findAllTask;
    }
    
    public async fetchTaskCount(): Promise<number> {
        const countTask = await DB.Task.findAndCountAll();
        return countTask.count;
    }

    public async fetchTaskCountForAgents(agentId) {
        const countTaskForAgents = await DB.Task.findAndCountAll({
            where: { assignee: agentId }
        });

        return countTaskForAgents.count;
    }

    public async createNewTask(type, parent, parentTable: string) {

        const totalTask = await this.fetchTaskCount();
        const countTaskForAgent1 = await this.fetchTaskCountForAgents(67);
        const countTaskForAgent2 = await this.fetchTaskCountForAgents(68);
        const countTaskForAgent3 = await this.fetchTaskCountForAgents(69);
        var assignee: number;

        await DB.Task.create({
            type: type,
            parent_table: parentTable,
            parent_id: parent.id || parent.uid,
            assignee: 67,
            created_at: new Date(),
        });
    }

    public async markTaskAsDone(taskId: number): Promise<string> {

        const findTask = await DB.Task.findOne({
            where: {
                [Op.or]: {
                    id: taskId,
                    parent_id: taskId
                }

            }
        });

        if (!findTask) throw new HttpException(404, "Task not found");

        const updateTask = await DB.Task.update(
            { status_id: 200 },
            {
                where: {
                    [Op.or]: {
                        id: taskId,
                        parent_id: taskId
                    }

                }
            }
        );

        return `Task ${taskId} has been successfully marked as done.`;
    }

    public async updateTaskAssignee(taskId: number, agentId: number) {
        const findTask = await DB.Task.findOne({
            where: { id: taskId }
        });

        if (!findTask) throw new HttpException(404, "Task not found");

        const reassign = await DB.Task.update(
            { assignee: agentId },
            { where: { id: taskId } }
        );

        return reassign;
    }

    public async deleteAllTasks(): Promise<void> {
        await DB.Task.destroy({
            where: {},
            truncate: true,
        });
        console.log("All tasks have been deleted.");
    }

}