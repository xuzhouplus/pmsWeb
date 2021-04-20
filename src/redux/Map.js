import {loginAction, logoutAction, programAction} from "@/redux/Actions";

const Map = {
	mapAccountStateToProps: (state) => {
		return {
			account: state.auth
		};
	},
	mapProgramStateToProps: (state) => {
		return {
			program: state.program
		};
	},
	mapSiteStateToProps: (state) => {
		return {
			site: state.site
		};
	},
	mapStatesToProps: (state) => {
		return {
			program: state.program,
			account: state.auth,
			site: state.site
		};
	},
	mapDispatchToProps: (dispatch) => {
		return {
			state: (program) => {
				dispatch({
					type: programAction.type,
					payload: program
				})
			},
			login: (user) => {
				dispatch({
					type: loginAction.type,
					payload: user
				})
			},
			logout: () => {
				dispatch({
					type: logoutAction.type
				})
			}
		}
	},
	mapStateDispatchToProps: (dispatch) => {
		return {
			state: (program) => {
				dispatch({
					type: programAction.type,
					payload: program
				})
			}
		}
	},
	mapLoginDispatchToProps: (dispatch) => {
		return {
			login: (user) => {
				dispatch({
					type: loginAction.type,
					payload: user
				})
			}
		}
	},
	mapLogoutDispatchToProps: (dispatch) => {
		return {
			logout: () => {
				dispatch({
					type: logoutAction.type
				})
			}
		}
	}
}

export default Map