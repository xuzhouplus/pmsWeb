// 全局你可以创建多个reducer 在这里统一在一起
import {combineReducers, createStore} from "redux";
import {auth, site, program} from "./Reducers";
import {authState, siteState, programState} from "./States";

const rootReducers = combineReducers({auth, site, program})
const initState = {
	auth: authState,
	site: siteState,
	program: programState
}
// 全局就管理一个store
export const store = createStore(rootReducers, initState)