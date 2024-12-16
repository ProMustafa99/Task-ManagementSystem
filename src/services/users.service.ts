import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { DB } from '@database';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@/exceptions/httpException';
import { User } from '@interfaces/users.interface';
import { Op } from 'sequelize';

@Service()
export class UserService {

  public async findAllUser(pageNumber: number, userName: string): Promise<User[]> {
    const offset = (pageNumber - 1) * 5;

    const allUser = await DB.Users.findAll({
      offset: offset,
      limit: 5,
      where: userName ? {
        user_name: {
          [Op.like]: `%${userName}%`
        }
      } : undefined
    });

    return allUser;
  }

  public async findUserById(userId: number): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.Users.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const hashedPassword = await hash(userData.password, 10);
    const createUserData: User = await DB.Users.create({ ...userData, password: hashedPassword });
    return createUserData;
  }

  public async updateUser(userId: number, userData: CreateUserDto): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    const hashedPassword = await hash(userData.password, 10);
    await DB.Users.update({ ...userData, password: hashedPassword }, { where: { uid: userId } });

    const updateUser: User = await DB.Users.findByPk(userId);
    return updateUser;
  }

  public async deleteUser(userId: number): Promise<User> {
    const findUser: User = await DB.Users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    if (Number(findUser.status) === 0) throw new HttpException(403, "User is not active");


    await DB.Users.update({ status: 0 }, { where: { uid: userId } });

    return findUser;
  }
}
