import axios from "axios";
import { Word } from "../entities/Word";

/**
 *
 * @param word
 * @returns
 */
export const searchForDaumdic = async (word: string): Promise<Word> => {
    const URL = `https://api.dic.daum.net/language/search.json?word=${word}&dicType=endic`;
    const removeHtmlTag = (str: string): string => str.replace(/<[^>]*>?/g, "");

    return await axios
        .get(URL)
        .then((res) => {
            /* Set GLB-ENV
            ------------------------------------------------------------ */
            if (!res.data.data) throw Error("Not fount error!!!");
            return res.data.data;
        })
        .then((data) => {
            /* Respnse date(summary and pron) is decorate to remove html-tag
            ------------------------------------------------------------ */
            data.summary = removeHtmlTag(data.summary).split(",");
            data.pron = removeHtmlTag(data.pron).split(",");
            data.word = word;
            return data;
        })
        // .then((res) => {
        //     console.log(res);
        // })
        .catch((onrejected) => {
            console.log(onrejected);
            throw onrejected;
        });
};

//dictionary
