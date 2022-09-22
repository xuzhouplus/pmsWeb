import {createSlice} from "@reduxjs/toolkit";

export const siteSlice = createSlice({
    name: 'site',
    initialState: {},
    reducers: {
        init: (state, action) => {
            return Object.assign({}, state, action.payload)
        },
        destroy: (state) => {
            return {
                title: "",
                icp: null,
                version: "",
                maintain: false,
                icon: "",
                logo: "",
                carousel_type: null,
                carousel_limit: null,
                carousel_interval: null,
                connects: []
            }
        }
    }
})
export const {init, destory} = siteSlice.actions
export default siteSlice.reducer
