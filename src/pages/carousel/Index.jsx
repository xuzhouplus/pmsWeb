import React from "react";
import {Button, Card, Col} from "react-bootstrap";
import Loading from "../../components/loading/Loading";
import TreeNavibar from "../../components/navbar/TreeNavibar";
import Utils from "../../utils/Utils";
import {connect} from "react-redux";

function mapStateToProps(state) {
	return {
		site: state.site
	};
}

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			idLoading: false,
			page: 0,
			limit: 20,
			count: 0,
			like: null,
			enable: null,
			carousels: [],
			cancelTokenSource: null
		};
	}

	componentDidMount() {
		this.getCarouselList();
	}

	getCarouselList = () => {
		const that = this;
		if (this.state.isLoading) {
			return;
		}
		this.setState({
			idLoading: true
		})
		const cancelTokenSource = Utils.getCarouselList({
			page: this.state.page,
			limit: this.state.limit,
			count: this.state.count,
			like: this.state.like,
			enable: this.state.enable
		}, function (response) {
			if (that.state.cancelTokenSource) {
				that.setState({
					carousels: that.state.carousels.concat(response.data.carousels),
					page: response.data.page + 1,
					limit: response.data.size,
					count: response.data.count,
					total: response.data.total,
					cancelTokenSource: null,
					isLoading: false
				})
			}
		}, function (error) {

		})
		that.setState({
			cancelTokenSource: cancelTokenSource
		})
	}

	componentWillUnmount() {
		if (this.state.cancelTokenSource) {
			this.state.cancelTokenSource.cancel('Operation canceled by the user.');
		}
	}

	render() {
		console.log(this.props.site);
		return (
			<TreeNavibar active="carousel">
				<Card className="file-list-container">
					<Card.Header>

					</Card.Header>
					<Card.Body className="file-table">

					</Card.Body>
				</Card>
			</TreeNavibar>
		);
	}

}

export default connect(mapStateToProps, null)(Index);