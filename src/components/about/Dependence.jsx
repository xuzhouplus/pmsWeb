import React from 'react';
import "./Dependence.scss";

class Dependence extends React.Component {
	render() {
		return (
			<div className="container-fluid border-top pt-2 pb-2 based-on">
				<div className="row justify-content-center">
					<div className="col col-auto">
						<a className="text-dark" href="https://reactjs.org/" target="_blank">
							<img className="brand-logo react" src={process.env.PUBLIC_URL + '/images/About/react.svg'}></img>React
						</a>
					</div>
					<div className="col col-auto">
						<a className="text-dark" href="http://getbootstrap.com" target="_blank">
							<img className="brand-logo bootstrap" src={process.env.PUBLIC_URL + '/images/About/bootstrap.svg'}></img>Bootstrap
						</a>
					</div>
					<div className="col col-auto">
						<a className="text-dark" href="https://react-bootstrap.github.io/" target="_blank">
							<img className="brand-logo react-bootstrap" src={process.env.PUBLIC_URL + '/images/About/react-bootstrap.svg'}></img>react-bootstrap
						</a>
					</div>
					<div className="col col-auto">
						<a className="text-dark" href="http://www.jq22.com/jquery-info19046" target="_blank">
							<img className="brand-logo jq22" src={process.env.PUBLIC_URL + '/images/About/jq22.jfif'}></img>WebGL失真滑块
						</a>
					</div>
					<div className="col col-auto">
						<a className="text-dark" href="https://gitee.com/mirrors/react-markdown-editor-lite" target="_blank">
							<img className="brand-logo github" src={process.env.PUBLIC_URL + '/images/About/github.svg'}></img>react-markdown-editor-lite
						</a>
					</div>
					<div className="col col-auto">
						<a className="text-dark" href="https://github.com/ankeetmaini/react-infinite-scroll-component" target="_blank">
							<img className="brand-logo github" src={process.env.PUBLIC_URL + '/images/About/github.svg'}></img>react-infinite-scroll-component
						</a>
					</div>
				</div>
				<div className="row justify-content-center">
					<div className="col col-auto">
						<a className="text-dark" href="http://nginx.org/" target="_blank">
							<img className="brand-logo nginx" src={process.env.PUBLIC_URL + '/images/About/nginx.png'}></img>Nginx
						</a>
					</div>
					<div className="col col-auto">
						<a className="text-dark" href="https://www.php.net/" target="_blank">
							<img className="brand-logo php" src={process.env.PUBLIC_URL + '/images/About/php.svg'}></img>PHP
						</a>
					</div>
					<div className="col col-auto">
						<a className="text-dark" href="https://www.mysql.com/" target="_blank">
							<img className="brand-logo mysql" src={process.env.PUBLIC_URL + '/images/About/mysql.svg'}></img>MySQL
						</a>
					</div>
					<div className="col col-auto">
						<a className="text-dark" href="https://www.yiiframework.com/" target="_blank">
							<img className="brand-logo yii" src={process.env.PUBLIC_URL + '/images/About/yii.svg'}></img>Yii2
						</a>
					</div>
				</div>
			</div>
		);
	}
}

export default Dependence;