import mongoose from "mongoose";

const tempSchema = new mongoose.Schema({  
    html: {
        type: String        
    },
    json_template: {
        type: String        
    },
    org_auth_id: {
        type: String,
        required: true
    },
    isPublish: {
        type: Boolean,
        default: false
    }
});

const TempModel = new mongoose.model("templates", tempSchema);

export default TempModel;