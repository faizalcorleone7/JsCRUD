//Basic functions that helps controllers handle routes like getting parameters, sending error responses.
const url = require('url');

class BaseController {

  constructor(params)
  {
    this.request = params["req"]
    this.response = params["res"]
    this.response.setHeader('Content-Type', 'application/json');
    this.params = this.#getParams()
  }

  #getParams()
  {
    return this.#parseQuery().query;
  }

  #parseQuery()
  {
    return url.parse(this.request.url, true);
  }

  handleStandardError(errorJson)
  {
    this.response.writeHead(errorJson.status)
    this.response.end(JSON.stringify({"error": errorJson.error_message}))
  }

}



module.exports = BaseController
