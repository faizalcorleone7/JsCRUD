This project has 3 directories -
  1.) DataFile -> Store the CSV file for MySQL here. (File name is fixed as -> Dataset- Full Stack task - smallwikipedia (1).csv)
  2.) frontend_service -> Frontend code for the ReactJS SPA.
  3.) nodeBackend -> Backend code for the NodeJS API.
 
Backend setup ->
  Go to nodeBackend folder and do the following ->
  1.) Update environment.json. For localhost reasons, have kept domain as "http://localhost". Port for frontend service (frontendPort) and backend service (port) can be configured here. Also all database related credentials can be updated here
  2.) Create a database with the name mentioned in environment.json
  3.) Run the command to load database with initial data -> node  scripts/uploadFileData.js
  4.) Start the app -> node app.js
  
 Frontend Setup ->
   Go to frontend_service folder and run -> npm start
