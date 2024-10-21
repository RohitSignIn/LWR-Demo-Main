class AuthService {
  constructor(AuthRepository) {
    this.authRepository = AuthRepository;
  }

  async create(data) {
    try {
      const response = await this.authRepository.create(data);
      return response;
    } catch (error) {
      console.log("Auth Service errorA" + error);
    }
  }

  async update(filter, update) {
    try {
      const response = await this.authRepository.update(filter, update);
      return response;
    } catch (error) {
      console.log("Auth Service errorB" + error);
    }
  }

  async fetchAll() {
    try {
      const response = await this.authRepository.fetch();
      if (!response.length) throw new error("No data found");
      return response;
    } catch (error) {
      console.log("Auth Service errorC" + error);
    }
  }

  async fetchById(id) {
    try {
      const response = await this.authRepository.fetchById(id);
      if (!response) {
        return false;
      }
      return response;
    } catch (error) {
      console.log("Auth Service errorD" + error);
    }
  }

  async fetchByOrgId(orgId) {
    try {
        const response = await this.authRepository.fetchByOrgId(orgId);
        if (!response) {
          return false;
        }
        return response;
      } catch (error) {
        console.log("Auth Service errorE" + error);
      }
  }

  async remove(authId) {
    try {
      const response = await this.authRepository.remove(authId);
      return response;
    } catch (error) {
      console.log("Auth Service errorF" + error);
    }
  }
}
export default AuthService;