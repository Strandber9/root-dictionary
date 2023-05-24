import { ObjectType, Field, ID, Authorized } from "type-graphql";
import { prop as Property, index } from "@typegoose/typegoose";
import { WordBook } from "./WordBook";
import { Ref } from "../types";
import { Schema } from "mongoose";
import JwtProvider from "../auth/jwt/token.provider";

@index({ username: 1, providerType: 1 }, { unique: true })
@ObjectType({ description: "The User model" })
export class User {
    [x: string]: any;
    @Field(() => ID)
    id?: number;

    @Field()
    @Property({ required: true })
    snsId!: String;

    @Field()
    @Property({ required: true })
    providerType!: String;

    @Authorized("ADMIN")
    @Field((_type) => [String])
    @Property({ default: [], required: false, nullable: true })
    roles!: string[];

    @Field()
    @Property({ required: true })
    username?: String;

    @Field()
    @Property()
    email?: String;

    @Field()
    @Property()
    token?: String;

    @Field()
    @Property()
    profile_image?: String;

    @Property({ type: Schema.Types.Mixed, _id: false })
    profile_json?: any;

    @Field((_type) => [WordBook])
    @Property({ ref: () => WordBook, default: [], required: true, nullable: true, type: () => [String] })
    word_book?: [Ref<WordBook>];

    @Field({ nullable: true })
    @Property({ default: new Date(), required: false, nullable: true })
    created_date?: Date;
}
