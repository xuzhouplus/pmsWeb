import React from 'react'
import './App.scss'
import {Container} from 'react-bootstrap'
import Loading from './pages/mask/Loading';
import {init} from "./redux/Actions";
import {connect} from "react-redux";
import Utils from "./utils/Utils";
import Message from "./pages/mask/Message"
import Main from "./pages/Main";

function mapStateToProps(state) {
	return {
		site: state.site
	};
}

function mapDispatchToProps(dispatch) {
	return {
		init: (site) => {
			dispatch({
				type: init.type,
				payload: site
			})
		},
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: ''
		}
	}

	componentDidMount() {
		const that = this;
		Utils.site(function (response) {
			console.log(response);
			if (response.code === 1) {
				that.props.init(response.data);
			}
		}, function (error) {
			that.setState({
				error: error
			})
		});
	}

	render() {
		if (this.state.error) {
			return (
				<Container fluid className="app-container full_screen direct-center">
					<Message message={this.state.error}></Message>
				</Container>
			);
		}
		if (Utils.objectIsEmpty(this.props.site)) {
			return (
				<Container fluid className="app-container full_screen direct-center">
					<Loading></Loading>
				</Container>
			);
		}

		return (
			<Main></Main>
		)
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
