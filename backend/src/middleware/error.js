export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }
  if (err.name === "CastError") {
    res.status(400).json({ success: false, message: "That record could not be found." });
    return;
  }
  if (err.code === 11000) {
    res.status(409).json({ success: false, message: "This record already exists." });
    return;
  }
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    success: false,
    message: status >= 500 ? "Something went wrong." : err.message || "Something went wrong.",
  });
}
