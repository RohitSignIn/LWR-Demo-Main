class TemplateService {
    constructor(TemplateRepository) {
      this.templateRepository = TemplateRepository;
    }
  
    async create(data) {
      try {
        const response = await this.templateRepository.create(data);
        return response;
      } catch (error) {
        console.log("Template Service errorA" + error);
      }
    }
  
    async update(filter, update) {
      try {
        const response = await this.templateRepository.update(filter, update);
        if(response.matchedCount === 0){
            return false;
        }
        return response;
      } catch (error) {
        console.log("Template Service errorB" + error);
      }
    }
    
    async fetch(filter) {
      try {
          const response = await this.templateRepository.fetch(filter);
          if (!response) {
            return false;
          }
          return response;
        } catch (error) {
          console.log("Template Service errorE" + error);
        }
    }
  
    async remove(filter) {
      try {
        const response = await this.templateRepository.remove(filter);
        return response;
      } catch (error) {
        console.log("Template Service errorF" + error);
      }
    }

  }

export default TemplateService;