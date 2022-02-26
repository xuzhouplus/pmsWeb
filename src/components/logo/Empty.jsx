import React from 'react';
class Empty extends React.Component{
    render() {
        return (
            <div className="home-content h-100 d-flex justify-content-center align-items-center"><img src={process.env.PUBLIC_URL + '/logo192.png'} alt='Logo'/></div>
        )
    }
}
export default Empty;