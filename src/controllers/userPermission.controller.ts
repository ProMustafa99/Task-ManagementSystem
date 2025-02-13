import { userPermissionService } from '@/services/userPermission.service';
import { UserPermission } from '@/interfaces/userPermission.interface';
import { Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { PermissionService } from '@/services/permission.service';
import { Permission } from '@/interfaces/permission.interface';
import { CreateUserPermissionDto } from '@/dtos/user_permission.dto';

export class userPermissionController {
    public userPermission = Container.get(userPermissionService);
    public permission = Container.get(PermissionService)

    public getPermissionForAllUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userPermission: UserPermission[] = await this.userPermission.getPermission();
            res.status(200).json({ data: userPermission, message: "findAll" });
        } catch (error) {
            console.log(`error ${error}`)
            next(error);
        }
    }

    public getPermissionNames = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const permissions: Permission[] = await this.permission.getPermissionNames();
            res.status(200).json(permissions);
        } catch (error) {
            next(error);
        }
    }

    public createUserPermission = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userPermissionData: CreateUserPermissionDto = req.body;

            const result = await this.userPermission.createUserPermission(userPermissionData);
            
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    public deleteUserPermission = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {user_id, permission_id} = req.params;

            const result = await this.userPermission.deleteUserPermission(Number(permission_id), Number(user_id));

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}