import React from "react";
import {connect} from "react-redux";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class AutoRefresh extends React.Component {
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		console.log(nextProps);
		console.log(this.props);
		return nextProps.account.uuid !== this.props.uuid;
	}

	render() {
		return this.props.children
	}
}

export default connect(mapStateToProps, null)(AutoRefresh);