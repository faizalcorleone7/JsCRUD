const WikiData = require("../models/wikiData");
const CSVHandler = require('fs')
const path = require('path');
const dataFilename = process.argv.slice(2).join("\ ")
try{
  const CSVFile = path.resolve(__dirname, `./../../${dataFilename}`)
} catch(error) {
  console.error("Give correct filename")
  process.exit()
}


async function uploadData()
{
  try {
        //create table
        await WikiData.createTable()

        let numberOfRows = await WikiData.getTotalRows()
        if (numberOfRows === 0)
        {
          //import data
          let csvData = []
          CSVHandler.readFile(CSVFile, "utf-8", async (error, data) => {
            if (error)
            {
              console.log("Error occured while importing data")
              console.log(`Error - ${error}`)
              process.exit()
            }
            else
            {
              let csvData = data.split("\r\n").slice(1)
              try {
                //upload data
                await WikiData.uploadData(csvData);
                console.log("Uploaded data successfully")
                process.exit()
              } catch (error) {
                console.log("Error occured while uploading data")
                console.log(error)
                process.exit()
              }
            }
          })
        }
        else
        {
          console.log("Data is already present. Aborting")
          process.exit()
        }
  } catch (error) {
    console.log("Error occured")
    console.log(error)
    process.exit()
    }
}



uploadData()
