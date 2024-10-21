import httpReqInsertForm from "../httpReq/insertForm.httpReq.js";
import resObject from "../response/allResponse.js";

async function insertFormToSalesforce (req, res) {
    try {
        const url = 'https://hicglobasolutions-dev-ed.develop.my.salesforce.com/services/apexrest/insertFormEntry';
        const jsonData = req.body.jsonData;
        const name = req.body.name;
        const templateId = req.body.templateId;
        const access_token = req.body.access_token;

        const insertFormRes = await httpReqInsertForm(url, access_token, name, jsonData, templateId);

        if(insertFormRes) {
            return res.status(201).send(resObject(true, {message: "Submited Successfully"}));
        }       
        
    } catch (error) {
        console.log("Form Controller:", error);
        return res.status(500).send(resObject(false, {message: "Unable to submit, try again"}));
    }
}


export default insertFormToSalesforce;
  