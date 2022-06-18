const express = require('express')
const { graphqlHTTP } = require('express-graphql')
require('dotenv').config()
const graphqlSchema = require('./graphqlSchema')
const path = require('path');
const app = express()
app.use(express.json({ limit: '5242980kb' }));
const PORT = process.env.PORT || 4000
app.use(express.urlencoded({ extended: true, limit: '5242980kb' }))
app.use(express.static(path.join(__dirname, 'build')));
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

app.get('/*', function (_, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

app.listen(PORT, () => databaseconnection())