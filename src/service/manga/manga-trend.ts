//https://mangaatrend.net

import { MangaType } from "@/interfaces/trend/mangaInterface";
import { fetchHtml } from "@/utils/fetchHtml";
import { removeResize } from "@/utils/urlFormater";
import * as cheerio from "cheerio";

class MangaTrend {
    name: string;
    lang: string;
    baseURL: string;
    constructor() {
        this.name = 'Trend';
        this.lang = 'ar';
        this.baseURL = 'https://mangaatrend.net';
    }

    async getLatestManga(){
        const url = `${this.baseURL}/project/`;
        try {
            const html = await fetchHtml(url);
            const $ = cheerio.load(html);
            const mangaList: MangaType[] = [];
            $(".bsx").each((index, element) => {
                const title = $(element).find("img.ts-post-image").attr("title") ?? "";
                const cover = $(element).find("img.ts-post-image").attr("src") ?? "";
                const image = removeResize(cover);
                const chapterNumer = $(element).find(".epxs").text();
                const postedOn = $(element).find(".epxdate").text();
                const manga = {
                    title,
                    image,
                    chapterNumer,
                    postedOn,
                };
                mangaList.push(manga);
            });

            if (mangaList.length === 0) {
                return {
                    status: "error",
                    statusText: "No manga found",
                    data: [],
                };
            }

            return {
                status: "success",
                statusText: "Latest manga",
                data: mangaList,
            };
        } catch (error) {
            console.log(error);
            return {
                status: "error",
                statusText: "Error fetching data",
                data: [],
        };

    }
}
}

export default MangaTrend;