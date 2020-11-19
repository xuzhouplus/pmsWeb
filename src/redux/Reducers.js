import {login, logout, init} from './Actions';
import {authState, siteState} from './States';

let auth = (state = authState, action) => {
	switch (action.type) {
		case login.type:
			return action.payload;
		case logout.type:
			return {
				id: null,
				name: "",
				avatar: "",
				token: ""
			}
		default:
			return state;
	}
}
let site = (state = siteState, action) => {
	switch (action.type) {
		case init.type:
			return action.payload;
		case logout.type:
			return {
				title: "",
				icp: null,
				version: "",
				maintain: false,
				icon: "",
				logo: "",
				carousel_type: null,
				carousel_limit: null
			}
		default:
			return state;
	}
}
export {
	auth,
	site
}