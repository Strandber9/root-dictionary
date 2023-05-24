import { Resolver, Mutation, Arg, Query, FieldResolver, Root } from "type-graphql";
import { WordBook } from "../entities/WordBook";
import { User } from "../entities/User";
import { UserModel, WordBookModel } from "../model/models";
import { WordbookInput } from "./types/wordbook-input";
import { Word } from "../entities/Word";
import { WordModel } from "../model/models";

import { WordResolver } from "./Dictionary";
import { log } from "console";
import { ObjectId } from "mongodb";

@Resolver((_of) => WordBook)
export class WordBookResolver {
    /**
     * 😊아이디로 검색
     * @param id
     * @returns
     */
    @Query((_returns) => WordBook, { nullable: false })
    async findWordbookByID(@Arg("id") id: string) {
        console.log("🅱️ 🅱️ 🅱️ 🅱️ 🅱️");
        return await WordBookModel.findById({ _id: id });
    }

    /**
     * 유저 아이디를 입력받아 워드북을 찾아준다
     * @param userId
     * @returns
     */
    @Query((_returns) => [WordBook], { nullable: false })
    async findWordbookByUser(@Arg("userId") userId: string) {
        const user = await UserModel.findById({ _id: userId }).lean();
        return user?.word_book;
    }

    /* 필드리졸버
    ------------------------------------------------------------ */
    /**
     * 워드북의 words요청을 처리하는 리졸버
     * @param wordBook
     * @returns
     */
    @FieldResolver((_type) => Word)
    async words(@Root() wordBook: WordBook) {
        return await WordModel.find({ _id: { $in: wordBook._doc!.words } });
    }

    /**
     * 워드북의 사용자 요청을 처리하는 리졸버
     * @param wordBook
     * @returns
     */
    @FieldResolver((_type) => User)
    async user(@Root() wordBook: WordBook) {
        return await UserModel.findById({ _id: wordBook._doc!.user });
    }

    /**
     * 워드북 생성
     * @param param0
     * @returns
     */
    @Mutation(() => WordBook)
    async createWordBook(@Arg("data") { name, user }: WordbookInput): Promise<WordBook> {
        const userData = await UserModel.findById({ _id: user }).lean();
        if (!userData) throw Error("🚨🚨🚨 Not found user!!!");
        const wordBook = (
            await WordBookModel.create({
                name,
                user,
            })
        ).save();
        return wordBook;
    }

    /**
     * 워드북에 단어 추가
     * @param id
     * @param wordId
     * @returns
     */
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

    /**
     * 단어장에 단어 추가
     * @param id
     * @param word
     * @returns
     */
    @Mutation(() => WordBook)
    async appendWord(@Arg("id") id: string, @Arg("word") word: string) {
        const wordData = await new WordResolver().returnWord(word);
        return await WordBookModel.findOneAndUpdate({ _id: id }, { $addToSet: { words: wordData._id } }, { new: true });
    }
}
