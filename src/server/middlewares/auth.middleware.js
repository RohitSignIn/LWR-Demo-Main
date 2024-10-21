import AuthRepository from "../repository/auth.repository.js";
import AuthService from "../services/auth.service.js";

import TemplateRepository from "../repository/template.repository.js";
import TemplateService from "../services/template.service.js";

import httpReqRefToken from "../httpReq/refreshToken.httpReq.js";
import httpReqValidateAuth from "../httpReq/validateAuth.httpReq.js";

const authService = new AuthService(new AuthRepository());
const templateService = new TemplateService(new TemplateRepository());


async function authValidator(req, res, next) {
    try {
      console.log("middleware is running")
      let orgId;  
      
      if ('template' in req.body && 'org_auth_id' in req.body.template) {

        console.log(req.body, 'here is the body <<<<<< ')
          orgId = req.body.template.org_auth_id;
          console.log(orgId, "Received Org Id")
        } else {
          const tempRes = await templateService.fetch({ _id: req.body.templateId });
          orgId = tempRes.org_auth_id;
        }
        

        const authEntryExist = await authService.fetchByOrgId(orgId);
        if (!authEntryExist) {
          return res.sendStatus(400);
        }

        let {instance_url, refresh_token, access_token} = authEntryExist;

        
        const isValid = await httpReqValidateAuth(orgId, access_token, instance_url, refresh_token)
        
        if(!isValid){
          console.log("In Not Valid < =================");
          const refTokenRes = await httpReqRefToken(authEntryExist.refresh_token);
          access_token = JSON.parse(refTokenRes.body).access_token;
          await authService.update({ _id: authEntryExist._id }, {access_token: access_token});
        }
        
        req.body.access_token = access_token;

        console.log("middleware Stoped ............ ")

        next();
      } catch (error) {
        console.log("Auth Validator Middleware", error.message);
      }
}

export {
  authValidator
}