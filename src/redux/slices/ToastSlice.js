import {createSlice} from "@reduxjs/toolkit";

const toastMsg = {
    type: 'info',//warning, error, success, info, question
    header: null,
    text: null,
    position: 'top-center',//'top-start','top-center','top-end','middle-start','middle-center','middle-end','bottom-start','bottom-center','bottom-end'
    delay: 0,
    autoHide: false
}

export const toastSlice = createSlice({
    name: 'toast',
    initialState: toastMsg,
    reducers: {
        toast: (state, action) => {
            let payload
            if (typeof action.payload === 'string') {
                payload = {
                    text: action.payload
                }
            } else {
                payload = action.payload
            }
            return Object.assign({}, toastMsg, payload)
        },
        hide: (state, action) => {
            return Object.assign({}, state, {text: null})
        }
    }
})
export const {toast, hide} = toastSlice.actions
export default toastSlice.reducer
