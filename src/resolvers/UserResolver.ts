import {
  Resolver,
  Mutation,
  Arg,
  Int,
  Query,
  InputType,
  Field,
  FieldResolver,
  Root,
  Ctx,

} from "type-graphql";
import { User } from "../entity/User";

import { Context } from "../context";
import { Movie } from "../entity/Movie";

@InputType()
class UserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field(() => Int)
  age: number;
}

@InputType()
class UserUpdateInput {
  @Field(() => String, { nullable: true })
  firstName: string;

  @Field(() => String, { nullable: true })
  lastName: string;

  @Field(() => Int, { nullable: true })
  age: number;
}

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => User)
  async createUser(@Arg("options", () => UserInput) options: UserInput) {
    const user = await User.create(options).save();
    return user;
  }

  @Mutation(() => Boolean)
  async updateUser(
    @Arg("id", () => Int) id: number,
    @Arg("input", () => UserUpdateInput) input: UserUpdateInput
  ) {
    await User.update({ id }, input);
    return true;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => Int) id: number) {
    await User.delete({ id });
    return true;
  }

  @Mutation(() => Boolean)
  async likeMovie(@Arg("userId", () => Int) userId: number, @Arg("movieId", () => Int) movieId: number, @Arg("like", () => Boolean) like: boolean) {
    const user = await User.findOne(userId, {relations:['likeMovies']});
    if (!user) {
      throw new Error("No user")
    }
    const movie = await Movie.findOne(movieId);
    if (!movie) {
      throw new Error("No movie")
    }

    const query =  User.createQueryBuilder().relation("likeMovies").of([{id: userId}])
    
    if(like){
      await query.add({id: movieId});
    }else {
      await query.remove({id: movieId});

    }
    return true;
  }

  @Query(() => [User])
  Users() {
    return User.find();
  }

  @FieldResolver(() => [Movie])
  likeMovies(@Root() user: User, @Ctx() ctx: Context) {
    return ctx.dataloaders.userMovies.load(user.id);
  }
}
