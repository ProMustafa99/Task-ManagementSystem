import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { DB } from '@database';
import { CreateUserDto, LoginDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { UserPermission } from '@/interfaces/userPermission.interface';

const createToken = (user: User): TokenData => {
  const dataStoredInToken: DataStoredInToken = { id: user.uid };
  const expiresIn: number = 60 * 60;

  return { expiresIn, token: sign(dataStoredInToken, SECRET_KEY, { expiresIn }) };
}

const createCookie = (tokenData: TokenData): string => {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
}

@Service()
export class AuthService {

  public async signup(userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await DB.Users.create({ ...userData, password: hashedPassword });

    return createUserData;
  }

  public async login(userData: LoginDto): Promise<{ cookie: string; findUser: User }> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password not matching");

    if (Number(findUser.status) === 0)  throw new HttpException(403, "User is not active");

    const tokenData = createToken(findUser);
    const cookie = createCookie(tokenData);
  

    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email, password: userData.password } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async getUserPermissions(id: number): Promise<Number[]> {
    const userPermissions = await DB.UserPermission.findAll({ where: { user_id: id} });
    const permession = userPermissions.map(p => p.id_permission);

    return permession;
  }
}
