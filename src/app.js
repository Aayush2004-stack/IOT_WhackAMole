const express = require("express")
const dotenv = require("dotenv");
const sequelize = require("./config/database");


// routes



dotenv.config();
const app = express();
const PORT= process.env.PORT || 4000;

//middleware
app.use(express.json());// to parse json bodies

//test db connection + sync model
(async ()=>{
    try{
        await sequelize.authenticate();
        console.log("DB connected")

        require("./model/score")

        await sequelize.sync();
        console.log("db sync")
    }
    catch(err){
        console.log(err);

    }
})()

//routes


app.listen(PORT,()=>{
    console.log("Server is running on port:", PORT)
});

module.exports= app;