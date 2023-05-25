import { Resolver, Mutation, Arg, Query, FieldResolver, Root, Authorized, Ctx } from "type-graphql";
import { WordBook } from "../entities/WordBook";
import { User } from "../entities/User";
import { UserModel, WordBookModel } from "../model/models";
import { WordbookInput } from "./types/wordbook-input";
import { Word } from "../entities/Word";
import { WordModel } from "../model/models";

import { WordResolver } from "./Dictionary";
import { log } from "console";
import { ObjectId } from "mongodb";
import { ApplicationContext } from "../auth/context.interface";

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
     * 😊이름으로 검색
     * @param id
     * @returns
     */
    @Authorized("ADMIN")
    @Query((_returns) => WordBook, { nullable: false })
    async findWordbookByName(@Arg("name") name: string, @Ctx() ctx: ApplicationContext) {
        return await WordBookModel.findOne({ user: ctx.user?.id, name: name });
    }

    /**
     * 전체 단어장 리턴
     * @param ctx
     * @returns
     */
    @Authorized("ADMIN")
    @Query((_returns) => [WordBook], { nullable: false })
    async wordBooks(@Ctx() ctx: ApplicationContext) {
        return await WordBookModel.find({ user: ctx.user?.id });
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
    @Authorized("ADMIN")
    @Mutation(() => WordBook)
    async createWordBook(@Arg("name") name: string, @Ctx() ctx: ApplicationContext): Promise<WordBook> {
        // const userData = await UserModel.findOne({ _id: ctx.user?.id });
        // if (!userData) throw Error("🚨🚨🚨 Not found user!!!");
        const wordBook = await WordBookModel.create({
            name,
            user: ctx.user?.id,
        });

        return wordBook;
    }

    /**
     * 워드북 삭제
     * @param param0
     * @returns
     */
    @Authorized("ADMIN")
    @Mutation(() => WordBook)
    async deleteWordBook(@Arg("name") name: string, @Ctx() ctx: ApplicationContext): Promise<WordBook> {
        const wordBook = await WordBookModel.findOneAndRemove({
            name,
            user: ctx.user?.id,
        });
        return wordBook!;
    }

    /**
     * 단어장에 단어 추가
     * @param id
     * @param word
     * @returns
     */
    @Mutation(() => Word)
    async appendWord(@Arg("id") id: string, @Arg("word") word: string) {
        const wordData = await new WordResolver().returnWord(word);
        await WordBookModel.findOneAndUpdate({ _id: id }, { $addToSet: { words: wordData._id } }, { new: true });
        return wordData;
    }
}
