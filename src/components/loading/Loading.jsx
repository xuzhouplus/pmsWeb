import React from 'react'
import './Loading.scss'

class Loading extends React.PureComponent {
    render() {
        return (
            <div className="loading-component">
                <img src={process.env.PUBLIC_URL + '/logo.gif'} alt="Loading"/>
                <div>{this.props.children}</div>
            </div>
        )
    }
}

export default Loading