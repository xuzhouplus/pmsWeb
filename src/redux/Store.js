// 全局你可以创建多个reducer 在这里统一在一起
import {authState, siteState, programState, toastState} from "./States";
import {configureStore} from "@reduxjs/toolkit";
import siteReducer from "./slices/SiteSlice"
import programReducer from "./slices/ProgramSlice"
import authReducer from "./slices/AuthSlice"
import toastReducer from "./slices/ToastSlice"

// 全局就管理一个store
export const store = configureStore({
    reducer: {
        site: siteReducer,
        program: programReducer,
        auth: authReducer,
        toast: toastReducer,
    },
    preloadedState:{
        site:siteState,
        program:programState,
        auth:authState,
        toast:toastState
    }
})
