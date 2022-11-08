class MainApp {

  static runApp()
  {
    //require controller, environment and needed in-built or installed libraries
    const environment = require('./environment.json')
    const httpServer = require('http')
    const WikiPageController = require('./controllers/wikiPageController.js')

    //router and server
    const server = httpServer.createServer((req, res) => {
      const controller = new WikiPageController({
        "req": req,
        "res": res
      })

      const path = req.url.split("?")[0]
      const method = req.method

      const handleCORS = (res) => {
        res.setHeader('Access-Control-Allow-Origin', `${environment["domain"]}:${environment["frontendPort"]}`);
        res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT');
        res.setHeader('Access-Control-Max-Age', 60*60*24); //setting limit to 1 day
      }

      handleCORS(res);

      try{
        if (path === "/" && method === "GET")
        {
          controller.homeListing()
        }

        else if (path === "/addRecord" && method === "POST")
        {
          controller.addRecord()
        }

        else if (path === "/updateRecord" && method === "PUT")
        {
          controller.editRecord()
        }

        else //default route handler, no need of controller specific logic
        {
          if (method !== "OPTIONS")
          {
            res.writeHead( 404, 'Route not found');
            res.end(JSON.stringify({"error": "Route not found"}))
          }
          else
          {
            res.end()
          }
        }
      } catch(error) {
        console.error(error)
        res.writeHead(500)
        res.end(JSON.stringify({"error": `${error}`}))
      }

    }).listen(environment["port"], () => {
      console.log("Server started")
    })
    server.on('uncaughtException', function (req, res, route, error){
      console.error(error)
      res.status(500).end(JSON.stringify({"error": `${error}`}))
    })
  }

}

MainApp.runApp()
