const {DataTypes}= require("sequelize");
const sequelize = require("../config/database")

const Score = sequelize.define(
    "Score",
    {
        id:{
            type: DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            primaryKey: true
        },
        score:{
            type: DataTypes.INTEGER,
            allowNull:false
        }

    },
    {
        tableName:"scores",
        timestamps:true
    }
)

module.exports=Score;