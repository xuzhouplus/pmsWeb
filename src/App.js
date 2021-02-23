import React from 'react'
import './App.scss'
import {Container} from 'react-bootstrap'
import Loading from './pages/mask/Loading';
import {initAction} from "./redux/Actions";
import {connect} from "react-redux";
import Utils from "./utils/Utils";
import Message from "./pages/mask/Message"
import Main from "./pages/Main";
import Visualizer from "./components/about/Visualizer";

function mapStateToProps(state) {
	return {
		site: state.site
	};
}

function mapDispatchToProps(dispatch) {
	return {
		init: (site) => {
			dispatch({
				type: initAction.type,
				payload: site
			})
		},
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timeout: null,
			audioVisualizer: null,
			error: ''
		}
	}

	componentDidMount() {
		Utils.site((response) => {
			if (response.code === 1) {
				this.props.init(response.data);
			}
		}, (error) => {
			let that = this;
			let timeout = setTimeout(function () {
				that.changeToAudioVisualizer();
			}, 5000)
			this.setState({
				timeout: timeout,
				error: error
			})
		});
	}

	componentWillUnmount() {
		if(this.state.audioVisualizer) {
			this.changeToAudioVisualizer();
		}
	}

	changeToAudioVisualizer = () => {
		this.setState({
			audioVisualizer: this.state.audioVisualizer ? false : true
		})
	}

	render() {
		if (this.state.audioVisualizer) {
			return (
				<Visualizer></Visualizer>
			);
		}
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
