import "reflect-metadata";
import { createConnection } from "typeorm";
import Koa from "koa";
import { ApolloServer } from "apollo-server-koa";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";

(async () => {
    const app = new Koa();

    await createConnection();
    const schema = await buildSchema({
        resolvers: [__dirname + "/resolvers/**/*.ts", __dirname + "/resolvers/**/*.js"],
        container: Container,
        dateScalarMode: "isoDate",
    });

    const apolloServer = new ApolloServer({
        schema,
        context: ctx => {
            return ctx;
        },
    });

    apolloServer.applyMiddleware({ app });

    app.listen(8000, () => {
        console.log("Koa server started");
    });
})();
