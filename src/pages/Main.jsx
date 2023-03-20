import React from "react";
import {Outlet} from "react-router-dom";
import {connect} from "react-redux";
import Helmet from "react-helmet";
import configs from "@/configs";
import {Col, Container, Row} from "react-bootstrap";
import Navibar from "@components/navbar/Navibar";
import Footer from "@components/footer/Footer";
import Alert from "@pages/mask/Alert";

function mapStateToProps(state) {
	return {
		site: state.site
	};
}

class Main extends React.Component {

	render() {

		return (
			<Container fluid className="app-container">
				<Alert></Alert>
				<Helmet title={this.props.site.title} link={[{rel: "shortcut icon", href: this.props.site.icon ? this.props.site.icon : configs.defaultFavicon}]}></Helmet>
				<Row className="app-header fixed-top">
					<Col xs={12} lg={12}>
						<Navibar/>
					</Col>
				</Row>
				<Row className="app-body">
					<Col xs={12} lg={12}>
						<Outlet/>
					</Col>
				</Row>
				<Row className="app-footer fixed-bottom">
					<Col xs={12} lg={12}>
						<Footer site={this.props.site}/>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default connect(mapStateToProps, null)(Main);
