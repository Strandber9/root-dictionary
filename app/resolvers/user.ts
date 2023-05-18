import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from "type-graphql";
import { User } from "../entities/User";
import { UserInput } from "./types/user-input";
import { WordBook } from "../entities/WordBook";
import { UserModel, WordBookModel } from "../model/models";

@Resolver((_of) => User)
export class UserResolver {
    @Query((_returns) => User, { nullable: false })
    async returnUser(@Arg("id") id: string) {
        return await UserModel.findById({ _id: id });
    }

    @FieldResolver((_type) => WordBook)
    async word_book(@Root() user: User): Promise<Array<WordBook>> {
        return await WordBookModel.find({ user: user._doc._id });
    }

    @Mutation(() => User)
    async createUser(@Arg("data") { username, email }: UserInput): Promise<User> {
        const user = (
            await UserModel.create({
                username,
                email,
            })
        ).save();
        return user as unknown as User;
    }
}
