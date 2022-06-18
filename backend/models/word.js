const mongoose = require('mongoose')

const wordSchema = mongoose.Schema({
    name:{
        type:String,
         required:true
    },

    categories:[
        {
            definitions:{
                type:[String],
                required:true
            },
            pronunciation:String,
            examples:[String],
            origin:[String],
            categoryname:{
                type:String,
                required:true
            }
        }
    ]
})

module.exports = mongoose.model('Word', wordSchema)