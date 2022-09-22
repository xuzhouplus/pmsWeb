import React from 'react'
import {Container} from 'react-bootstrap'
import Loading from './pages/mask/Loading';
import {connect} from "react-redux";
import Utils from "./utils/Utils";
import Main from "./pages/Main";
import Maintain from "@pages/Maintain";
import {siteSlice} from "@redux/slices/SiteSlice";
import './App.scss'

function mapStateToProps(state) {
	return {
		site: state.site,
	};
}

function mapDispatchToProps(dispatch) {
	return {
		init: (site) => {
			dispatch(siteSlice.actions.init(site))
		},
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			maintain: false,
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
			this.maintain()
		});
	}

	maintain = () => {
		this.setState({
			maintain: true
		})
	}

	render() {
		if (this.state.maintain) {
			return (
				<Maintain></Maintain>
			);
		}
		if (Utils.objectIsEmpty(this.props.site)) {
			return (
				<Container fluid className="app-container full-screen direct-center">
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
