import React, { Component } from "react";
import store from "store";

export default class SimpleStorage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didHydrate: false,
			firedHydrateCallback: false
    };
    this.testStorage = _testStorage.bind(this);
  }

	static getDerivedStateFromProps(props, state) {
		// callback function that fires after the parent's state has been hydrated with storage items
		if('onParentStateHydrated' in props && state.didHydrate && !state.firedHydrateCallback){
			props.onParentStateHydrated();
      return {
        ...state, ...{firedHydrateCallback: true}
      }
    }
    return state;
  }

  componentDidMount() {
    if (this.testStorage() === true) {
      this.hydrateStateWithStorage();
      window.addEventListener(
        "beforeunload",
        this.saveStateToStorage.bind(this)
      );

    }
  }

  componentWillUnmount() {
    if (this.testStorage() === true) {
      this.saveStateToStorage();
      window.removeEventListener(
        "beforeunload",
        this.saveStateToStorage.bind(this)
      );
    }
  }

  testStorage() {
    const test = "test";
    try {
      store.set(test, test);
      store.remove(test);
      return true;
    } catch (e) {
      console.error("react-simple-storage could not access web storage.");
      return false;
    }
  }

  hydrateStateWithStorage() {
    let prefix = "";
    let parent = {};

    if (this.props.parent) {
      parent = this.props.parent;
      prefix = this.props.prefix ? this.props.prefix : "";
    } else {
      console.error(`No "parent" prop was provided to react-simple-storage. A parent component's context is required in order to access and update the parent component's state.
			\nTry the following: <SimpleStorage parent={this} />`);
      return false;
    }

    // loop through storage
    store.each((value, key) => {
      // if the storage item is in the current parent's state
      if (key.includes(prefix)) {
        // remove the parent-specific prefix to get original key from parent's state
        let name = key.slice(prefix.length + 1);

        // attempt to parse the stringified web storage value
        // and update parent's state with the result
        // store.js handles parsing, but can't (shouldn't...) hurt to "try"
        let parsedValue;
        if (name in parent.state) {
          try {
            parsedValue = JSON.parse(value);
            parent.setState({ [name]: parsedValue });
          } catch (e) {
            parent.setState({ [name]: value });
          }
        }
      }
    });

    this.setState({didHydrate: true})
  }

  saveStateToStorage(allowNewKey = true) {
    let prefix = "";
    let parent = {};
    let blacklist = [];

    if (this.props.parent) {
      prefix = this.props.prefix ? this.props.prefix : "";
      parent = this.props.parent;
      blacklist = this.props.blacklist || [];
    } else {
      console.error(`No "parent" prop was provided to react-simple-storage. A parent component's context is required in order to access and update the parent component's state.
      \nTry the following: <SimpleStorage parent={this} />`);
      return false;
    }

    // loop through all of the parent's state
    for (let key in parent.state) {
      // save item to storage if not on the blacklist
      let prefixWithKey = `${prefix}_${key}`;
      if (blacklist.indexOf(key) < 0 && allowNewKey) {
        store.set(prefixWithKey, parent.state[key]);
      }
    }
  }

  render() {
    return null;
  }
}

function _testStorage() {
  const test = "test";
  try {
    store.set(test, test);
    store.remove(test);
    return true;
  } catch (e) {
    console.error("react-simple-storage could not access any storage options.");
    return false;
  }
}

export function clearStorage(prefix) {
  if (_testStorage() === true) {
    store.each((value, key) => {
      if (key.includes(prefix)) {
        store.remove(key);
      }
    });
  }
}

export function resetParentState(parent, initialState = {}, keysToIgnore = []) {
  if (_testStorage() === true) {
    for (let key in initialState) {
      // reset property if not in keys to ignore
      if (keysToIgnore.indexOf(key) < 0) {
        parent.setState({ [key]: initialState[key] });
      }
    }
  }
}
