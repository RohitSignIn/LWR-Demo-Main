import request from "request";

async function httpReqRefToken(
    refresh_token
) {
  const postRequest = () => {

    return new Promise((resolve, reject) => {
      try {
        request.post(
          {
            url: `https://login.salesforce.com/services/oauth2/token`,
            form: { 
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                redirect_uri: process.env.REDIRECT_URI,
                grant_type: "refresh_token",
                refresh_token
             }
          },
          (error, res) => {
            resolve(res);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  // Await the postRequest promise
  try {
    const result = await postRequest();
    if(result.statusCode  === 400 || result.statusCode  === 401){
        throw new Error("refreshToken.httpReq Error: generating refresh token")
    }
    return result;
  } catch (err) {
    console.error(err);
  }
}

export default httpReqRefToken;
