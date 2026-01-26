import { Injectable } from '@nestjs/common';

export type User = {
    userId: number;
    username: string;
    password: string;
};

// to be replaced with a real database
const users: User[] = [
    {
        userId: 1,
        username: 'Hello',
        password: 'Hello',
    },
    {
        userId: 2,
        username: 'Hi',
        password: 'Hi',
    }
]

@Injectable()
export class UsersService{
    async findUserByName(username:string) : Promise<User | undefined> {
        return users.find((user) => user.username === username);
    }
}