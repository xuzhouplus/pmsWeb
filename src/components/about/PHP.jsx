import React from 'react';

class PHP extends React.Component {
	render() {
		return (
			<div className="container-fluid pt-2 pb-2">
				<div className="row justify-content-center">
					<div className="col col-auto">
						&lt;?php echo 'Hello World!'; ?&gt;
					</div>
				</div>
			</div>
		);
	}
}

export default PHP;