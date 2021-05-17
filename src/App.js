import React from 'react'
import {Container} from 'react-bootstrap'
import Loading from './pages/mask/Loading';
import {initAction} from "./redux/Actions";
import {connect} from "react-redux";
import Utils from "./utils/Utils";
import Main from "./pages/Main";
import Visualizer from "./components/about/Visualizer";
import Swal from "sweetalert2";
import './App.scss'

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
			console.log(error);
			this.setState({
				error: "can't connect to server."
			})
		});
	}

	componentWillUnmount() {
		if (this.state.audioVisualizer) {
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
			Swal.fire('服务端不可用，请稍后重试。').then(() => {
				this.changeToAudioVisualizer()
			})
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
