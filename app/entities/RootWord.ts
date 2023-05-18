import { ObjectType, Field, ID } from "type-graphql";
import { prop as Property, getModelForClass } from "@typegoose/typegoose";
import { index } from "@typegoose/typegoose";
/*
{ name: "root_word", use: true },
        { name: "meanings", use: true },
        { name: "origin", use: true },
        { name: "definition", use: true },*/

// @index({ root_word: 1 }, { unique: true })
@ObjectType({ description: "" })
export class RootWord {
    @Field(() => ID)
    id!: string;

    @Field((type) => [String])
    @Property({ type: () => [String] })
    root_word!: Array<string>;

    @Field((type) => [String])
    @Property({ type: () => [String] })
    meanings!: Array<string>;

    @Field()
    @Property()
    origin!: String;

    @Field()
    @Property()
    definition!: String;

    @Field({ nullable: true })
    @Property({ default: new Date(), required: false, nullable: true })
    created_date?: Date;
}
export const RootWordModel = getModelForClass(RootWord);
