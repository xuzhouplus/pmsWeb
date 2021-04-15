import Navibar from "@/pages/profile/Navibar";
import React from "react";
import ConnectComponent from "@components/profile/Connect";
import TreeNavibar from "@components/navbar/TreeNavibar";
import "./Index.scss";

class Connect extends React.PureComponent {
	render() {
		return (
			<TreeNavibar>
				<Navibar active="connect"></Navibar>
				<ConnectComponent></ConnectComponent>
			</TreeNavibar>
		);
	}
}

export default Connect;