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
                acc[obj.apiName] = obj.values; // Map API names to their values
                return acc;
            }, {});
            
            referTo[objectName] = formData
            .filter((obj) => obj.object === objectName)
            .reduce((acc, obj) => {
                acc['refer'] = obj.refer; // Map API names to their values
                
                if(obj.refer){
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
        const fields = {...allFieldsPerObject[object]};
        let refer = referTo['refer'];
        let referToField = null;
        let referToObj = null;
        
        if(refer) {
            referToField = referTo['referToField'];;
            referToObj = referTo['referToObj'];;
        }

        const currReferenceId = uuidv4().replace(/[-]/g, '');

        allFieldsPerObject[object]['referenceId'] = currReferenceId;

        // if(referenceCount === 0) {
        //     firstObjectReference = currReferenceId;
        // }
        if(refer && refer != 'false' && 'referenceId' in allFieldsPerObject[referToObj]) {
            fields[referToField] = `@{${referTo[referToObj]['referenceId']}.id}`;
        }

        // Add each object creation request to the composite request
        compositeRequest.compositeRequest.push({
            method: 'POST',
            url: `/services/data/v52.0/sobjects/${object}`,
            referenceId: `${currReferenceId}`, // Use the reference ID for tracking
            body: fields // Set the body to the fields mapped earlier
        });

        referenceCount += 1;
    }

    try {    
        // Send the composite request to Salesforce
        const queryResult = await conn.requestPost('/services/data/v52.0/composite', compositeRequest); 
        console.log(queryResult, 'Here is the Response'); // Log the response for debugging
        return res.status(201).send(queryResult); // Send back a 201 response with the result
    } catch (error) {
        console.log("Form Controller:", error); // Log any errors that occur
        return res.status(500).send("InsertForm Failure"); // Send a 500 response on failure
    }
}

export default insertFormToSalesforce;


    // try {    
    //         const queryResult = await conn.sobject(object).create(fields);
    //         console.log(queryResult, 'Here is the Response');
    //         return res.status(201).send(queryResult);
    //     } catch (error) {
    //         console.log("Form Controller:", error);
    //         return res.status(500).send("InsertForm Failure");
    //     }


// import httpReqInsertForm from "../httpReq/insertForm.httpReq.js";
// import resObject from "../response/allResponse.js";

// async function insertFormToSalesforce (req, res) {
//     try {
//         const url = 'https://hicglobasolutions-dev-ed.develop.my.salesforce.com/services/apexrest/insertFormEntry';
//         const jsonData = req.body.jsonData;
//         const name = req.body.name;
//         const templateId = req.body.templateId;
//         const access_token = req.body.access_token;

//         const insertFormRes = await httpReqInsertForm(url, access_token, name, jsonData, templateId);

//         if(insertFormRes) {
//             return res.status(201).send(resObject(true, {message: "Submited Successfully"}));
//         }       
        
//     } catch (error) {
//         console.log("Form Controller:", error);
//         return res.status(500).send(resObject(false, {message: "Unable to submit, try again"}));
//     }
// }

// export default insertFormToSalesforce;


// Check If Field Exists
// const jsforce = require('jsforce');

// // Connect to Salesforce
// conn.login(username, password, function(err, userInfo) {
//   if (err) {
//     return console.error(err);
//   }

//   console.log('Connected to Salesforce as user:', userInfo.id);

//   const objectName = 'Account'; // The object you're checking (e.g., Account)
//   const fieldName = 'CustomLookupField__c'; // The field you're checking

//   // Describe the object to get its fields
//   conn.sobject(objectName).describe(function(err, meta) {
//     if (err) {
//       return console.error(err);
//     }

//     // Check if the field exists
//     const fieldExists = meta.fields.some(field => field.name === fieldName);

//     if (fieldExists) {
//       console.log(`Field "${fieldName}" exists on object "${objectName}".`);
//     } else {
//       console.log(`Field "${fieldName}" does not exist on object "${objectName}".`);
//     }
//   });
// });

  

// //  Create Lookup Field
// const jsforce = require('jsforce');

// conn.login(username, password, function(err, userInfo) {
//   if (err) {
//     return console.error(err);
//   }

//   console.log('Connected to Salesforce as user:', userInfo.id);

//   // Define metadata for lookup field
//   const lookupFieldMetadata = {
//     fullName: 'Account.CustomLookupField__c', // ObjectName.FieldName
//     label: 'Custom Lookup Field',
//     type: 'Lookup',
//     referenceTo: 'Contact', // The object this field looks up to
//     relationshipLabel: 'Custom Contact', // Label for the relationship
//     relationshipName: 'Custom_Contact' // API name for the relationship
//   };

//   // Create the lookup field using Metadata API
//   conn.metadata.create('CustomField', lookupFieldMetadata, function(err, result) {
//     if (err) {
//       return console.error(err);
//     }

//     console.log('Lookup field created successfully:', result);
//   });
// });
