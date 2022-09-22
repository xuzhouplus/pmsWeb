import {createSlice} from "@reduxjs/toolkit";

export const toastSlice = createSlice({
    name: 'toast',
    initialState: {
        // header: null,
        // text: null,
        // position: null,
        // delay: 0,
        // autoHide: false
    },
    reducers: {
        toast: (state, action) => {
            return Object.assign({}, state, action.payload)
        },
        hide: (state, action) => {
            return {}
        }
    }
})
export const {toast, hide} = toastSlice.actions
export default toastSlice.reducer
