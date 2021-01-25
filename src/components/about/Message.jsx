import React from 'react';
import Introduction from "./Introduction";

class Message extends React.Component {

	render() {
		let windowWidth = document.getElementById('root').clientWidth;
		return (
			<div id="message-container" className="align-items-center justify-content-md-center note-info" style={{width: windowWidth}}>
				<div id="start-text" className="message-section start-text" style={{width: windowWidth}}>
					<h3>
						<p>&emsp;&emsp;不管怎么说，在里面这几个钟头啊，决定了两人一生的命运，人这一辈子啊有一些情境啊有一些经历啊，真的不知道怎么一些很奇怪的对话就会决定你一生的命运。</p>
						<p className="text-right"><a className="text-dark" target="_blank"
													 href="https://www.bilibili.com/video/BV1cE411d7GG" rel="noreferrer noopener">《刘汉臣之死》&nbsp;阎景俞</a>
						</p>
					</h3>
				</div>
				<div id="middle-school" className="message-section middle-school" style={{width: windowWidth}}>
					安岳中学
				</div>
				<div id="college-school" className="message-section college-school" style={{width: windowWidth}}>
					电子科技大学成都学院
				</div>
				<div id="sobey-company" className="message-section sobey-company" style={{width: windowWidth}}>
					索贝
				</div>
				<div id="cmc-company" className="message-section cmc-company" style={{width: windowWidth}}>
					华栖云
				</div>
				<div id="personal-introduction" className="message-section personal-introduction" style={{width: windowWidth}}>
					<Introduction/>
				</div>
			</div>
		);
	}
}

export default Message;