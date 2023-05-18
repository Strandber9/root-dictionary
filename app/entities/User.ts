import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property } from "@typegoose/typegoose";
import { WordBook } from "./WordBook";
import { Ref } from "../types";

@ObjectType({ description: "The User model" })
export class User {
    [x: string]: any;
    @Field(() => ID)
    id?: number;

    @Field()
    @Property({ required: true })
    username?: String;

    @Field()
    @Property({ required: true })
    email?: String;

    @Field((_type) => [WordBook])
    @Property({ ref: () => WordBook, default: [], required: true, nullable: true, type: () => [String] })
    word_book?: [Ref<WordBook>];

    @Field({ nullable: true })
    @Property({ default: new Date(), required: false, nullable: true })
    created_date?: Date;
}
