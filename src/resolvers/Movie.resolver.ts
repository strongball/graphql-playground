import { Resolver, Mutation, Arg, Int, Query, InputType, Field, Root, FieldResolver, Ctx } from "type-graphql";
import { Movie } from "../entity/Movie.model";
import { MovieCategory } from "../entity/MovieCategory.model";

import { MovieService } from "../services/Movie.service";
import { Context } from "../context";
import { Loaders, Loader } from "../decorators/dataLoader";

import { Service, Inject } from "typedi";

@InputType()
class MovieInput {
    @Field(() => String, { nullable: true })
    title?: string;

    @Field(() => Int, { nullable: true })
    minutes?: number;

    @Field(() => [Int], { nullable: true })
    categoryIds?: number[];
}

@Service()
@Resolver(() => Movie)
export class MovieResolver {
    @Inject()
    private movieService: MovieService;

    @Mutation(() => Movie)
    async createMovie(@Arg("input", () => MovieInput) input: MovieInput): Promise<Movie> {
        const movie = await this.movieService.create(input);
        return movie;
    }

    @Mutation(() => Movie)
    async updateMovie(
        @Arg("id", () => Int) id: number,
        @Arg("input", () => MovieInput) input: MovieInput,
    ): Promise<Movie> {
        return this.movieService.update(id, input);
    }

    @Mutation(() => Boolean)
    async deleteMovie(@Arg("id", () => Int) id: number) {
        await this.movieService.delete(id);
        return true;
    }

    @Query(() => [Movie])
    async movies(): Promise<Movie[]> {
        const movies = await this.movieService.find();
        return movies;
    }

    @FieldResolver()
    titleLength(@Root() movie: Movie) {
        return movie.title.length;
    }

    @FieldResolver()
    async categories(
        @Root() movie: Movie,
        @Loaders("movie.category") loader: Loader<number, MovieCategory[]>,
    ): Promise<MovieCategory[]> {
        // const loadmovie = await loader.movies.load(movie.id);
        const categories = await loader(async ids => {
            const movies = await this.movieService.findAllByIds(ids);
            return movies.map(movie => movie?.categories || []);
        }).load(movie.id);
        return categories;
    }
}
