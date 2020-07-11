import { Service } from "typedi";

import { User } from "../entity/User.model";
import { Movie } from "../entity/Movie.model";

interface UserInput {
    firstName: string;
    lastName: string;
    age: number;
}
interface LikeInput {
    userId: number;
    movieId: number;
    like: boolean;
}

@Service()
export class UserService {
    async find(): Promise<User[]> {
        const [users, count] = await User.findAndCount();
        return users;
    }
    async findAllByIds(ids: number[]): Promise<(User | undefined)[]> {
        const users = await User.findByIds(ids);
        return ids.map(id => users.find(user => user.id === id));
    }

    async create(input: UserInput): Promise<User> {
        const user = await User.create({
            firstName: input.firstName,
            age: input.age,
        }).save();
        return user;
    }
    async update(id: number, input: UserInput): Promise<User> {
        const user = await User.findOne(id);

        if (!user) {
            throw new Error(`User id ${id} is error.`);
        }
        user.firstName = input.firstName || user.firstName;
        user.age = input.age || user.age;

        user.save();
        return user;
    }

    async delete(id: number): Promise<boolean> {
        await User.delete({ id });
        return true;
    }

    async likeMovie({ userId, movieId, like }: LikeInput): Promise<boolean> {
        const user = await User.findOne(userId, { relations: ["likeMovies"] });
        if (!user) {
            throw new Error("No user");
        }
        const movie = await Movie.findOne(movieId);
        if (!movie) {
            throw new Error("No movie");
        }

        const query = User.createQueryBuilder()
            .relation("likeMovies")
            .of([{ id: userId }]);

        query.loadMany();
        if (like) {
            if (!user.likeMovies.some(likedMovie => likedMovie.id === movieId)) {
                await query.add({ id: movieId });
            }
        } else {
            await query.remove({ id: movieId });
        }
        return true;
    }

    async usersLikeMovies(userIds: number[]): Promise<Movie[][]> {
        const users = await User.findByIds(userIds as number[], { relations: ["likeMovies"] });
        return userIds.map(id => users.find(user => user.id === id)?.likeMovies || []);
    }
}
