import { create, updateTemplate, fetchByTempId, remove } from "../../controllers/template.controllers.js"
import { authValidator } from "../../middlewares/auth.middleware.js"

import express from "express";

const templateRoutes = express.Router();

templateRoutes.get("/:id", fetchByTempId);
// templateRoutes.post("/", create);
templateRoutes.post("/", authValidator, create);
templateRoutes.patch("/", authValidator, updateTemplate);
templateRoutes.delete("/", authValidator, remove);

export default templateRoutes;

