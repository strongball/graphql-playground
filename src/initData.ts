import { createConnection } from "typeorm";
import { MovieCategory } from "./entity/MovieCategory.model";
import { User } from "./entity/User.model";
import { Movie } from "./entity/Movie.model";

(async () => {
    await createConnection();

    await MovieCategory.insert({ id: 1, name: "恐怖" });
    await MovieCategory.insert({ id: 2, name: "有趣" });
    await MovieCategory.insert({ id: 3, name: "不有趣" });
    await MovieCategory.insert({ id: 4, name: "無聊" });

    await User.insert({ id: 1, firstName: "first", lastName: "first", age: 87 });
    await User.insert({ id: 2, firstName: "Second", lastName: "Second", age: 87 });

    await Movie.create({ title: "Movie1", minutes: 23, categories: [{ id: 1 }] }).save();
    await Movie.create({ title: "Movie2", minutes: 46, categories: [{ id: 2 }] }).save();
    await Movie.create({ title: "Serr", minutes: 46, categories: [{ id: 1 }, { id: 2 }] }).save();
})();
