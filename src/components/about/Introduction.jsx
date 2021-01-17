import React, {Component} from 'react';
import {Col, Container, Image, Row} from "react-bootstrap";

class Introduction extends Component {
	render() {
		return (
			<Container className="introduction-container">
				<Row>
					<Col className="col-5 introduction-photo">
						<Image src={process.env.PUBLIC_URL + '/images/About/default.jpeg'}></Image>
					</Col>
					<Col className="col-7 introduction-profile">
						<div><h3 className="name">徐州</h3>
							<div className="english-name">Bill</div>
						</div>
						<div><a href="mailto:xuzhouplus@gmail.com" target="_blank">xuzhouplus@gmail.com</a></div>
						<div><a href="https://github.com/xuzhouplus" target="_blank">https://github.com/xuzhouplus</a></div>
						<div>电子科技大学成都学院</div>
						<div>成都华栖云科技有限公司</div>
						<div>Linux、Docker、Vagrant</div>
						<div>Git、Rancher、Jenkins</div>
						<div>Nginx</div>
						<div>PHP、Swoole、Workerman</div>
						<div>Yii2、Laravel、CakePHP、ThinkPHP</div>
						<div>Hprose、JWT</div>
						<div>MySQL、Redis、MongoDB、Kafka</div>
						<div>Jquery、React、Vue</div>
						<div>Java、Spring Boot</div>
						<div>Go、Iris</div>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Introduction;