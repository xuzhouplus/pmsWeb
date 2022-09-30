import React from 'react';

class Message extends React.Component {

	render() {
		return (
			<div className="message-container">
				<div className="message-box">
					<img src={process.env.PUBLIC_URL + '/logo.svg'} alt="logo"></img>
				</div>
			</div>
		);
	}
}

export default Message;
