import { ApolloServer, ServerRegistration, AuthenticationError, ForbiddenError } from "apollo-server-express";
import Express from "express";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { connect } from "mongoose";
import dotenv from "dotenv";

import { WordResolver } from "./resolvers/Dictionary";
import { UserResolver } from "./resolvers/user";
import { WordBookResolver } from "./resolvers/word-book";

import { applicationAuthChecker } from "./auth/Authorization";
import { ApplicationContext } from "./auth/context.interface";
import passport from "passport";
import NaverOauthRouter from "./router/auth/naver.oauth";
import KakaoOauthRouter from "./router/auth/kakao.oauth";

dotenv.config();

const main = async () => {
    const schema = await buildSchema({
        resolvers: [WordResolver, UserResolver, WordBookResolver],
        emitSchemaFile: true,
        validate: false,
        authChecker: applicationAuthChecker,
    });

    // create mongoose connection
    // const MONGODB_URI = "mongodb+srv://rein999:973TpflHHlG3tLyn@cluster-study.gjbpqjh.mongodb.net/english";
    // const MONGODB_URI = "mongodb://localhost:27017/english";
    const mongoose = await connect(process.env.MONGODB_URI!);
    await mongoose.connection;

    const server = new ApolloServer({
        schema,
        // plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
        context: ({ req }): ApplicationContext => {
            return {
                token: req.headers.authorization?.substring(7),
                user: undefined,
            };
        },
    });

    const app = Express();

    await server.start();

    server.applyMiddleware({ app } as unknown as ServerRegistration);

    // Passport 초기화 및 세션 연결
    app.use(passport.initialize());

    app.use(Express.json());
    // OAuth2 인증
    app.use("/auth", NaverOauthRouter);
    app.use("/auth", KakaoOauthRouter);

    app.listen({ port: 3333 }, () =>
        console.log(`🚀 Server ready and listening at ==> http://localhost:3333${server.graphqlPath}`)
    );
};

main().catch((error) => {
    console.log(error, "error");
});
