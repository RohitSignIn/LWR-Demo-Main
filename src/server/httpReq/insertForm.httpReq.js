import request from "request";
import axios from "axios";

async function httpReqInsertForm(url, access_token, name, jsonData, templateId) {
    try {
        const data = {
            name,
            jsonData,
            templateId
        }
        const result = await axios.post(
            url, 
            data,
            {headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
          }}
        )
        return result;
    } catch (err) {
        console.error("Insert Form Error", err.message);
    }
}

export default httpReqInsertForm;
