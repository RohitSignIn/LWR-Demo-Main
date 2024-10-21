import TempModel from "../models/tempModel.js";

class TemplateRepository {
  async create(data) {
    try {
      const newAuth = new TempModel({ ...data });
      const response = await newAuth.save();
      return response._id;
    } catch (error) {
      throw error;
    }
  }

  async update(filter, update) {
    try {
      console.log('here is the update data', update)
      const response = await TempModel.updateOne({ ...filter }, {
        $set: { ...update },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async fetch(filter) {
    try {
      const response = await TempModel.findOne({ ...filter });
      if (!response) return false;
      return response;
    } catch (error) {
      throw error;
    }
  }

  async remove(filter) {
    try {
      const response = await TempModel.deleteOne({ ...filter });
      if (!response) throw new Error("No data found");
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default TemplateRepository;
