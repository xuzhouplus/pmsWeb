import React from 'react';
import {loginAction, logoutAction, programAction} from "@/redux/Actions";
import {connect} from "react-redux";
import Utils from "@utils/Utils";
import AdminNavibar from "@components/navbar/AdminNavibar";
import BaseNavibar from "@components/navbar/BaseNavibar";
import './Navibar.scss'
import MaintainNavbar from "@components/navbar/MaintainNavbar";

function mapStateToProps(state) {
	return {
		program: state.program,
		account: state.auth,
		site: state.site
	};
}

function mapDispatchToProps(dispatch) {
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
}

class Navibar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			account: {
				label: '账号',
				placeholder: '请输入账号',
				text: '请输入账号',
				isValid: false,
				isInvalid: false,
				value: ''
			},
			password: {
				label: '密码',
				placeholder: '请输入密码',
				text: '请输入密码',
				isValid: false,
				isInvalid: false,
				value: ''
			},
		}
	}

	componentDidMount() {
		Utils.auth(response => {
			this.login(response.data);
		}, error => {
			console.log(error);
		});
	}

	login = (loginUser) => {
		this.handleModal();
		this.props.login(loginUser)
	}
	logout = () => {
		const that = this;
		Utils.logout(function (response) {
			that.props.logout()
		}, function (error) {
			console.log(error);
		})
	}
	handleModal = () => {
		this.props.state({
			showLogin: !this.props.program.showLogin
		})
	}

	render() {
		const reg = /\/profile\/authorize\/[a-z]+/g;
		const isAuthorize = reg.test(document.location.pathname)
		if (isAuthorize) {
			return (<MaintainNavbar logo={this.props.site.logo} title={this.props.site.title}></MaintainNavbar>)
		}
		if (this.props.account && this.props.account.uuid) {
			return (<AdminNavibar logo={this.props.site.logo} title={this.props.site.title} account={this.props.account.account} logout={this.logout}/>)
		}
		return (<BaseNavibar showLogin={this.props.program.showLogin} handleModal={this.handleModal} afterLogin={this.login} account={this.state.account} password={this.state.password} logo={this.props.site.logo} title={this.props.site.title}/>);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Navibar);