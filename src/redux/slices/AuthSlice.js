import {createSlice} from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {},
    reducers: {
        login: (state, action) => {
            return Object.assign({}, state, action.payload)
        },
        logout: (state) => {
            return {}
        }
    }
})

export const {login, logout} = authSlice.actions
export default authSlice.reducer
