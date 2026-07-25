import "dotenv/config"
import app from "./src/app.js"
import Database from "./src/config/database.js"
const port = Number(process.env.PORT) || 5000
Database()

app.listen(port,()=>{
    console.log("Server running SuccessFully on port",port);
})

