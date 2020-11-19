// 全局你可以创建多个reducer 在这里统一在一起
import {combineReducers, createStore} from "redux";
import {auth, site} from "./Reducers";
import {authState, siteState} from "./States";

const rootReducers = combineReducers({auth, site})
const initState = {
	auth: authState,
	site: siteState
}
// 全局就管理一个store
export const store = createStore(rootReducers, initState)