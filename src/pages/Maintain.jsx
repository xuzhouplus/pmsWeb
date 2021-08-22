import React from "react";
import Visualizer from "@components/about/Visualizer";
import Helmet from "react-helmet";
import configs from "@/configs";
import {Col, Container, Row} from "react-bootstrap";
import MaintainNavbar from "@components/navbar/MaintainNavbar";
import MaintainFooter from "@components/footer/MaintainFooter";

class Maintain extends React.Component {
	render() {
		return (
			<Container fluid className="app-container full-screen">
				<Helmet title={configs.defaultTitle} link={[{rel: "shortcut icon", href: configs.defaultFavicon}]}></Helmet>
				<Row className={["app-header", "fixed-top"]}>
					<Col>
						<MaintainNavbar/>
					</Col>
				</Row>
				<Row className="app-body">
					<Col>
						<Visualizer></Visualizer>
					</Col>
				</Row>
				<Row className={["app-footer", "fixed-bottom"]}>
					<Col>
						<MaintainFooter site={{icp: configs.defaultICP}}/>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Maintain