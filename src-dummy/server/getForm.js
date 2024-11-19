import FormModel from "./formModel.js";

const getForm = async (req, res) => {
    try{
        const data = await FormModel.findOne();
        console.log(data.form, "check")   
        return res.send(data);
    }catch(e){
        console.log(e)
    }
}

export default getForm;

