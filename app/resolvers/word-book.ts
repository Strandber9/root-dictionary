import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from "type-graphql";
import { WordBook, WordBookModel } from "../entities/WordBook";
import { User, UserModel } from "../entities/User";
import { WordbookInput } from "./types/wordbook-input";
import { Word, WordModel } from "../entities/Word";
import { WordResolver } from "./Dictionary";
import { log } from "console";

@Resolver((_of) => WordBook)
export class WordBookResolver {
    @Query((_returns) => WordBook, { nullable: false })
    async findWordbookByID(@Arg("id") id: string) {
        console.log("🅱️ 🅱️ 🅱️ 🅱️ 🅱️");
        return await WordBookModel.findById({ _id: id });
    }

    @Query((_returns) => [WordBook], { nullable: false })
    async findWordbookByUser(@Arg("userId") userId: string) {
        const user = await UserModel.findById({ _id: userId }).lean();
        return user?.word_book;
    }

    @FieldResolver((_type) => Word)
    async words(@Root() wordBook: WordBook) {
        return await WordModel.find({ _id: { $in: wordBook._doc!.words } });
    }

    @Mutation(() => WordBook)
    async createWordBook(@Arg("data") { name, user }: WordbookInput): Promise<WordBook> {
        const userData = await UserModel.findById({ _id: user }).lean();
        if (!userData) throw Error("asdasdasd!!!");
        const wordBook = (
            await WordBookModel.create({
                name,
                user,
            })
        ).save();
        return wordBook;
    }

    @Mutation(() => WordBook)
    async appendWordID(@Arg("id") id: string, @Arg("wordId") wordId: string) {
        const wordBook = await WordBookModel.findById(id);
        console.log(wordBook);

        if (wordBook) {
            const isValueExists = wordBook.words?.includes(wordId);
            if (!isValueExists) {
                const words = [...wordBook.words, wordId];
                wordBook.words = words;
                await wordBook.save();
            }
        }
        return wordBook;
    }

    @Mutation(() => WordBook)
    async appendWord(@Arg("id") id: string, @Arg("word") word: string) {
        const wordData = await new WordResolver().returnWord(word);
        return await WordBookModel.findOneAndUpdate({ _id: id }, { $addToSet: { words: wordData._id } }, { new: true });
    }
}
