import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api-error";

export function errorHandler(err: ApiError, _req: Request, res: Response, _next: NextFunction) {
  res.status(err.httpCode).json({ error: err.message});
}