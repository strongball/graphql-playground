import { Query, Resolver } from "type-graphql";
import { MovieCategory } from "../entity/MovieCategory.model";

@Resolver()
export class MovieCategoryResolver {
    @Query(() => [MovieCategory])
    movieCategories() {
        return MovieCategory.find();
    }
}
