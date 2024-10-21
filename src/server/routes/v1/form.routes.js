import insertFormToSalesforce from "../../controllers/form.controllers.js";

import express from "express";
const formRoutes = express.Router();

formRoutes.post("/", insertFormToSalesforce);

export default formRoutes;

