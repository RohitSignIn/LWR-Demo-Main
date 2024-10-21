import mongoose from "mongoose";

const authSchema = new mongoose.Schema({ 
    org_id: String,
    access_token: String,
    refresh_token: String,
    instance_url: String,
    is_sandbox: Boolean,
    is_connected: Boolean
}, { timestamps: true })
const AuthModel = new mongoose.model("org_auths", authSchema);

export default AuthModel;