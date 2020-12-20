import React from 'react'
import './Loading.scss'

class Loading extends React.Component {
    render() {
        return (
            <div className="loading-component">
                <img src={process.env.PUBLIC_URL + '/logo.gif'} alt=""/>
            </div>
        )
    }
}

export default Loading