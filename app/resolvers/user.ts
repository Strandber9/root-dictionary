import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from "type-graphql";
import { User, UserModel } from "../entities/User";
import { UserInput } from "./types/user-input";

@Resolver((_of) => User)
export class UserResolver {
    @Query((_returns) => User, { nullable: false })
    async returnUser(@Arg("id") id: string) {
        return await UserModel.findById({ _id: id });
    }

    // @FieldResolver((_type) => Word)
    // async product(@Root() cart: Word): Promise<Word> {
    //     console.log(cart, "cart!");
    //     return (await WordModel.findById(cart._doc.products))!;
    // }

    @Mutation(() => User)
    async createUser(@Arg("data") { username, email }: UserInput): Promise<User> {
        const user = (
            await UserModel.create({
                username,
                email,
            })
        ).save();
        return user;
    }
}
