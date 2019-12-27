import {
  Resolver,
  Mutation,
  Arg,
  Int,
  Query,
  InputType,
  Field,
  Root,
  FieldResolver,
  Ctx
} from "type-graphql";
import { Movie } from "../entity/Movie";
import { MovieCategory } from "../entity/MovieCategory";
import { Context } from "../context";

@InputType()
class MovieInput {
  @Field()
  title: string;

  @Field(() => Int)
  minutes: number;

  @Field(() => [Int])
  categoryIds: number[];
}

@InputType()
class MovieUpdateInput {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => Int, { nullable: true })
  minutes?: number;

  @Field(() => [Int], { nullable: true })
  categoryIds?: number[];
}

@Resolver(() => Movie)
export class MovieResolver {
  @Mutation(() => Movie)
  async createMovie(@Arg("input", () => MovieInput) input: MovieInput) {
    const categories = await MovieCategory.findByIds(input.categoryIds);
    const movie = await Movie.create({
      title: input.title,
      minutes: input.minutes,
      categories: categories,
    }).save();

    return movie;
  }

  @Mutation(() => Boolean)
  async updateMovie(
    @Arg("id", () => Int) id: number,
    @Arg("input", () => MovieUpdateInput) input: MovieUpdateInput
  ) {
    const movie = await Movie.findOne(id, {relations: ["categories"]});

    if(!movie){
      return false
    }
    movie.title = input.title || movie.title;
    movie.minutes = input.minutes || movie.minutes;

    if (input.categoryIds) {
      const categories = await MovieCategory.findByIds(input.categoryIds);
      movie.categories = categories;
    }
    movie.save();
    return true;
  }

  @Mutation(() => Boolean)
  async deleteMovie(@Arg("id", () => Int) id: number) {
    await Movie.delete({ id });
    return true;
  }

  @Query(() => [Movie])
  movies() {
    return Movie.find();
  }

  @FieldResolver()
  titleLength(@Root() movie: Movie) {
    return movie.title.length
  }

  @FieldResolver()
  async categories(@Root() movie: Movie, @Ctx() ctx: Context): Promise<MovieCategory[]> {
    // const movies = await Movie.findOne(movie.id, { relations: ["categories"] });
    // return movies?.categories || [];
    return ctx.dataloaders.movieCategories.load(movie.id);
  }
}
