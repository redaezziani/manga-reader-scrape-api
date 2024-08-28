import { Request, Response } from "express";
import * as cheerio from "cheerio";
import { secrets } from "@/config/constants";
import { fetchHtml } from "@/utils/fetchHtml";
import { MangaType } from "@/interfaces/mangaInterface";
import { pagesSave, pdfMaker, spaceToDash, spaceToPlus } from "@/utils/helper";

export const getLatestMangaList = async (req: Request, res: Response) => {
  const url = secrets.BASE_URL;
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
      return res.status(404).json({
        status: "error",
        statusText: "No manga found",
        data: [],
      });
    }
    res.status(200).json({
      status: "success",
      statusText: "The List of latest manga",
      data: mangaList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      statusText: "Internal server error",
    });
  }
};

export const searchManga = async (req: Request, res: Response) => {
  const { title } = req.query;
  if (!title) {
    return res.status(404).json({
      status: "error",
      statusText: "title query parameter is required",
    });
  }

  const url = `${secrets.BASE_URL}/?s=${encodeURIComponent(
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
      return res.status(404).json({
        status: "error",
        statusText: "No manga found",
        data: [],
      });
    }
    res.status(200).json({
      status: "success",
      statusText: `Your search result contains ${mangaList.length} manga`,
      data: mangaList,
    });
  } catch (error) {
    console.error("Error fetching or parsing HTML:", error);
    res.status(500).json({
      status: "error",
      statusText: "Internal server error",
    });
  }
};

export const getMangaDetails = async (req: Request, res: Response) => {
  const { title } = req.query;
  if (!title) {
    return res.status(404).json({
      status: "error",
      statusText: "title query parameter is required",
    });
  }
  const url = `${secrets.BASE_URL}/manga/${spaceToDash(title.toString())}`;
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
      return res.status(404).json({
        status: "error",
        statusText: "No manga found",
        data: {},
      });
    }
    res.status(200).json({
      status: "success",
      statusText: "Manga details",
      data: mangaDetails,
    });
  } catch (error) {
    console.error("Error fetching or parsing HTML:", error);
    res.status(500).json({
      status: "error",
      statusText: "Internal server error",
    });
  }
};

export const getMangaChapterPages = async (req: Request, res: Response) => {
  const { title, chapter } = req.query;
  if (!title || !chapter) {
    return res.status(404).json({
      status: "error",
      statusText: "title and chapter query parameters are required",
    });
  }

  const url = `${secrets.BASE_URL}/manga/${spaceToDash(
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
      return res.status(404).json({
        status: "error",
        statusText: "No pages found",
        data: [],
      });
    }
    res.status(200).json({
      status: "success",
      statusText: "Manga chapter pages",
      data: pages,
    });
  } catch (error) {
    console.error("Error fetching or parsing HTML:", error);
    res.status(500).json({
      status: "error",
      statusText: "Internal server error",
    });
  }
};
