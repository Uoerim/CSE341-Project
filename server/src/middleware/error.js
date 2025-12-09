import { HttpError } from "../utils/httpErrors.js";

export const errorHandler = (err, req, res, next) => {
  const status =
    err instanceof HttpError ? err.status : err.status || 500;

  console.error("❌ Error:", {
    message: err.message,
    status,
  });

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
