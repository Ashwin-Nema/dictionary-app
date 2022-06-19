const express = require('express')
const WordModel = require('../models/word')
require('dotenv').config()
const word_router = express.Router()
const { AddNewWordToDataBaseFromOxfordApi } = require('../utils')
word_router.use(express.json({ limit: '5242980kb' }));
word_router.use(express.urlencoded({ extended: true, limit: '5242980kb' }))
const { CLOUDNAME, APIKEY, APISECRET } = process.env

const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: CLOUDNAME,
    api_key: APIKEY,
    api_secret: APISECRET
});

word_router.post("/add", async (req, res) => {
    try {
        const { name, category: { categoryname, definitons, origin, pronunciation, examples } } = req.body
        if (!examples || !name || typeof name != "string" || name.trim() == "" || !categoryname || typeof categoryname != "string" || categoryname.trim() == "" || !Array.isArray(definitons) || definitons.length == 0) {
            res.status(404).send("Data provided is not proper")
            return
        }
        const trimmedShortName = name.toLocaleLowerCase().trim()
        const wordinDatabase = await WordModel.findOne({ name: trimmedShortName })
        if (wordinDatabase) {
            res.json({ message: "Word is present in database" })
            return
        }
        const dataToBeSaved = { name, categories: [{ categoryname, definitons, examples }] }
        if (pronunciation) {
            const uploadeddata = await cloudinary.uploader.upload(base64urlmediaurl,
                { resource_type: "auto" });
            const { secure_url } = uploadeddata
            dataToBeSaved.categories[0].pronunciation = secure_url
        }
        try {
            const wordInOxfordDictionary = await AddNewWordToDataBaseFromOxfordApi(trimmedShortName)
        if (wordInOxfordDictionary) {
            res.json({ message: "Word is present in oxford dictionary" })
            return
        }
        } catch {
            
        }
        const newWord = new WordModel(dataToBeSaved)
        await newWord.save()
        res.json({ message: "Word added successfully" })
    } catch(error) {
        console.log(error)
        res.status(404).send("Sorry something went wrong")
    }
})

word_router.post("/searchingword/:searchingword", async (req, res) => {
    console.log("Coming here")
    try {
        let wordToSearch = req.params.searchingword

        if (!wordToSearch || typeof wordToSearch != "string" || wordToSearch.trim() == "") {
            return res.status(404).send("Word provided is not proper")
        }
        wordToSearch = wordToSearch.trim().toLocaleLowerCase()
        const data = await WordModel.find({ "name": { "$regex": `^${wordToSearch}*` } }, { "categories": { $slice: 1 } })
        const wordInDatabase = await WordModel.find({ name: wordToSearch })
        const wordNotPresent = wordInDatabase.length == 0
        let newwordAdded = null
        if (wordNotPresent) {
            newwordAdded = await AddNewWordToDataBaseFromOxfordApi(wordToSearch)
        }
        res.json({ data, newwordAdded })
    } catch (error) {
        console.log(error)
        console.log("dfdf")
        res.status(404).send("Sorry something went wrong")
    }
})

module.exports = word_router