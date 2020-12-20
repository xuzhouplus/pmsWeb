import React from "react";

class View extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: {}
        }
    }

    componentDidMount() {
        console.log(this.props.match.params.uuid);
    }

    render() {
        return (
            <div>
                Post View
            </div>
        );
    }
}

export default View;