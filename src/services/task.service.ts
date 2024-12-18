import { DB } from "@/database";
import { HttpException } from "@/exceptions/httpException";
import { Task } from "@/interfaces/task.interface";
import { Service } from 'typedi';
import sequelize, { Op } from 'sequelize';
import { agent } from "supertest";

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
                ['id', "ID"], ['parent_table', 'Parent table'], ['created_at', 'Date added'],
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
            offset: 0,
            limit: 100,
        });

        return findAllTask;
    }

    public async fetchTaskCount(): Promise<number> {
        const countTask = await DB.Task.findAndCountAll({
            where: { status_id: 101 }
        });
        return countTask.count;
    }

    public async fetchTaskCountForAgents(agentId) {
        const countTaskForAgents = await DB.Task.findAndCountAll({
            where: {
                [Op.and]: [
                    { assignee: agentId },
                    { status_id: 101 }
                ]
            }
        });

        return countTaskForAgents.count;
    }

    public async createNewTask(type, parent, parentTable: string) {

        var assignee: number = 67;

        const agentTaskCounts = await Promise.all([
            this.fetchTaskCountForAgents(67),
            this.fetchTaskCountForAgents(68),
            this.fetchTaskCountForAgents(69),
        ]);

        const [countTaskA1, countTaskA2, countTaskA3] = agentTaskCounts;
        const totalTask = countTaskA1 + countTaskA2 + countTaskA3;

        const avgTask = [
            { id: 67, agentName: "Agent1", avgTask: Number(((countTaskA1 / totalTask) * 100).toFixed(0)) },
            { id: 68, agentName: "Agent2", avgTask: Number(((countTaskA2 / totalTask) * 100).toFixed(0)) },
            { id: 69, agentName: "Agent3", avgTask: Number(((countTaskA3 / totalTask) * 100).toFixed(0)) }
        ];

        if (totalTask > 0) {
            if (avgTask[0].avgTask < 40) {
                assignee = 67;
            } else if (avgTask[1].avgTask < 40) {
                assignee = 68;
            } else {
                assignee = 69;
            }
        }

        await DB.Task.create({
            type: type,
            parent_table: parentTable,
            parent_id: parent.id || parent.uid,
            assignee: assignee,
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