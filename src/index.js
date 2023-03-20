import React from 'react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {store} from "@redux/Store";
import {Provider} from "react-redux";
import {createRoot} from "react-dom/client";
import './index.css';

let container = document.getElementById('root')
let root = createRoot(container)
root.render(<Provider store={store}>
	<App/>
</Provider>)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
