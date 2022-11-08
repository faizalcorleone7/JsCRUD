//Only handle routes

const BaseController = require('./baseController');
const WikiData = require('../models/wikiData');

class WikiPageController extends BaseController {

    async homeListing()
    {
      try {
        let start = this.params["offset"]
        let dbData = await WikiData.fetchData(start)
        this.response.end(JSON.stringify({...dbData[0], totalRows: await WikiData.getTotalRows()}))
      } catch (error) {
        this.handleStandardError(error)
      }

    }

    async addRecord()
    {
      try{
        const modelObject = new WikiData(this.params)
        await modelObject.insertData();
        this.response.end(JSON.stringify({"message": "Record created successfully"}))
      } catch (error) {
        this.handleStandardError(error)
      }
    }

    async editRecord()
    {
      try {
        const modelObject = new WikiData(this.params)
        await modelObject.updateData()
        this.response.end(JSON.stringify({"message": "Record updated successfully"}))
      } catch (error) {
        this.handleStandardError(error)
      }
    }

}

module.exports = WikiPageController
