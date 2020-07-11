import { Resolver, Mutation, Arg, Int, Query, InputType, Field, FieldResolver, Root } from "type-graphql";
import { User } from "../entity/User.model";

import { Movie } from "../entity/Movie.model";
import { Service, Inject } from "typedi";
import { UserService } from "../services/User.service";
import { Loaders, Loader } from "../decorators/dataLoader";

@InputType()
class UserInput {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field(() => Int)
    age: number;
}

@Service()
@Resolver(() => User)
export class UserResolver {
    @Inject()
    userService: UserService;

    @Mutation(() => User)
    async createUser(@Arg("options", () => UserInput) input: UserInput): Promise<User> {
        const user = await this.userService.create(input);
        return user;
    }

    @Mutation(() => User)
    async updateUser(@Arg("id", () => Int) id: number, @Arg("input", () => UserInput) input: UserInput): Promise<User> {
        const user = await this.userService.update(id, input);
        return user;
    }

    @Mutation(() => Boolean)
    async deleteUser(@Arg("id", () => Int) id: number) {
        await this.userService.delete(id);
        return true;
    }

    @Mutation(() => Boolean)
    async likeMovie(
        @Arg("userId", () => Int) userId: number,
        @Arg("movieId", () => Int) movieId: number,
        @Arg("like", () => Boolean) like: boolean,
    ) {
        const success = await this.userService.likeMovie({
            userId,
            movieId,
            like,
        });
        return success;
    }

    @Query(() => [User])
    Users() {
        return this.userService.find();
    }

    @FieldResolver(() => [Movie])
    async likeMovies(
        @Root() user: User,
        @Loaders("user.likeMovies") loader: Loader<number, Movie[]>,
    ): Promise<Movie[]> {
        const movies = await loader(ids => this.userService.usersLikeMovies(ids)).load(user.id);
        return movies;
    }
}
