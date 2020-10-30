// 全局你可以创建多个reducer 在这里统一在一起
import {combineReducers, createStore} from "redux";
import {auth} from "./Reducers";
import {authState} from "./States";

const rootReducers = combineReducers({auth})
const initState = {
	auth: authState
}
// 全局就管理一个store
export const store = createStore(rootReducers, initState)