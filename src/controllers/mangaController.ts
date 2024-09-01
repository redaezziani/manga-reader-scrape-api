import { Request, Response } from "express";
import Manga3asq from "@/service/manga/manga-3asq";
import redisClient from "@/utils/redis";

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
  const cacheKey = `latestManga:${source}`;
  try {
    const cacheData = await redisClient.get(cacheKey);
    if (cacheData) {
      return res.status(200).json({
        status: "success",
        statusText: "Latest manga list",
        data: JSON.parse(cacheData),
      });
    }
  } catch (error) {
    console.error("Error fetching data from Redis:", error);
  }
  try {
    const mangaList = await mangaService.getLatestManga();
    await redisClient.set(cacheKey, JSON.stringify(mangaList.data), {
      EX: 60 * 60,
    }); // Cache for 1 hour
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
  const cacheKey = `searchManga:${source}:${title}`;
  try {
    const cacheData = await redisClient.get(cacheKey);
    if (cacheData) {
      return res.status(200).json({
        status: "success",
        statusText: "Manga search results",
        data: JSON.parse(cacheData),
      });
    }
  } catch (error) {
    console.error("Error fetching data from Redis cache:", error);
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
    await redisClient.set(cacheKey, JSON.stringify(mangaList.data), {
      EX: 60 * 60,
    }); // Cache for 1 hour
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

  const cacheKey = `mangaDetails:${source}:${title}`;
  try {
    const cacheData = await redisClient.get(cacheKey);
    if (cacheData) {
      return res.status(200).json({
        status: "success",
        statusText: "Manga details",
        data: JSON.parse(cacheData),
      });
    }
  } catch (error) {
    console.error("Error fetching data from Redis cache:", error);
  }

  try {
    const mangaDetails = await mangaService.getMangaDetails(title.toString());
    if (!mangaDetails.data.title) {
      return res.status(404).json({
        status: "error",
        statusText: "No manga found",
        data: {},
      });
    }
    await redisClient.set(cacheKey, JSON.stringify(mangaDetails.data), {
      EX: 60 * 60,
    }); // Cache for 1 hour
    res.status(200).json({
      status: "success",
      statusText: "Manga details",
      data: mangaDetails.data,
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
  let { source } = req.query;
  const { title, chapter } = req.query;
  if (!title || !chapter) {
    return res.status(404).json({
      status: "error",
      statusText: "title and chapter query parameters are required",
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

  const cacheKey = `chapterPages:${source}:${title}:${chapter}`;
  try {
    const cacheData = await redisClient.get(cacheKey);
    if (cacheData) {
      return res.status(200).json({
        status: "success",
        statusText: "Manga chapter pages",
        data: JSON.parse(cacheData),
      });
    }
  } catch (error) {
    console.error("Error fetching data from Redis cache:", error);
  }

  try {
    const chapterPages = await mangaService.getMangaChapterPages(
      title.toString(),
      chapter.toString()
    );
    if (chapterPages.data?.length === 0) {
      return res.status(404).json({
        status: "error",
        statusText: "No pages found",
        data: [],
      });
    }
    await redisClient.set(cacheKey, JSON.stringify(chapterPages.data), {
      EX: 60 * 60,
    }); // Cache for 1 hour
    res.status(200).json({
      status: "success",
      statusText: "Manga chapter pages",
      data: chapterPages.data,
    });
  } catch (error) {
    console.error("Error fetching or parsing HTML:", error);
    res.status(500).json({
      status: "error",
      statusText: "Internal server error",
    });
  }
};
