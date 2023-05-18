import { ApolloServer, ServerRegistration } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { connect } from "mongoose";

import { WordResolver } from "./resolvers/Dictionary";
import { UserResolver } from "./resolvers/user";
import { WordBookResolver } from "./resolvers/word-book";

const main = async () => {
    const schema = await buildSchema({
        resolvers: [WordResolver, UserResolver, WordBookResolver],
        emitSchemaFile: true,
        validate: false,
    });

    // create mongoose connection
    const MONGODB_URI = "mongodb+srv://rein999:973TpflHHlG3tLyn@cluster-study.gjbpqjh.mongodb.net/english";
    // const MONGODB_URI = "mongodb://localhost:27017/graphQL";
    const mongoose = await connect(MONGODB_URI);
    await mongoose.connection;

    const server = new ApolloServer({
        schema,
        // plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
    });

    const app = Express();

    await server.start();

    server.applyMiddleware({ app } as unknown as ServerRegistration);

    app.use(Express.json());
    app.post("/hello5", (req, res) => {
        const result = {
            code: 0,
            message: "success",
        };
        res.send(result);
    });

    app.get("/do", (req, res) => {
        const out = {
            msg: "🚀🚀🚀",
        };
        res.send(out);
    });

    app.listen({ port: 3333 }, () =>
        console.log(`🚀 Server ready and listening at ==> http://localhost:3333${server.graphqlPath}`)
    );
};

main().catch((error) => {
    console.log(error, "error");
});
