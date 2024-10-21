import request from "request";

async function httpReqValidateAuth(
  orgId,
  access_token,
  instance_url,
  refresh_token
) {

  const getRequest = () => {
    return new Promise((resolve, reject) => {
      try {
        request.get(
          {
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
            url: `${instance_url}/services/data/v58.0/query?q=select+id+from+user+limit+1`,
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
    const result = await getRequest();
    if(result.statusCode  === 200 || result.statusCode  === 201){
        return true;
    }
    return false;
  } catch (err) {
    console.error(err);
  }
}

export default httpReqValidateAuth;
