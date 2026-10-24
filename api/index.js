import { app, ready } from "../backend/src/app.js";

export default async function handler(req, res) {
  try {
    await ready();
  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "The server could not reach the database.",
      });
    }
    return;
  }
  app(req, res);
}
