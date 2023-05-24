import { ResolverData, AuthChecker } from "type-graphql";
import { ApplicationContext } from "./context.interface";
import { UserModel } from "../model/models";
import JwtProvider from "./jwt/token.provider";
import { JwtPayload } from "jsonwebtoken";

export const applicationAuthChecker: AuthChecker<ApplicationContext> = async (
    { root, args, context, info },
    roles
): Promise<boolean> => {
    // here we can read the user from context
    // and check his permission in the db against the `roles` argument
    // that comes from the `@Authorized` decorator, eg. ["ADMIN", "MODERATOR"]
    if (!context.user) {
        const decodedData: JwtPayload = JwtProvider.verify(context.token!) as JwtPayload;
        context.user = await UserModel.findOne({ _id: decodedData.data, token: context.token });
        // console.log(context.user);
    }

    return !!context.user; // or false if access is denied
};
