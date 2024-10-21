import express from"express";
const authRoutes = express.Router();
// const https = require('https');
// const axios = require("axios")
// const request = require("request");
// const FormModel = require("../../formModel");
import { auth_callback, auth_validate, auth_connected, auth_disconnect } from "../../controllers/auth.controllers.js";

authRoutes.post("/callback", auth_callback)
authRoutes.get("/authenticated/:orgId", auth_validate)

authRoutes.get("/connected/:orgId", auth_connected)
authRoutes.get("/disconnect/:orgId", auth_disconnect)


export default authRoutes;

// callback.post("/callback", async function (req, res) {
//   try {
//     var body = req.body;
//     let data = {
//       client_id:
//         "3MVG9NnK0U_HimV77Hs7_gDJVe9XytD87eP1d6oZPUkiYjLTGhoa2n4dr5zQQRut7p9NzQwxW8yp8tX7O_9mh",
//       client_secret:
//         "C08B11D0F5DEFEE1E4674A070F601623BA3948E6F687AA441B752E86BC785A08",
//       redirect_uri: "https://6652-49-36-144-170.ngrok-free.app/api/v1/auth",
//       code: body.code,
//       grant_type: "authorization_code",
//     };
//     let uri;
//     if (body.isSandbox)
//       uri = "https://test.salesforce.com/services/oauth2/token";
//     else "https://login.salesforce.com/services/oauth2/token";

//     // axios.post('https://login.salesforce.com/services/oauth2/token', data).then((res) => {
//     //   console.log(res)
//     // })

//     const salesforce_data = {
//       org_id: "",
//       access_token: "",
//       refresh_token: "",
//       instance_url: "",
//       created_at: new Date(),
//       updated_at: "",
//       is_sandbox: body.isSandbox,
//     };

//     request.post(
//       {
//         url: "https://login.salesforce.com/services/oauth2/token",
//         form: { ...data },
//       },
//       (error, response) => {
//         const resBody = JSON.parse(response.body);
//         if (!resBody.id.includes(body.orgId)) {
//           throw new Error("Org_id Mismatch");
//         }
//         salesforce_data.instance_url = resBody.instance_url;
//         salesforce_data.access_token = resBody.access_token;
//         salesforce_data.refresh_token = resBody.refresh_token;
//         //body.orgId
//         try {
//           const data = FormModel.findOne({ org_id: req.body.orgId });
//           if (data === null) {
//             const form = new FormModel({
//               salesforce_data,
//               form: "<div>check</div>",
//             });
//             form.save();
//           } else {
//             FormModel.updateOne({ org_id: req.body.orgId }, salesforce_data);
//           }

//           res.sendStatus(201);
//         } catch (err) {
//           throw new Error("Error Saving in Db");
//         }
//       }
//     );
//   } catch (error) {
//     console.log(error.message);
//   }
// });

// callback.post("/authenticated", async function (req, res) {
//   const orgId = req.params.orgId;

//   try {
//     const data = await FormModel.findOne({ org_id: orgId });
//     if (data === null) {
//       return res.sendStatus(400);
//     }

//     request.post(
//       {
//         headers: {
//           access_token: data.access_token,
//         },
//         url: `${data.instance_url}/services/data/v58.0/query?q=select+id+from+account`,
//       },
//       (error, res) => {
//         console.log(res);
//       }
//     );
//   } catch (e) {
//     console.log(e);
//   }
//   // check if exist in db
//   //if exist
//   //[ try querying 1 simple {Select Id from User Limit 1}]
//   // refresh token and save to db

//   //if not return 400
// });

