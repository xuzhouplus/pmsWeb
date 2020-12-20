import React, {Component, lazy, Suspense} from 'react';
import Loading from "../loading/Loading";

class Introduction extends Component {
	constructor(props) {
		super(props);
		this.state = {
			components: []
		};
	}

	componentDidMount() {
		const that=this;
		setTimeout(function () {
			const PHP = lazy(() => import('./PHP'));
			that.pushLoadedComponent(PHP);
		},200);
		setTimeout(function () {

		},200);
	}

	pushLoadedComponent(component) {
		let loadedComponents = this.state.components;
		loadedComponents.push(component);
		this.setState({
			components: loadedComponents
		});
	}

	componentWillUnmount() {
		this.setState({
			components: []
		});
	}

	render() {
		let itemList = '';
		if (this.state.components.length > 0) {
			itemList = this.state.components.map((Item, key) => {
				return <Item key={key}/>;
			})
		}
		return (
			<div className="container-fluid pt-2 pb-2">
				{itemList}
			</div>
		);
	}
}

export default Introduction;