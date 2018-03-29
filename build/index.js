module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.clearStorage = clearStorage;
exports.resetParentState = resetParentState;

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SimpleStorage = function (_Component) {
	_inherits(SimpleStorage, _Component);

	function SimpleStorage(props) {
		_classCallCheck(this, SimpleStorage);

		return _possibleConstructorReturn(this, (SimpleStorage.__proto__ || Object.getPrototypeOf(SimpleStorage)).call(this, props));
		//this.saveStateToLocalStorage = this.saveStateToLocalStorage.bind(this)
	}

	_createClass(SimpleStorage, [{
		key: 'testForLocalStorage',
		value: function testForLocalStorage() {
			var test = 'test';
			try {
				localStorage.setItem(test, test);
				localStorage.removeItem(test);
				return true;
			} catch (e) {
				console.error('react-simple-storage could not access localStorage.');
				return false;
			}
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			if (this.testForLocalStorage() === true) {
				this.hydrateStateWithLocalStorage();
				window.addEventListener('beforeunload', this.saveStateToLocalStorage.bind(this));
			}
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (this.testForLocalStorage() === true) {
				this.saveStateToLocalStorage();
				window.removeEventListener('beforeunload', this.saveStateToLocalStorage.bind(this));
			}
		}
	}, {
		key: 'hydrateStateWithLocalStorage',
		value: function hydrateStateWithLocalStorage() {
			var prefix = '';
			var parent = {};

			if (this.props.parent) {
				parent = this.props.parent;
				prefix = this.props.prefix ? this.props.prefix : "";
			} else {
				console.error('No "parent" prop was provided to react-simple-storage. A parent component\'s context is required in order to access and update the parent component\'s state.\n\t\t\t\nTry the following: <SimpleStorage parent={this} />');
				return false;
			}

			// loop through localStorage
			for (var key in localStorage) {
				// if the localStorage item is in the current parent's state and isn't a localStorage method
				if (key.includes(prefix) && typeof localStorage[key] !== 'function' && key !== 'length') {
					// get the property value from localStorage
					var value = localStorage.getItem(key);

					// remove the parent-specific prefix to get original key from parent's state
					var name = key.slice(prefix.length + 1);

					// attempt to parse the stringified localStorage value
					// and update parent's state with the result
					if (name in parent.state) {
						try {
							value = JSON.parse(value);
							parent.setState(_defineProperty({}, name, value));
						} catch (e) {
							parent.setState(_defineProperty({}, name, value));
						}
					}
				}
			}
		}
	}, {
		key: 'saveStateToLocalStorage',
		value: function saveStateToLocalStorage() {
			var allowNewKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			var prefix = '';
			var parent = {};
			var blacklist = [];

			if (this.props.parent) {
				prefix = this.props.prefix ? this.props.prefix : "";
				parent = this.props.parent;
				blacklist = this.props.blacklist || [];
			} else {
				// console.error(`No "parent" prop was provided to react-simple-storage. A parent component's context is required in order to access and update the parent component's state.
				// \nTry the following: <SimpleStorage parent={this} />`)
				return false;
			}

			// loop through all of the parent's state
			for (var key in parent.state) {
				// save item to localStorage if not on the blacklist
				var prefixWithKey = prefix + '_' + key;
				if (blacklist.indexOf(key) < 0 && (prefixWithKey in localStorage || allowNewKey)) {
					localStorage.setItem(prefix + '_' + key, JSON.stringify(parent.state[key]));
				}
			}
		}
	}, {
		key: 'render',
		value: function render() {
			return null;
		}
	}]);

	return SimpleStorage;
}(_react.Component);

exports.default = SimpleStorage;
function clearStorage(prefix) {
	if (this.testForLocalStorage() === true) {
		for (var key in localStorage) {
			if (key.includes(prefix)) {
				localStorage.removeItem(key);
			}
		}
	}
}

function resetParentState(parent) {
	var initialState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	var keysToIgnore = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

	if (this.testForLocalStorage() === true) {
		for (var key in initialState) {
			// reset property if not on the blacklist
			if (keysToIgnore.indexOf(key) < 0) {
				parent.setState(_defineProperty({}, key, initialState[key]));
			}
		}
	}
}

/***/ })
/******/ ]);