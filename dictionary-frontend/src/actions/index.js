import { setDataActiontype, resetDataActionType } from '../actionTypes'
import { BASEURL } from '../config'
export const setData = (data) => ({ type: setDataActiontype, payload: data })

export const setDataForASearch = (word) => (dispatch) => {
    return fetch(`${BASEURL}/word/${word}`, {method:'POST'}).then((res) => res.json()).then(data => {
        const { data: existingWordsInDatabase, newwordAdded } = data

        const newWordsList = existingWordsInDatabase.map((item) => {
            const { name, categories } = item
            const { definitions, categoryname } = categories[0]
            return { name, categoryname, definition: definitions[0] }
        })
        if (newwordAdded) {
            const { name, categories } = newwordAdded
            const { categoryname, definitions } = categories[0]
            newWordsList.push({ name, categoryname, definition: definitions[0] })
        }

        dispatch(setData(newWordsList))
    })
}

export const resetData = () => ({type:resetDataActionType})