import { Resolver, Mutation, Arg, Query, Authorized, FieldResolver, Root } from "type-graphql";
import { Word } from "../entities/Word";
import { searchForDaumdic } from "../crawling/daum.dic";
import { WordModel } from "../model/models";
import { log } from "console";

@Resolver((_of) => Word)
export class WordResolver {
    @Authorized("ADMIN")
    @Query((_returns) => Word, { nullable: false })
    async returnWord(@Arg("word") word: string) {
        word = word.toLowerCase();
        let wordData = await WordModel.findOne({ word: word });
        if (!wordData) {
            console.log(word, "🪶🪶🪶🪶🪶");
            const data = await searchForDaumdic(word);
            return (await WordModel.create(data)).save();
        }
        return wordData;
    }

    @Query(() => [Word])
    async words() {
        return await WordModel.find();
    }

    // @FieldResolver((_type) => Word)
    // async product(@Root() cart: Word): Promise<Word> {
    //     console.log(cart, "cart!");
    //     return (await WordModel.findById(cart._doc.products))!;
    // }
}
