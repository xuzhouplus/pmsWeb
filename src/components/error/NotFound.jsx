import React from 'react'

class NotFound extends React.Component {
	render () {
		return (
			<div className="full_container">
				<div className="absolute-center">
					<img src={process.env.PUBLIC_URL + '/logo192.png'} alt="Logo"/>
					<div className="text-center">404 Page Not Found</div>
				</div>
			</div>
		)
	}
}

export default NotFound