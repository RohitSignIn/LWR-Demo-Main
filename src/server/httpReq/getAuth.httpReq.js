import request from "request";

async function httpReqGetAuth(url, data, orgId, isSandBox) {
    const salesforce_data = {
        org_id: "",
        access_token: "",
        refresh_token: "",
        instance_url: "",
        is_sandbox: isSandBox,
    };

    // Wrapping request.post in a Promise
    const postRequest = () => {
        return new Promise((resolve, reject) => {
            request.post(
                {
                    url,
                    form: { ...data },
                },
                (error, response) => {
                    if (error) {
                        return reject(error);
                    }
                    try {
                        const resBody = JSON.parse(response.body);
                        if (!resBody.id.includes(orgId)) {
                            return reject(new Error("Org_id Mismatch"));
                        }

                        salesforce_data.org_id = orgId;
                        salesforce_data.instance_url = resBody.instance_url;
                        salesforce_data.access_token = resBody.access_token;
                        salesforce_data.refresh_token = resBody.refresh_token;

                        resolve(salesforce_data);
                    } catch (parseError) {
                        reject(parseError);
                    }
                }
            );
        });
    };

    // Await the postRequest promise
    try {
        const result = await postRequest();
        return result;
    } catch (err) {
        console.error(err);
    }
}

export default httpReqGetAuth;
