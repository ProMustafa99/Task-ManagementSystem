import { userPermissionService } from '@/services/userPermission.service';
import { UserPermission } from '@/interfaces/userPermission.interface';
import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';

export class userPermissionController {
    public permission = Container.get(userPermissionService);

    public getPermissionForAllUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userPermission: UserPermission[] = await this.permission.getPermission();
            res.status(200).json({ data: userPermission, message: "findAll" });
        } catch (error) {
            console.log(`error ${error}`)
            next(error);
        }
    }
}