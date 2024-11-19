import FormModel from "./formModel.js";

const saveForm = async (req, res) => {
  // const form = new FormModel({
  //   form: req.body.data
  // });
  // form.save()

  const data = await FormModel.findOne({_id: req.body.id});

  let response;
  if(data === null){
    const form = new FormModel({
      access_token: req.body.access_tokem ? req.body.access_tokem : "",
      refresh_token: req.body.refresh_token ? req.body.refresh_token : "",
      instance_url: req.body.instance_url ? req.body.instance_url : "",
      org_id: req.body.org_id ? req.body.org_id : "",
      form: req.body.form
    });
    response = await form.save()
  }else{
    response = await FormModel.findOneAndUpdate({_id: req.body.id}, {form: req.body.form});
  }

  return res.send({id: response._id})
}

export default saveForm;

// const data = {"type":"header",
// "subtype":"h1",
// "label":"formBuilder in Check",
// "access":false}
// ,
// {
// "type":"paragraph",
// "subtype":"p",
// "label":"This is a demonstration of formBuilder running in a React project.",
// "access":false
// },
// {
// "type":"text",
// "required":false,
// "className":"form-control",
// "name":"text-1716267994444-0",
// "access":false,
// "subtype":"text"
// }