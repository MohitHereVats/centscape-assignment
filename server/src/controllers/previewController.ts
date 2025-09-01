import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { fetchUrlMetadata } from "../services/parser";

export const getPreview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  const url = req.body.url;

  try {
    console.log("Fetching metadata for URL:", url);
    const metadata = await fetchUrlMetadata(url);
    return res.status(200).json(metadata);
  } catch (error) {
    console.log("Error fetching metadata:", error);
    next(error);
  }
};
