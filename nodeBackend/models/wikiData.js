//Private methods are only for helping create/complete query strings based on given params
//For errors in functions being called in controllers, throwing/raising error to controller so that required response will be sent
//For functions only being called in scripts only, handling errors here only

const mysqlServer = require('mysql2/promise')

class WikiData {

  constructor(data = null)
  {
    this.data = data;
  }

  static db = this.setDBPool();

  static nonDefaultColumns = ["User", "Name", "Date", "changes", "updated_at"];

  static setDBPool()
  {
    const environment = require('./../environment.json');
    const dbEnvironment = environment["database"];
    return mysqlServer.createPool({
      host: dbEnvironment["hostname"],
      user: dbEnvironment["username"],
      password: dbEnvironment["password"],
      database: dbEnvironment["database"],
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      multipleStatements: true
    })
  }

  static async createTable()
  {
    try {
      let sql = "CREATE TABLE IF NOT EXISTS wiki_data (`id` bigint NOT NULL AUTO_INCREMENT, User VARCHAR(255) NOT NULL, Name VARCHAR(255) NOT NULL, Date datetime(6) NOT NULL, changes INT NOT NULL, updated_at datetime(6) DEFAULT NULL, PRIMARY KEY (`id`))";
      await this.#runQuery(sql)
      return true;
    } catch (error) {
      console.error(error)
    }
  }

  static async getTotalRows()
  {
    try {
      let sql = "select count(*) from wiki_data";
      let result = await this.#runQuery(sql)
      return result[0][0]['count(*)']
    } catch (error) {
      throw({
        status: 500,
        error_message: error
      })
    }

  }

  static async uploadData(csvData)
  {
    try {
      let data = this.#sanitizeMultipleDataToCommaSeperatedValues(csvData);
      let sql = `INSERT INTO wiki_data ${data["columns"]} VALUES ${data["values"]}`;
      await this.#runQuery(sql);
    } catch (error) {
      console.error(error)
    }
  }

  static async fetchData(start)
  {
    try{
      let sql = `select * from wiki_data order by updated_at desc limit 25 offset ${start}`;
      return await this.#runQuery(sql);
    } catch(error) {
      throw({
        status: error.status || 500,
        error_message: error.error_message || error
      })
    }

  }

  async insertData()
  {
    try{
      let data = this.#santizeSingleDataToCommaSeparatedValues()
      let sql = `INSERT INTO wiki_data (${data["columns"]}) VALUES (${data["values"]});select id from wiki_data order by id desc limit 1;`
      let result = await WikiData.#runQuery(sql);
      this.data.id = result[0][1][0]["id"]
      return this.data; // returning created object, in case needed by some new functionality later
    } catch(error){
      throw({
        status: error.status || 500,
        error_message: error.error_message || error
      })
    }

  }

  async updateData()
  {
    try {
      let id = this.data.id;

      this.data.updated_at = `${WikiData.#getCurrentDateTime()}`;
      let updateString = this.#formUpdateString();

      let sql = `update wiki_data set ${updateString} where id=${id}; select * from wiki_data where id=${id}`;
      let result = await WikiData.#runQuery(sql)
      return result[0][1][0]; // returning updated object, in case needed by some new functionality later
    } catch (error) {
      throw({
        status: error.status || 500,
        error_message: error.error_message || error
      })
    }

  }

  static #getCurrentDateTime() //No need to handle errors as it is independent on any input, only uses functions/methods of Date class
  {
    const currentdate = new Date();
    return `${currentdate.getFullYear()}-${currentdate.getMonth()}-${currentdate.getDate()} ${currentdate.getHours()}:${currentdate.getMinutes()}:${currentdate.getSeconds()}.${currentdate.getMilliseconds()}`
  }

  #formUpdateString()
  {
    try {
      let data = this.data;
      let keys = Object.keys(data);
      let finalString = ""
      for (let keyIndex = 0; keyIndex < keys.length; keyIndex++)
      {
        let key = keys[keyIndex];
        if (key == "id")
        {continue}
        else if (key === "changes")
          {finalString = finalString + `${key}=${this.data[key]}`;}
        else
          {finalString = finalString + `${key}="${this.data[key]}"`;}
        if (keyIndex != keys.length - 1)
          {finalString = finalString + ", "}
      }
      return finalString;
    } catch (error) {
      throw({
        status: 422,
        error_message: error
      })
    }

  }

  static #sanitizeMultipleDataToCommaSeperatedValues(values)
  {
    try {
      let columns = `(${WikiData.nonDefaultColumns.join(", ")})`
      let valueString = values.map((row) => {

        const timeFormatter = (time) => {
          let timeSegments = time.split(" ");
          timeSegments[0] = timeSegments[0].split("/").reverse().join("-")
          let finalTime = `${timeSegments.join(" ")}:00`;
          return finalTime
        }

        let rowSegments = row.split(",");
        rowSegments[2] = timeFormatter(rowSegments[2]);

        if (rowSegments.length !== 4)
        {
          throw "Data is not correctly given";
        }
        return `("${rowSegments[0]}", "${rowSegments[1]}", "${rowSegments[2]}", ${rowSegments[3]}, "${this.#getCurrentDateTime()}")`
      })
      return {
        "columns": columns,
        "values": valueString.join(", ")
      }
    } catch (error) {
      throw({
        status: 500,
        error_message: error
      })
    }

  }

  #santizeSingleDataToCommaSeparatedValues()
  {
    try {
      let columns = WikiData.nonDefaultColumns
      let values = columns.map((column) => {
        if (column === "updated_at")
          {return `"${WikiData.#getCurrentDateTime()}"`}
        else if (column !== "changes")
          {return `"${this.data[column]}"`;}
        else
          {return `${this.data[column]}`;}
      });

      let columnsCommaSeparated = columns.join(", ");
      let valuesCommaSeparated = values.join(", ")
      return {
        "columns": columnsCommaSeparated,
        "values": valuesCommaSeparated
      }
    } catch (error) {
      throw({
        status: 500,
        error_message: error
      })
    }

  }

  static async #runQuery(sql)
  {
    try{
      return await this.db.query(sql)
    } catch (error) {
      throw({
        status: 500,
        error_message: error.sqlMessage
      })
    }
  }

}

module.exports = WikiData
