import React, { Component } from 'react';

export default class SimpleStorage extends Component {
	constructor(props) {
		super(props);
		//this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this)
	}

	componentWillMount() {
		this.hydrateStateWithLocalStorage();
		//this.saveStateToLocalStorage(true);
		window.addEventListener('beforeunload', this.saveStateToLocalStorage.bind(this));
	}

	componentDidMount() {
		this.hydrateStateWithLocalStorage();
		//this.saveStateToLocalStorage(true);
		window.addEventListener('beforeunload', this.saveStateToLocalStorage.bind(this));
	}

	componentWillUnmount() {
		this.saveStateToLocalStorage();
		window.removeEventListener('beforeunload', this.saveStateToLocalStorage.bind(this));
	}

	hydrateStateWithLocalStorage() {
		let prefix = '';
		let parent = this;

		if(this.props){
			prefix = this.props.prefix;
			parent = this.props.parent;
		}

		// loop through localStorage
		for (let key in localStorage) {
			// if the localStorage item is in the current parent's state and isn't a localStorage method
			if (key.includes(prefix) && typeof localStorage[key] !== 'function' && key !== 'length' ) {
				// get the property value from localStorage
				let value = localStorage.getItem(key);

				// remove the parent-specific prefix to get original key from parent's state
				let name = key.slice(prefix.length + 1);

				// attempt to parse the stringified localStorage value
				// and update parent's state with the result
				try {
					value = JSON.parse(value);
					parent.setState({ [name]: value });
				} catch (e) {
					parent.setState({ [name]: value });
				}
			}
		}
	}

	saveStateToLocalStorage(allowNewKey=true) {
		let prefix = '';
		let parent = {};
		let blacklist = [];

		if(this.props) {
			prefix = this.props.prefix || "";
			parent = this.props.parent;
			blacklist = this.props.blacklist || [];
		}

		// loop through all of the parent's state
		for (let key in parent.state) {
			// save item to localStorage if not on the blacklist
			let prefixWithKey = `${prefix}_${key}`;
			if (blacklist.indexOf(key) < 0 && (prefixWithKey in localStorage || allowNewKey)) {
				localStorage.setItem(`${prefix}_${key}`, JSON.stringify(parent.state[key]));
			}
		}
	}

	render() {
		return null;
	}
}

export function clearStorage(prefix) {
	for (let key in localStorage) {
		if (key.includes(prefix)) {
			localStorage.removeItem(key);
		}
	}
}

export function resetParentState(parent, initialState = {}, keysToIgnore = []) {
	for (let key in initialState) {
		// reset property if not on the blacklist
		if (keysToIgnore.indexOf(key) < 0) {
			parent.setState({ [key]: initialState[key] });
		}
	}
}
