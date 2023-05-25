import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property, getModelForClass, Index } from "@typegoose/typegoose";

import { Word } from "./Word";
import { User } from "./User";

import { Ref } from "../types";

@Index({ name: 1, user: 1 }, { unique: true })
@ObjectType({ description: "The WordBook model" })
export class WordBook {
    @Field(() => ID)
    id?: string;

    @Field()
    @Property({})
    name!: string;

    @Field((_type) => User)
    @Property({ ref: () => User, required: true })
    user!: Ref<User>;

    @Field((_type) => [Word])
    @Property({ type: () => [String], default: [], required: true, nullable: true })
    words!: string[];

    @Field({ nullable: true })
    @Property({ default: new Date(), required: false, nullable: true })
    created_date?: Date;

    _doc?: WordBook;
}
