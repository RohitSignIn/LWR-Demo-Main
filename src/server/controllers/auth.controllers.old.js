import AuthRepository from "../repository/auth.repository.js";
import AuthService from "../services/auth.service.js";

import httpReqGetAuth from "../httpReq/getAuth.httpReq.js";
import httpReqValidateAuth from "../httpReq/validateAuth.httpReq.js";
import httpReqRefToken from "../httpReq/refreshToken.httpReq.js";

const authService = new AuthService(new AuthRepository());
async function auth_callback(req, res) {
  try {
    var body = req.body; // orgId, isSandbox, code
    let data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URI}api/v1/auth`,
      code: body.code,
      grant_type: "authorization_code",
    };

    let uri;
    if (body.isSandbox) {
      uri = "https://test.salesforce.com/services/oauth2/token";
    } else {
      uri = "https://login.salesforce.com/services/oauth2/token";
    }

    const url = uri;
    const orgId = body.orgId;
    const isSandBox = body.isSandbox;
    const salesforce_data = await httpReqGetAuth(url, data, orgId, isSandBox);

    const authEntryExist = await authService.fetchByOrgId(orgId);

    console.log("Check here >>>>>>>>>>", salesforce_data, "<<<<<<<<<< Check here")

    if (!authEntryExist) {
      await authService.create({ ...salesforce_data, is_connected: true });
    }
    else {
      await authService.update({ org_id: orgId }, {is_connected: true});
    }

    res.status(201).send("Connected Successfully");
  } catch (error) {
    console.log("Auth ControllerA", error.message);
    res.status(400).send("Connection Error");
  }
}

async function auth_validate(req, res) {
  try {
    const orgId = req.params.orgId;

    const authEntryExist = await authService.fetchByOrgId(orgId);
    if (!authEntryExist) {
      return res.sendStatus(400);
    }

    const { instance_url, refresh_token, access_token } = authEntryExist;

    const isValid = await httpReqValidateAuth(
      orgId,
      access_token,
      instance_url,
      refresh_token
    );

    if (!isValid) {
      const { access_token } = await httpReqRefToken(
        authEntryExist.refresh_token
      );
      await authService.update(
        { _id: authEntryExist._id },
        { access_token: access_token }
      );
    }

    return res.status(201);
  } catch (error) {
    console.log("Auth ControllerB", error.message);
  }
}

async function auth_connected(req, res) {
  try {
    const orgId = req.params.orgId;
    const authEntryExist = await authService.fetchByOrgId(orgId);
    
    if (authEntryExist) {
      return res.status(200).send(authEntryExist.is_connected);
    }else {
      return res.status(401).send({message: "Document not found"});
    }

  } catch (error) {
    console.log("Auth ControllerB", error.message);
  }
}

async function auth_disconnect(req, res) {
  try {
    const orgId = req.params.orgId;
    const authEntryUpd = await authService.update(
      { org_id: orgId },
      { is_connected: false }
    );
    
    if (authEntryUpd) {
      return res.status(201).send({message: "Disconnected"});
    }else {
      return res.status(401).send({message: "Document not found"});
    }

  } catch (error) {
    console.log("Auth ControllerB", error.message);
  }
}

export {
  auth_callback,
  auth_validate,
  auth_connected,
  auth_disconnect
};
