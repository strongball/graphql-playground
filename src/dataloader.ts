import DataLoader from 'dataloader';
import { Movie } from "./entity/Movie";
import { User } from './entity/User';
import { MovieCategory } from './entity/MovieCategory';
// import { User } from './entity/User';


export interface MyDataloader {
  movies: DataLoader<number, Movie>
  userMovies: DataLoader<number, Movie[]>
  movieCategories: DataLoader<number, MovieCategory[]>
}

function sortOrder<T>(items: T[], key: string, ids: number[] | readonly number[]): T[] {
  return items.sort((a, b) => ids.indexOf(a[key]) - ids.indexOf(b[key]))
}

function dataloaders(): MyDataloader {
  return {
    movies: new DataLoader(
      async function loadMovies(movieIds: readonly number[]) {
        const movies = await Movie.findByIds(movieIds as number[]);
        return movies.sort((a, b) => movieIds.indexOf(a.id) - movieIds.indexOf(b.id))
      }
    ),
    userMovies: new DataLoader(
      async function loadMovies(userIds: readonly number[]): Promise<Movie[][]> {
        const users = await User.findByIds(userIds as number[], { relations: ["likeMovies"] })
        return sortOrder(users, "id", userIds).map(item => item.likeMovies);
      }
    ),
    movieCategories: new DataLoader(
      async function loadCategories(movieIds: readonly number[]): Promise<MovieCategory[][]> {
        const movies = await Movie.findByIds(movieIds as number[], { relations: ["categories"] });
        return sortOrder(movies, "id", movieIds).map(item => item.categories);
      }
    )
  }
}
export default dataloaders;