const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql')

const WordModel = require('../models/word')

const CategoryType = new GraphQLObjectType({
    name: 'lexicalcategory',
    fields: () => ({
        categoryname: { type: new GraphQLNonNull(GraphQLString) },
        pronunciation: { type: GraphQLString },
        examples: { type: new GraphQLList(GraphQLString) },
        definitions: { type: new GraphQLList(GraphQLString) },
        origin: { type: new GraphQLList(GraphQLString) }
    })
})

const WordType = new GraphQLObjectType({
    name: 'word',
    fields: () => ({
        name: { type: new GraphQLNonNull(GraphQLString) },
        categories: { type: new GraphQLList(CategoryType) }
    })
})


const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        words: {
            type: new GraphQLList(WordType),
            resolve(parent, arguments) {
                return WordModel.find({}, { "categories": { $slice: 1 } })
            }
        },
        word: {
            type:WordType,
            args:{word:{type:GraphQLString}},
            resolve(_, args) {
                const smallname = args.word.trim().toLocaleLowerCase()
         
                return WordModel.findOne({name:smallname})
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})