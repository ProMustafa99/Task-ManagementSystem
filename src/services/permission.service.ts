import { Service } from 'typedi';
import { DB } from '@database';
import { Permission } from '@/interfaces/permission.interface';

@Service()
export class PermissionService {

    public async getPermissionNames (): Promise<Permission[]>  {
        const getpermission:Permission[] = await DB.Permission.findAll();
        return getpermission;
    }
}