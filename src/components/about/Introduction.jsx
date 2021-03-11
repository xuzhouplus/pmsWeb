import React, {Component} from 'react';
import {Col, Container, Image, Row} from "react-bootstrap";
import "./Introduction.scss";


class Introduction extends Component {
	render() {
		return (
			<Container className="introduction-container">
				<Row>
					<Col className="col-5 introduction-photo">
						<Image src={process.env.PUBLIC_URL + '/images/About/default.jpeg'}></Image>
					</Col>
					<Col className="col-7 introduction-profile">
						<div className="profile-container">
							<div className="profile-name"><h3>徐州</h3></div>
							<div>PHP开发工程师</div>
							<div>Linux、Docker、Vagrant</div>
							<div>Git、Rancher、Jenkins</div>
							<div>Nginx</div>
							<div>PHP、Swoole</div>
							<div>Yii2、Laravel、CakePHP</div>
							<div>Hprose、JWT</div>
							<div>MySQL、Redis、MongoDB、Kafka</div>
							<div>jQuery、React、Vue</div>
							<div>Java、Spring Boot</div>
							<div>Go、GoFrame、Iris</div>
							<div>电子科技大学成都学院</div>
							<div>成都华栖云科技有限公司</div>
							<div><a href="mailto:xuzhouplus@gmail.com" target="_blank" rel="noreferrer noopener">xuzhouplus@gmail.com</a></div>
							<div><a href="https://github.com/xuzhouplus" target="_blank" rel="noreferrer noopener">https://github.com/xuzhouplus</a></div>
							<a href="https://www.zhipin.com/web/geek/resumetpl" target="_blank" rel="noreferrer noopener">详细简历</a>
						</div>
					</Col>
				</Row>
			</Container>
		);
	}
}

export default Introduction;