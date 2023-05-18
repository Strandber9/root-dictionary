import * as cheerio from "cheerio";
import axios from "axios";
import { RootWord } from "../entities/RootWord";
import { connect } from "mongoose";
import { RootWordModel } from "../entities/RootWord";
import { log } from "console";

//  Link	Root word	Meanings	Origin	Examples and Definition
interface CrawlObjectType {
    select_path: string;
    items: Array<ItemType>;
}
interface ItemType {
    name: string;
    use: boolean;
}

interface RootWordDefType {}

const crawlObject: CrawlObjectType = {
    select_path: ".root_meanings tbody tr",
    items: [
        { name: "", use: false },
        { name: "root_word", use: true },
        { name: "meanings", use: true },
        { name: "origin", use: true },
        { name: "definition", use: true },
    ],
};

const expandString = (str: string): string[] =>
    str.split(",").flatMap((segment) =>
        segment
            .split("/")
            .map((subSegment, i, arr) => (i === 0 ? subSegment.trim() : arr[0].trim() + subSegment.trim()))
            .map((str) => str.toLowerCase())
    );

const main = async () => {
    const MONGODB_URI = "mongodb+srv://rein999:973TpflHHlG3tLyn@cluster-study.gjbpqjh.mongodb.net/english";
    // const MONGODB_URI = "mongodb://localhost:27017/graphQL";
    const mongoose = await connect(MONGODB_URI);
    await mongoose.connection;

    console.log("🚀🚀🚀");
    const rootWordList: any[] = [];
    await axios.get("https://www.learnthat.org/pages/view/roots.html#c").then((html) => {
        const $ = cheerio.load(html.data);
        $(crawlObject.select_path).each(function (i, el) {
            const wordData = {};
            $(el)
                .children("td")
                .each(function (i, el) {
                    if (crawlObject.items[i].use) {
                        let text: any = $(el).text();
                        if (crawlObject.items[i].name === "root_word" || crawlObject.items[i].name === "meanings") {
                            text = expandString(text);
                        }
                        (wordData as any)[crawlObject.items[i].name] = text;
                    }
                });
            console.log("😊😊😊", wordData);
            rootWordList.push(wordData);
        });
    });
    console.log("😊😊😊");
    for (const data of rootWordList) {
        const asd: RootWord = data;
        console.log("🚀🚀🚀", data);

        (await RootWordModel.create(asd)).save();
        console.log("👌👌👌");
    }
};

main().catch((error) => {
    console.log(error, "error");
});
