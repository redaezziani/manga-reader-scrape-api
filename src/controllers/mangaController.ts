import { Request, Response } from "express";
import * as cheerio from "cheerio";
import { secrets } from "@/config/constants";
import { fetchHtml } from "@/utils/fetchHtml";
import Manga3asq from "@/service/manga/manga-3asq";
import {spaceToDash } from "@/utils/helper";

export const getLatestMangaList = async (req: Request, res: Response) => {
  let source = req.query.source;
  if (!source) {
    source = "3asq";
  }

  let mangaService;
  switch (source) {
    case "3asq":
      mangaService = new Manga3asq();
      break;
    default:
      mangaService = new Manga3asq();
      break;
  }

  try {
    const mangaList = await mangaService.getLatestManga();
    res.status(200).json({
      status: "success",
      statusText: "Latest manga list",
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

export const searchManga = async (req: Request, res: Response) => {
  let { source } = req.query;
  const { title } = req.query;
  if (!title) {
    return res.status(404).json({
      status: "error",
      statusText: "title query parameter is required",
    });
  }

  if (!source) {
    source = "3asq";
  }

  let mangaService;

  switch (source) {
    case "3asq":
      mangaService = new Manga3asq();
      break;
    default:
      mangaService = new Manga3asq();
      break;
  }

  try {
    const mangaList = await mangaService.searchManga(title.toString());
    if (mangaList?.data?.length === 0) {
      return res.status(404).json({
        status: "error",
        statusText: "No manga found",
        data: [],
      });
    }
    res.status(200).json({
      status: "success",
      statusText: "Manga search results",
      data: mangaList.data,
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
