import mongoose from "mongoose";

const salesforce_schema = new mongoose.Schema({  
    org_id: String,
    access_token: String,
    refresh_token: String,
    instance_url: String,
    created_at: String,
    updated_at: String,
    is_sandbox: String
})

const formSchema = new mongoose.Schema({  
    salesforce_data: salesforce_schema,
    form: String
})
const FormModel = new mongoose.model("formeasy", formSchema);

export default FormModel;