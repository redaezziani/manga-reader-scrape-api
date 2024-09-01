import { MangaType } from "@/interfaces/3asq/mangaInterface";
import { fetchHtml } from "@/utils/fetchHtml";
import { spaceToDash } from "@/utils/helper";
import * as cheerio from "cheerio";

class Manga3asq  {
    name: string;
    lang: string;
    baseURL: string;
    constructor() {
        this.name = '3asq';
        this.lang = 'ar';
        this.baseURL = 'https://3asq.org';
    }

    async getLatestManga() {
        const url = `${this.baseURL}`;
        try {
            const html = await fetchHtml(url);
            const $ = cheerio.load(html);
            const mangaList: MangaType[] = [];

            $(
                ".page-content-listing.item-default#loop-content .manga.page-item-detail"
            ).each((index, element) => {
                const title = $(element)
                    .find(".item-summary .post-title h3 a:nth-child(2)")
                    .text();
                const url = $(element).find(".c-image-hover a").attr("href") ?? "";
                const image = $(element).find(".c-image-hover a img").attr("src") ?? "";
                const rating = $(element).find(".total_votes").text();
                const chapterNumer = $(element)
                    .find(".list-chapter span.chapter a")
                    .text();
                const postedOn = $(element).find(".item-summary span.post-on ").text();
                const manga = {
                    title,
                    url,
                    image,
                    rating,
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
                statusText: "Internal Server Error",
            };
        }
    }

    async searchManga(title: string) {
        const url = `${this.baseURL}/?s=${encodeURIComponent(
            title.toString()
          )}&post_type=wp-manga&op=&author=&artist=&release=&adult=`;
          try {
            const html = await fetchHtml(url);
            const $ = cheerio.load(html);
            const mangaList: any[] = [];
        
            $(".tab-content-wrap .c-tabs-item .c-tabs-item__content").each(
              (index, element) => {
                const manga = {
                  title: $(element).find(".post-title h3 a").text(),
                  url: $(element).find(".c-image-hover a").attr("href") ?? "",
                  image: $(element).find(".c-image-hover a img").attr("src") ?? "",
                  rating: $(element).find(".total_votes").text(),
                  chapterNumer: $(element).find(".latest-chap span.chapter a").text(),
                  postedOn: $(element).find(".post-on span").text(),
                };
                mangaList.push(manga);
              }
            );
        
            if (mangaList.length === 0) {
                return {
                    status: "error",
                    statusText: "No manga found",
                    data: [],
                };
            }
            return {
                status: "success",
                statusText: "Manga search results",
                data: mangaList,
            };
          } catch (error) {
            console.error("Error fetching or parsing HTML:", error);
            return {
              status: "error",
              statusText: "Internal server error",
            };
          }
    }


     async getMangaDetails(title: string) {
        const url = `${this.baseURL}/manga/${spaceToDash(title.toString())}`;
        try {
          const html = await fetchHtml(url);
          const $ = cheerio.load(html);
      
          const genres: string[] = [];
          $(".genres-content a").each((index, element) => {
            genres.push($(element).text());
          });
          const mangaDetails: any = {
            title: $(".post-title h1").text() ?? "",
            image: $(".summary_image img").attr("src") ?? "",
            averagerate: $("span#averagerate").text() ?? "",
            author: $(".author-content a").text() ?? "",
            artist: $(".artist-content a").text() ?? "",
            genres,
            postYear:
              $(".post-status .post-content_item .summary-content a").eq(0).text() ??
              "",
            status:
              $(".post-status .post-content_item .summary-content").eq(1).text() ??
              "",
            latestChapter: $(".wp-manga-chapter").eq(0).find("a").text() ?? "",
          };
          if (!mangaDetails.title) {
            return {
              status: "error",
              statusText: "No manga found",
              data: {},
            };
          }
          return {
            status: "success",
            statusText: "Manga details",
            data: mangaDetails,
          }
        } catch (error) {
          console.error("Error fetching or parsing HTML:", error);
            return {
                status: "error",
                statusText: "Internal server error",
            };
        }
    }

    async getMangaChapterPages(title: string, chapter: string) {
        const url = `${this.baseURL}/manga/${spaceToDash(
            title.toString()
          )}/${chapter}`;
          try {
            const html = await fetchHtml(url);
            const $ = cheerio.load(html);
            const pages: string[] = [];
        
            $(".page-break  img").each((index, element) => {
              pages.push($(element).attr("src") ?? "");
            });
            if (pages.length === 0) {
                return {
                    status: "error",
                    statusText: "No pages found",
                    data: [],
                };
            }
            return {
                status: "success",
                statusText: "Manga chapter pages",
                data: pages,
            };
          } catch (error) {
            console.error("Error fetching or parsing HTML:", error);
            return {
                status: "error",
                statusText: "Internal server error",
            };
          }
    }
}


export default Manga3asq;