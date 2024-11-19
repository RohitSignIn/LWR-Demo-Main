import TemplateRepository from "../repository/template.repository.js";
import TemplateService from "../services/template.service.js";

import resObject from "../response/allResponse.js";

const templateService = new TemplateService(new TemplateRepository());

async function create(req, res) {
  try {
    const body = req.body.template;
    console.log(req.body.template, 'req body from controller');
    const data = {
      html: body.html,
      json_template: body.json_template,
      org_auth_id: body.org_auth_id
    };

    const newTemplate = await templateService.create(data);

    console.log(newTemplate);

    return res.status(201).send(
      resObject(true, {
        id: newTemplate,
        success: true,
        message: "Successfully created",
      })
    );
  } catch (error) {
    console.log("Template ControllerA", error.message);
  }
}

async function updateTemplate(req, res) {
  try {
    console.log(req.body, "here is the req body");
    const id = req.body.template.id;
    const template = req.body.template.html;
    const jsonTemplate = req.body.template.json_template;
    const isPublish = req.body.template.is_publish;

    const updTemplate = await templateService.update(
      { _id: id },
      { html: template, json_template: jsonTemplate, isPublish: isPublish }
    );

    if (updTemplate) {
      return res
        .status(201)
        .send(resObject(true, { message: "Successfully updated" }));
    } else {
      return res
        .status(401)
        .send(resObject(false, { message: "Document not found in DB" }));
    }
  } catch (error) {
    console.log("Template ControllerB", error.message);
  }
}

async function fetchByTempId(req, res) {
  try {
    const templateId = req.params.id;
    const recTemplate = await templateService.fetch({ _id: templateId });

    if (recTemplate) {
      return res.status(200).send(resObject(true, { data: recTemplate.html, jsonTemp: recTemplate.json_template }));
    } else {
      return res
        .status(401)
        .send(resObject(false, { message: "Document not found in DB" }));
    }
  } catch (error) {
    console.log("Template ControllerC", error.message);
  }
}

async function remove(req, res) {
  try {
    const templateId = req.body.template.id;
    console.log(templateId, "Pass Mwre, Received id")
    const delTemplate = await templateService.remove({ _id: templateId });

    if (delTemplate) {  
      return res.status(200).send(resObject(true, { data: delTemplate }));
    } else {
      return res
        .status(401)
        .send(resObject(false, { message: "Document not found in DB" }));
    }
  } catch (error) {
    console.log("Template ControllerD", error.message);
  }
}


async function getTempOrgid(templateId) {
  try {
    const tempData = await templateService.fetch({ _id: templateId });
    const orgAuthId = tempData.org_auth_id || false;
    return orgAuthId;
  } catch (error) {
    console.log("Template ControllerE", error.message);
  }
}

export {
  create,
  updateTemplate,
  fetchByTempId,
  remove,
  getTempOrgid
};
