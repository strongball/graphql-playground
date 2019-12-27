import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import dataloaders from "./dataloader";

import { HelloWorldResolver } from "./resolvers/HelloWorldResolver";
import { MovieResolver } from "./resolvers/MovieResolver";
import { UserResolver } from "./resolvers/UserResolver";
import { MovieCategoryResolver } from "./resolvers/MovieCategoryResolver";
(async () => {
  const app = express();

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloWorldResolver, MovieResolver, UserResolver, MovieCategoryResolver]
    }),
    context: ({ req, res }) => {
      return { req, res, dataloaders: dataloaders() }
    }
  });

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(8000, () => {
    console.log("express server started");
  });
})();