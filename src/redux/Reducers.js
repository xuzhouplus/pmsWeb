import {login, logout} from './Actions';
import {authState} from './States';

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
export {
	auth
}