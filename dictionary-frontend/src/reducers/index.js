import {combineReducers} from 'redux'

import wordsList from './wordslist'
import resetData from './reset'

export default combineReducers({
    wordsList,
    resetData
})