import { ObjectType, Field, ID, Authorized } from "type-graphql";
import { prop as Property } from "@typegoose/typegoose";

@ObjectType({ description: "The Categories model" })
export class Word {
    @Authorized()
    @Field(() => ID)
    id!: string;

    @Field()
    @Property()
    dic_type?: string;

    @Field()
    @Property()
    wordid?: String;

    @Field()
    @Property({ unique: true })
    word?: String;

    @Field((type) => [String])
    @Property({ type: () => [String] })
    summary?: [String];

    @Field()
    @Property()
    sound?: String;

    @Field((type) => [String])
    @Property({ type: () => [String] })
    pron?: [String];

    @Field({ nullable: true })
    @Property({ default: new Date(), required: false, nullable: true })
    created_date?: Date;
}
