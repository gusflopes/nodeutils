import { Router } from "express";

import PdfController from "./controllers/PdfController";

const routes = new Router();

routes.get("/", (req, res) => res.json({ hello: "world" }));
routes.get("/pdf", PdfController.index);

export default routes;
