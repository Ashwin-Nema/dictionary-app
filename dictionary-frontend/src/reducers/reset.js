import {resetDataActionType} from '../actionTypes'
const inititalState = false

const resetData = (state, action) => {
    state = state || inititalState
    switch(action.type) {
        case resetDataActionType:
            return !state
        default:
            return state
    }
}

export default resetData