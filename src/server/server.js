import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from 'cors';

dotenv.config()

import createServer from './lwr.cjs';

import saveForm from './saveForm.js';
import getForm from './getForm.js';
import apiRoutes from './routes/index.js'

export const app = express();

const PORT = parseInt(process.env.PORT || '3000', 10);
const LWR_PORT = parseInt(process.env.LWR_PORT || '3001', 10);


const corsOption = {
	origin: ['http://localhost:5174', 'https://hicglobasolutions-dev-ed.develop.lightning.force.com', 'http://13.202.250.26:3001'],
  };

app.use(cors(corsOption))

app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

// API Route
app.use('/api',	apiRoutes);

app.get('/getForm', getForm);

app.post('/formSubmit', saveForm)

// Client Form
app.use(
	'/*',	
	createProxyMiddleware({
		target: `http://127.0.0.1:${LWR_PORT}`,
		changeOrigin: true,
	})
);

// Express App Listening - START
app.listen(PORT, () => {
	mongoose
	.connect(
	  process.env.MONGO_URI,
	)
	.then(() => console.log("mongodb connected"))
	.catch((err) => {
	  console.log(err.message);
	  process.exit(1);
	});
	console.log(`Express started on http://localhost:${PORT}`);
});
// Express App Listening - END


// LWR - START
const lwrServer = createServer({
	serverMode: 'development' === process.env.NODE_ENV ? 'dev' : 'prod-compat',
	port: LWR_PORT,
});

lwrServer.listen(({ port }) => {
	console.log(
		`⚡Lightning Web Runtime⚡ listening on http://localhost:${port}`
	);
});
// LWR - END
