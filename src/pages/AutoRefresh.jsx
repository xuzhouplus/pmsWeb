import React from "react";
import {connect} from "react-redux";

function mapStateToProps(state) {
	return {
		account: state.auth
	};
}

class AutoRefresh extends React.Component {
	shouldComponentUpdate(nextProps, nextState, nextContext) {
		return true;
	}

	render() {
		return this.props.children
	}
}

export default connect(mapStateToProps, null)(AutoRefresh);