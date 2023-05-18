import { getModelForClass } from "@typegoose/typegoose";
import { User } from "../entities/User";
import { WordBook } from "../entities/WordBook";
import { Word } from "../entities/Word";
import { RootWord } from "../entities/RootWord";

export const UserModel = getModelForClass(User);
export const WordBookModel = getModelForClass(WordBook);
export const WordModel = getModelForClass(Word);
export const RootWordModel = getModelForClass(RootWord);
