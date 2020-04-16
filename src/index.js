import { Component } from "react";
import PropTypes from "prop-types";
import store from "store";

/**
 * Checks if parent is a React Component
 * @param {Object} parent
 * @returns {boolean}
 */
const checkStatefulParent = (parent) => parent instanceof Component;

/**
 * @typedef {Array} HookDeclaration
 * @property {*} HookDeclaration[0] hook value
 * @property {function} HookDeclaration[1] hook value setter
 * @example [myValue, setMyValue]
 */

/**
 * A mapping of keys that will be stored in local storage to their
 * corresponding HookDeclaration {@link HookDeclaration}
 * @typedef {Object.<string, HookDeclaration>} HooksParent
 * @example { myValue: [myValue, setMyValue], ... }
 */

export default class SimpleStorage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didHydrate: false,
      firedHydrateCallback: false,
    };
    this.testStorage = _testStorage.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    // callback function that fires after the parent's state has been
    // hydrated with storage items
    if (
      "onParentStateHydrated" in props &&
      state.didHydrate &&
      !state.firedHydrateCallback
    ) {
      props.onParentStateHydrated();
      return {
        ...state,
        ...{ firedHydrateCallback: true },
      };
    }
    return state;
  }

  componentDidMount() {
    if (this.testStorage() === true) {
      this.hydrateStateWithStorage();
      window.addEventListener("pagehide", this.saveStateToStorage.bind(this));
    }
  }

  componentWillUnmount() {
    if (this.testStorage() === true) {
      this.saveStateToStorage();
      window.removeEventListener(
        "pagehide",
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

    const isStatefulParent = checkStatefulParent(parent);
    const parentObj = isStatefulParent ? parent.state : parent;

    // loop through storage
    store.each((value, key) => {
      // if the storage item is in the current parent's state
      if (key.includes(prefix)) {
        // remove the parent-specific prefix to get original key from parent's state
        const name = key.slice(prefix.length + 1);

        // update parent's state with the result
        // store.js handles parsing
        if (isStatefulParent && name in parentObj) {
          parent.setState({ [name]: value });
        } else if (!isStatefulParent && name in parentObj) {
          // handle hooks hydration
          const [, setValue] = parent[name];
          setValue(value);
        }
      }
    });

    this.setState({ didHydrate: true });
  }

  saveStateToStorage(allowNewKey = true) {
    if (store.get("rss_cleared")) {
      store.set("rss_cleared", false);
      return;
    }

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

    const isStatefulParent = checkStatefulParent(parent);
    const parentObj = isStatefulParent ? parent.state : parent;

    Object.entries(parentObj).forEach(([key, item]) => {
      // if hook value is being set, it's the first array index
      const value = isStatefulParent ? item : item[0];
      if (blacklist.indexOf(key) < 0 && allowNewKey) {
        store.set(`${prefix}_${key}`, value);
      }
    });
  }

  render() {
    return null;
  }
}

SimpleStorage.propTypes = {
  /**
   * Stateful Component: simply pass in `this`.
   * Hooks: construct a {@link HooksParent}
   */
  parent: PropTypes.object.isRequired,
  // TODO: add more proptypes
};

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

    store.set("rss_cleared", true);
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
