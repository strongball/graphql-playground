import { Service } from "typedi";
import { In } from "typeorm";
import { Movie } from "../entity/Movie.model";
import { MovieCategory } from "../entity/MovieCategory.model";

interface MovieInput {
    title?: string;
    minutes?: number;
    categoryIds?: number[];
}

@Service()
export class MovieService {
    async find(): Promise<Movie[]> {
        const [movies, count] = await Movie.findAndCount();
        return movies;
    }
    async findAllByIds(ids: number[]): Promise<(Movie | undefined)[]> {
        const movies = await Movie.find({
            where: {
                id: In(ids),
            },
        });
        // const movies = await Movie.findByIds(
        //   ids,
        //   // { relations: ["categories"] },
        // );
        return ids.map(id => movies.find(movie => movie.id === id));
    }
    async create(input: MovieInput): Promise<Movie> {
        const categories = await MovieCategory.findByIds(input?.categoryIds || []);
        const movie = await Movie.create({
            title: input.title,
            minutes: input.minutes,
            categories: categories,
        }).save();
        return movie;
    }
    async update(id: number, input: MovieInput): Promise<Movie> {
        const movie = await Movie.findOne(id, { relations: ["categories"] });

        if (!movie) {
            throw new Error(`Movie id ${id} is error.`);
        }
        movie.title = input.title || movie.title;
        movie.minutes = input.minutes || movie.minutes;

        if (input.categoryIds) {
            const categories = await MovieCategory.findByIds(input.categoryIds);
            movie.categories = categories;
        }
        movie.save();
        return movie;
    }

    async delete(id: number): Promise<boolean> {
        await Movie.delete({ id });
        return true;
    }
}
