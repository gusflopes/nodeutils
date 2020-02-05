import { Router } from "express";

import PdfParser from "./controllers/PdfParser";

const routes = new Router();

routes.get("/", (req, res) => res.json({ hello: "world" }));
routes.get("/pdf", PdfParser.index);

export default routes;
