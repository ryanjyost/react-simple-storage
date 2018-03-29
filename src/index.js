import React, { Component } from 'react';

export default class SimpleStorage extends Component {
	constructor(props) {
		super(props);
		//this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this)
	}

	testForLocalStorage(){
		const test = 'test';
		try {
			localStorage.setItem(test, test);
			localStorage.removeItem(test);
			return true;
		} catch(e) {
			console.error('react-simple-storage could not access localStorage.')
			return false
		}
	}

	componentDidMount() {
		if(this.testForLocalStorage() === true) {
			this.hydrateStateWithLocalStorage();
			window.addEventListener('beforeunload', this.saveStateToLocalStorage.bind(this));
		}
	}

	componentWillUnmount() {
		if(this.testForLocalStorage() === true) {
			this.saveStateToLocalStorage();
			window.removeEventListener('beforeunload', this.saveStateToLocalStorage.bind(this));
		}
	}

	hydrateStateWithLocalStorage() {
		let prefix = '';
		let parent = {};

		if(this.props.parent){
			parent = this.props.parent;
			prefix = this.props.prefix ? this.props.prefix : "";
		} else {
			console.error(`No "parent" prop was provided to react-simple-storage. A parent component's context is required in order to access and update the parent component's state.
			\nTry the following: <SimpleStorage parent={this} />`)
			return false
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
				if(name in parent.state){
					try {
						value = JSON.parse(value);
						parent.setState({ [name]: value });
					} catch (e) {
						parent.setState({ [name]: value });
					}
				}

			}
		}
	}

	saveStateToLocalStorage(allowNewKey=true) {
		let prefix = '';
		let parent = {};
		let blacklist = [];

		if(this.props.parent) {
			prefix = this.props.prefix ? this.props.prefix : "";
			parent = this.props.parent;
			blacklist = this.props.blacklist || [];
		} else {
			// console.error(`No "parent" prop was provided to react-simple-storage. A parent component's context is required in order to access and update the parent component's state.
			// \nTry the following: <SimpleStorage parent={this} />`)
			return false
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
	if(this.testForLocalStorage() === true) {
		for (let key in localStorage) {
			if (key.includes(prefix)) {
				localStorage.removeItem(key);
			}
		}
	}
}

export function resetParentState(parent, initialState = {}, keysToIgnore = []) {
	if(this.testForLocalStorage() === true) {
		for (let key in initialState) {
			// reset property if not on the blacklist
			if (keysToIgnore.indexOf(key) < 0) {
				parent.setState({[key]: initialState[key]});
			}
		}
	}
}
