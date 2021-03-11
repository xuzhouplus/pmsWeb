import React from 'react';

class Message extends React.Component {

	render() {
		return (
			<div className="align-items-center justify-content-md-center message-container d-flex">
				<h3 className="message-box">
					<p>&emsp;&emsp;不管怎么说，在里面这几个钟头啊，决定了两人一生的命运，人这一辈子啊有一些情境啊有一些经历啊，真的不知道怎么一些很奇怪的对话就会决定你一生的命运。</p>
					<p className="text-right">
						<a className="text-dark" target="_blank" href="https://www.bilibili.com/video/BV1cE411d7GG" rel="noreferrer noopener">——《刘汉臣之死》&nbsp;阎景俞</a>
					</p>
				</h3>
			</div>
		);
	}
}

export default Message;