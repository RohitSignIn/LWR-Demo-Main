import path from 'path';
import authRoutes from './auth.routes.js';
import templateRoutes from './template.routes.js';
import { authValidator } from '../../middlewares/auth.middleware.js';
import formRoutes from './form.routes.js';
import express from "express";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const v1Routes = express.Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

v1Routes.get("/auth", function(req, res) {
    res.sendFile(path.join(__dirname, '/auth.html'));
});

v1Routes.use("/auth_callback", authRoutes);
v1Routes.use("/template", templateRoutes);
v1Routes.use("/form_submit", authValidator, formRoutes);

v1Routes.get("/", function(req, res) {
    res.json({"connected": true})
}) 

// v1Routes.use("/form_submit", authValidator, formRoutes);

export default v1Routes;