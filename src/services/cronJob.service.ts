import Container from 'typedi';
import cron from 'node-cron';
import { EmailService } from '@services/ email.service';
import { DB } from '@database';
import sequelize,{Op} from 'sequelize';

export class CronJobService {

    public handlingEmail = Container.get(EmailService);
    private allUserCount: any;
    private allPostActive: any;
    private allPostDeactivated: any;
    private allPostCreatedToday :any;

    private async fetchActiveUserCount() {
        const result = await DB.Users.findOne({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('user_name')), 'user_name'],
            ],
            where: {
                status: 1
            },
            raw: true
        });

        if (result) {
            this.allUserCount = result.user_name;
        } else {
            this.allUserCount = 0;
        }
    }

    private async fetchActivePostCount() {
        const result = await DB.Posts.findOne({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'id'],
            ],
            where: {
                state_id: 300
            },
            raw: true
        });

        if (result) {
            this.allPostActive = result.id;
        } else {
            this.allPostActive = 0;
        }
    }

    private async fetchDeactivatedPostCount() {
        const result = await DB.Posts.findOne({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'id'],
            ],
            where: {
                state_id: 102
            },
            raw: true
        });

        if (result) {
            this.allPostDeactivated = result.id;
        } else {
            this.allPostDeactivated = 0;
        }
    }

    private async fetchPostTodayCount() {
    
        const result = await DB.Posts.findOne({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'id'],
            ],
            where: {
                created_on: {
                    [Op.gt]: sequelize.fn('CURDATE')
                },
            },
            raw: true
        });
    
        if (result) {
            this.allPostCreatedToday = result.id;
        } else {
            this.allPostCreatedToday = 0;
        }
    }
    
    public async StartCron() {

        await this.fetchActiveUserCount();
        await this.fetchActivePostCount();
        await this.fetchDeactivatedPostCount();
        await this.fetchPostTodayCount();

        const message = `
        Active user count: ${this.allUserCount} Users
        Active post count: ${this.allPostActive} Posts
        Deactivated post count: ${this.allPostDeactivated} Posts,
        Created Post Total Count : ${this.allPostCreatedToday} Posts`;

        cron.schedule('59 * * * *', async () => {
            this.handlingEmail.SendEmailUsingCronJob(`${message}`);
        });
        
    }
}

