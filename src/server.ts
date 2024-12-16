import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';
import { PostRouter } from '@routes/posts.router'; 
import {UserPermissionRoute} from '@routes/userPermission.router'

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute() ,new PostRouter() , new UserPermissionRoute()]);

app.listen();
