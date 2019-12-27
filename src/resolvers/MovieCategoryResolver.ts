import { Query, Resolver } from "type-graphql";
import { MovieCategory } from "../entity/MovieCategory";

@Resolver()
export class MovieCategoryResolver {

  @Query(() => [MovieCategory])
  movieCategories() {
    return MovieCategory.find();
  }
}
