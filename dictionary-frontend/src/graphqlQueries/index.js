import {
  gql
} from "@apollo/client";

export const getAllSearchedWordsQuery = gql`
 query {
    words {
      name
      categories {
        categoryname
        definitions
      }
    }
  }
`
// export const getWordQuery = (word) => {
//   return gql`
//   query  {
//      words(word:${word}) {
//        name
//        categories {
//          categoryname
//          definitions
//          pronunciation
//          examples
//          origin
//        }
//      }
//    }
// } 
// `
// }
export const getWordQuery = gql`
 query ($word:String) {
  word(word:$word) {
      name
      categories {
        categoryname
        definitions
        pronunciation
        examples
        origin
      }
    }
  }
`