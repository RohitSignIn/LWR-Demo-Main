import AuthModel from "../models/authModel.js";

class AuthRepository {
    async create(data) {
      try {
        const newAuth = new AuthModel({...data});
        const response = await newAuth.save();
        return response;
      } catch (error) {
        throw error;
      }
    }

    async update(filter, update) {
        try {
          const response = await AuthModel.updateOne(filter, { $set: { ...update } });
          return response.acknowledged;
        } catch (error) {
          throw error;
        }
      }

    async fetch() {
    try {
      const response = await AuthModel.find();
      if (!response) throw new Error("No data found");
      return response;
    } catch (error) {
      throw error;
    }
  }

  async fetchById(id) {
    try {
      const response = await AuthModel.findOne({ _id: id });
      if (!response) return false;
      return response;
    } catch (error) {
      throw error;
    }
  }

  async fetchByOrgId(orgId) {
    try {
      const response = await AuthModel.findOne({ org_id: orgId });
      if (!response) return false;
      return response;
    } catch (error) {
      throw error;
    }
  }


  async remove(id) {
    try {
      const response = await AuthModel.deleteOne({ _id: id });
      if (!response) throw new Error("No data found");
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default AuthRepository;