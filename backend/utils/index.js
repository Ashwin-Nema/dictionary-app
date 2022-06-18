require('dotenv').config()
const { OXFORDKEY, OXFORDKEYSECRET } = process.env
const WordModel = require('../models/word')
const oxford = require('oxford-dictionaries-api');

const oxforddictionaries = new oxford(OXFORDKEY, OXFORDKEYSECRET);

async function AddNewWordToDataBaseFromOxfordApi(word) {
    let wordAddedData = null
    const wordData = await oxforddictionaries.entries({ word_id: word })
    const { results } = wordData
    const categories = []
    if (Array.isArray(results)) {
        for (let i = 0; i < results.length; i++) {
            const { lexicalEntries } = results[i]

            if (Array.isArray(lexicalEntries)) {

                for (let j = 0; j < lexicalEntries.length; j++) {
                    const { lexicalCategory, entries } = lexicalEntries[j]
                    if (typeof lexicalCategory == 'object' && typeof lexicalCategory.id == "string") {
                        const definitionArr = []
                        const exampleArr = []
                        const originsArr = []
                        let pronunciation = ""
                        if (Array.isArray(entries)) {
                            for (let k = 0; k < entries.length; k++) {

                                const { etymologies, pronunciations, senses } = entries[k]

                                if (Array.isArray(senses)) {

                                    for (let l = 0; l < senses.length; l++) {

                                        const { definitions, examples } = senses[l]

                                        if (typeof definitions == "string") {
                                            definitionArr.push(definitions)
                                        } else if (Array.isArray(definitions)) {
                                            for (let j = 0; j < definitions.length; j++) {
                                                const definition = definitions[i]
                                                if (typeof definition == "string") {
                                                    definitionArr.push(definition)
                                                }
                                            }
                                        }

                                        if (typeof examples == "string") {
                                            exampleArr.push(examples)
                                        } else if (Array.isArray(examples)) {
                                            for (let j = 0; j < examples.length; j++) {
                                                const example = examples[i]
                                                if (typeof example == "object" && typeof example.text == "string") {
                                                    exampleArr.push(example.text)
                                                }
                                            }
                                        }
                                    }
                                }
                                if (Array.isArray(etymologies)) {
                                    for (let l = 0; l < etymologies.length; l++) {
                                        const origin = etymologies[i]
                                        if (typeof origin == "string") {
                                            originsArr.push(origin)
                                        }
                                    }
                                }

                                if (Array.isArray(pronunciations) && pronunciations.length > 0 && typeof pronunciations[0] == "object") {
                                    const { audioFile } = pronunciations[0]
                                    if (typeof audioFile == "string") {
                                        pronunciation = audioFile
                                    }
                                }
                            }
                        }
                        if (definitionArr.length > 0) {
                            let categorydata
                            if (pronunciation == '') {
                                categorydata = { definitions: definitionArr, examples: exampleArr, categoryname: lexicalCategory.id, origin: originsArr }
                            } else {
                                categorydata = { definitions: definitionArr, pronunciation, examples: exampleArr, categoryname: lexicalCategory.id, origin: originsArr }
                            }
                            categories.push(categorydata)
                        }
                    }
                }
            }
        }
    }

    if (categories.length > 0) {
        const newword = new WordModel({ name: word, categories })
        wordAddedData = newword
        await newword.save()
    }

    return wordAddedData
}

module.exports = { AddNewWordToDataBaseFromOxfordApi }