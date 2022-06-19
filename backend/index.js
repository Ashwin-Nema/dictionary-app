const express = require('express')
const { graphqlHTTP } = require('express-graphql')
require('dotenv').config()
const graphqlSchema = require('./graphqlSchema')
const app = express()
app.use(express.json({ limit: '5242980kb' }));
app.use(express.urlencoded({ extended: true, limit: '5242980kb' }))
const cors = require('cors')
const databaseconnection = require('./database')

const word_router = require('./routes/word')
app.use(
    cors({
        origin: process.env.PORT || 'http://localhost:3000'
    })
)


app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema
}))

app.use("/word", word_router)

app.listen(4000, () => databaseconnection())