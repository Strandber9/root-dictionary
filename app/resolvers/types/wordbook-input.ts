import { InputType, Field, ID } from "type-graphql";
import { Length, IsEmail } from "class-validator";
import { User } from "../../entities/User";
import { ObjectId } from "mongodb";

@InputType()
export class WordbookInput implements Partial<User> {
    @Field()
    @Length(1, 255)
    name?: String;

    @Field(() => ID)
    user?: String;
}
