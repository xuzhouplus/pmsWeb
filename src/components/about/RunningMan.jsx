import React from "react";
import "./RunningMan.scss";

class RunningMan extends React.Component {
	render() {
		return (
			<div className="running-man">
				<div className="running">
					<div className="outer">
						<div className="body">
							<div className="arm behind"></div>
							<div className="arm front"></div>
							<div className="leg behind"></div>
							<div className="leg front"></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default RunningMan;