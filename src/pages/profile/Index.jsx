import React from "react";
import TreeNavibar from "@components/navbar/TreeNavibar";
import Admin from "@components/profile/Admin";
import Navibar from "@/pages/profile/Navibar";
import "./Index.scss";

class Index extends React.Component {
	render() {
		return (
			<TreeNavibar>
				<Navibar active="index"/>
				<Admin/>
			</TreeNavibar>
		);
	}

}

export default Index;