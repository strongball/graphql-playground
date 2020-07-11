import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Container } from "typedi";

(async () => {
    const app = express();

    await createConnection();

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            container: Container,
            resolvers: [__dirname + "/resolvers/**/*.ts", __dirname + "/resolvers/**/*.js"],
        }),
        context: ({ req, res }) => {
            return { req, res };
        },
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(8000, () => {
        console.log("express server started");
    });
})();
