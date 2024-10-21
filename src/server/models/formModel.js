import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    form: {
        type: Schema.Types.Mixed
    }
})
const FormModel = new mongoose.model("forms", formSchema);

export default FormModel;