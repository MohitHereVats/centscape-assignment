import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { AxiosError } from "axios";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (err instanceof AxiosError) {
    if (err.code === "ECONNABORTED") {
      return res.status(408).json({ message: "Request timed out" });
    }

    if (err.code === "ERR_BAD_REQUEST" || err.response?.status === 404) {
      return res
        .status(400)
        .json({ message: "Could not fetch the provided URL." });
    }
  }

  return res.status(500).json({ message: "Internal Server Error" });
};
