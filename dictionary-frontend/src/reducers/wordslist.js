import {setDataActiontype} from '../actionTypes'
const inititalState = []

const wordsList = (state, action) => {
    state = state || inititalState
    switch(action.type) {
        case setDataActiontype:
            return action.payload
        default:
            return state
    }
}

export default wordsList