import React
	from 'react'

class Loading extends React.Component {
	render () {
		return (
			<div className="loading-component">
				<img src={process.env.PUBLIC_URL + '/logo192.png'} alt=""/>
			</div>
		)
	}
}

export default Loading