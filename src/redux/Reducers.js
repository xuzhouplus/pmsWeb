import {loginAction, logoutAction, initAction, destroyAction, programAction} from './Actions';
import {programState, authState, siteState} from './States';

let auth = (state = authState, action) => {
	switch (action.type) {
		case loginAction.type:
			return action.payload;
		case logoutAction.type:
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
		case initAction.type:
			return action.payload;
		case destroyAction.type:
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
		default:
			return state;
	}
}

let program = (state = programState, action) => {
	switch (action.type) {
		case programAction.type:
			return action.payload;
		default:
			return state;
	}
}
export {
	auth,
	site,
	program
}