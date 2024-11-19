import jsforce from 'jsforce';
import { v4 as uuidv4 } from 'uuid';

async function insertFormToSalesforce(req, res) {

    // Create a Jsforce connection using the provided access token and instance URL
    const conn = new jsforce.Connection({
        accessToken: req.body.access_token,
        instanceUrl: 'https://hicglobasolutions-dev-ed.develop.my.salesforce.com'
    });

    // Extract form data from the request body
    const formData = req.body.jsonData;


    // Get unique object names from the form data
    const allObjects = [...new Set(formData.map((obj) => obj.object))];

    // Initialize an array to hold fields for each object
    let allFieldsPerObject = [];
    let referTo = []

    // Group form fields by object name
    for (const objectName of allObjects) {
        allFieldsPerObject[objectName] = formData
            .filter((obj) => obj.object === objectName)
            .reduce((acc, obj) => {
                if ("repeatCount" in obj) {

                    const repeatCount = acc.length > 0 ? acc[acc.length - 1].repeatCount : 0

                    if (repeatCount && repeatCount == obj.repeatCount) {

                        acc[acc.length - 1] = { ...acc[acc.length - 1], [obj.apiName]: obj.userInput } // Map API names to their values
                    } else {
                        acc.push({ [obj.apiName]: obj.userInput, "repeatCount": obj.repeatCount }); // Map API names to their values
                    }
                } else {
                    acc.push({ [obj.apiName]: obj.userInput })
                }
                return acc;
            }, []);

        referTo[objectName] = formData
            .filter((obj) => obj.object === objectName)
            .reduce((acc, obj) => {
                acc['refer'] = obj.refer; // Map API names to their values

                if (obj.refer) {
                    acc['referToField'] = obj.referToField;
                    acc['referToObj'] = obj.referToObj;
                }

                return acc;
            }, {});
    }
    // Construct the composite request
    const compositeRequest = {
        compositeRequest: []
    };

    let referenceCount = 0

    // Loop through each object to build the composite request
    for (const object of Object.keys(allFieldsPerObject)) {
        // Generate a unique reference ID for the request
        let fields = allFieldsPerObject[object];
        let refer = referTo[object]['refer'];
        let referToField = null;
        let referToObj = null;

        if (refer) {
            referToField = referTo[object]['referToField'];;
            referToObj = referTo[object]['referToObj'];;
        }

        // const currReferenceId = "aucuyachedcvyuheavchuaebcyhec";
        // const currReferenceId = 'sefswevwsevsevevsv';
        let currReferenceId = uuidv4().replace(/[-]/g, '');

        allFieldsPerObject[object]['referenceId'] = currReferenceId;

        // if(referenceCount === 0) {
        //     firstObjectReference = currReferenceId;

        // }

        // console.log(refer, 'refer', referenceCount, referTo);
        // console.log( allFieldsPerObject, 'Reference Id');

        if (refer && refer !== 'false' && 'referenceId' in allFieldsPerObject[referToObj]) {
            // console.log('Iam In', allFieldsPerObject[referToObj]['referenceId']);

            for (let i = 0; i < fields.length; i++) {
                fields[i] = { ...fields[i], [referToField]: `@{${allFieldsPerObject[referToObj]["referenceId"]}.id}` }
                // fields[referToField] = `@{${allFieldsPerObject[referToObj]['referenceId']}.id}`;
            }
        }


        // if (fields.length > 1) {
            // Add each object creation request to the composite request
            // console.log(fields, referTo)

            for (const field of fields) {
                // console.log(field)
                delete field.repeatCount
                compositeRequest.compositeRequest.push({
                    method: 'POST',
                    url: `/services/data/v52.0/sobjects/${object}`,
                    referenceId: `${currReferenceId}`, // Use the reference ID for tracking
                    body: field // Set the body to the fields mapped earlier
                });
                currReferenceId = uuidv4().replace(/[-]/g, '');
            }
        // } else {
        //     // Add each object creation request to the composite request
        //     compositeRequest.compositeRequest.push({
        //         method: 'POST',
        //         url: `/services/data/v52.0/sobjects/${object}`,
        //         referenceId: `${currReferenceId}`, // Use the reference ID for tracking
        //         body: fields[0] // Set the body to the fields mapped earlier
        //     });
        // }
        referenceCount += 1;
    }

     console.log(compositeRequest.compositeRequest, '<<<<<<<<<< here is the composite req')


    try {
        // Send the composite request to Salesforce
        const queryResult = await conn.requestPost('/services/data/v52.0/composite', compositeRequest);
        //  console.log(queryResult, 'Here is the Response'); // Log the response for debugging
        return res.status(201).send(compositeRequest); // Send back a 201 response with the result
    } catch (error) {
        console.log("Form Controller:", error); // Log any errors that occur
        return res.status(500).send("InsertForm Failure"); // Send a 500 response on failure
    }
}

export default insertFormToSalesforce;
