import React from "react";
import {Pagination} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import "./Paginator.scss";

class Paginator extends React.Component {
	onClick = (page, event) => {
		event.stopPropagation();
		event.preventDefault();
		this.props.onClick(page);
	}

	render() {
		let reg = '/:page?';
		let path = this.props.match.path.slice(0, reg.length * -1)
		let loopPage = 0;
		let paginator = [];
		if (this.props.count > 0) {
			if (this.props.page > 1) {
				paginator.push(<Pagination.First key="first" href={path + '/1'} onClick={this.onClick.bind(this, 1)}/>);
				paginator.push(<Pagination.Prev key="prev" href={path + '/' + (this.props.page - 1)} onClick={this.onClick.bind(this, this.props.page - 1)}/>);
			}
			let ellipsis = false;
			while (loopPage < this.props.count) {
				loopPage++;
				if (loopPage < 3 || (this.props.count - loopPage) < 3) {
					if (this.props.page === loopPage) {
						paginator.push(<Pagination.Item active key={'paginator-' + loopPage}>{loopPage}</Pagination.Item>)
					} else {
						paginator.push(<Pagination.Item key={'paginator-' + loopPage} href={path + '/' + loopPage} onClick={this.onClick.bind(this, loopPage)}>{loopPage}</Pagination.Item>)
					}
				} else {
					if (!ellipsis) {
						paginator.push(<Pagination.Ellipsis/>)
						ellipsis = true;
					}
				}
			}
			if (this.props.page < this.props.count) {
				paginator.push(<Pagination.Next key="next" href={path + '/' + (this.props.page + 1)} onClick={this.onClick.bind(this, this.props.page + 1)}/>);
				paginator.push(<Pagination.Last key="last" href={path + '/' + this.props.count} onClick={this.onClick.bind(this, this.props.count)}/>);
			}
		} else {
			paginator.push(<Pagination.Item active key={'paginator-1'}>1</Pagination.Item>)
		}
		return (
			<Pagination className="paginator-container">
				{paginator}
			</Pagination>
		);
	}
}

export default withRouter(Paginator);