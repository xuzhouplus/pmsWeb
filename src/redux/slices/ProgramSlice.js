import {createSlice} from "@reduxjs/toolkit";

export const programSlice = createSlice({
    name: 'program',
    initialState: {},
    reducers: {
        program: (state, action) => {
            return Object.assign({}, state, action.payload)
        },
        loginModal: (state, action) => {
            state.showLogin = action.payload
            return state
        }
    }
})
export const {program, loginModal} = programSlice.actions
export default programSlice.reducer
