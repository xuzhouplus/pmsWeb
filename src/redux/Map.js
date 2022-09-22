import {programSlice} from "@redux/slices/ProgramSlice";
import {authSlice} from "@redux/slices/AuthSlice";
import {toastSlice} from "@redux/slices/ToastSlice";

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
    mapToastStateToProps: (state) => {
        return {
            toast: state.toast
        };
    },
    mapStatesToProps: (state) => {
        return {
            program: state.program,
            account: state.auth,
            site: state.site,
            toast: state.toast
        };
    },
    mapDispatchToProps: (dispatch) => {
        return {
            state: (program) => {
                dispatch(programSlice.actions.program(program))
            },
            login: (user) => {
                dispatch(authSlice.actions.login(user))
            },
            logout: () => {
                dispatch(authSlice.actions.logout(null))
            }
        }
    },
    mapStateDispatchToProps: (dispatch) => {
        return {
            state: (program) => {
                dispatch(programSlice.actions.program(program))
            }
        }
    },
    mapLoginDispatchToProps: (dispatch) => {
        return {
            login: (user) => {
                dispatch(authSlice.actions.login(user))
            }
        }
    },
    mapLogoutDispatchToProps: (dispatch) => {
        return {
            logout: () => {
                dispatch(authSlice.actions.logout(null))
            }
        }
    },
    mapToastDispatchToProps: (dispatch) => {
        return {
            toast: (toast) => {
                dispatch(toastSlice.actions.toast(toast))
            },
            hide: () => {
                dispatch(toastSlice.actions.hide(null))
            }
        }
    }
}

export default Map
