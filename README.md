# React Simple Storage

A simple component and helper functions for using localStorage with React.

[Check out the demo app and basic example. https://ryanjyost.github.io/react-simple-storage-example-project](https://ryanjyost.github.io/react-simple-storage-example-project/) 

#### Good use cases for react-simple-storage
* Persist and experiment with a component's state while developing.
* Save form data across user sessions.
* A simple, quick fake backend for a practice or portfolio project.
* More I can't think of... 

## Install

[Install via npm.](https://www.npmjs.com/package/react-simple-storage)
```
npm install react-simple-storage
```

## Usage

### Component

Import and include an instance of react-simple-storage in a component whose state you want to save to [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
```javascript
import React, { Component } from "react";
import SimpleStorage from "react-simple-storage";

export default class ParentComponent extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      text: "",
    }
  }

  render() {
    return ( 
      <div>
      
        // include the component somewhere in the parent to save the parent's state in localStorage
        <SimpleStorage parent={this} />

        // the value of this input will be saved in localStorage
        <input
          type="text"
          value={this.state.text}
          onChange={e => this.setState({ text: e.target.value })}
        />
        
      </div>
    ) 
  }
}
```

### Props
| Name             | Type            |Required? | Default      | Description
| ---------------- |:--------------- |:-------- | ------------ |-------------
| parent           | *object*        | Yes      | **none**     | reference to the parent component, i.e. `this`
| prefix           | *string*        | No       | ""           | prefix added to localStorage keys to avoid name clashes across instances     
| blacklist        | *array*         | No       | []           | a list of parent component's `state` names/keys to ignore when saving to localStorage   



## Helper Functions
### `clearStorage(prefix)`
Clears items in `localStorage` with the given `prefix`, or all items if no `prefix` is given.
* `prefix: String | optional` - Corresponds to `prefix` prop passed to an instance of the `react-simple-storage` 
component.

#### Example
```javascript
import React, { Component } from "react";
import SimpleStorage, { clearStorage } from "react-simple-storage";

export default class ParentComponent extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      text: "",
    }
  }

  render() {
    return ( 
      <div>
      
        // provide a prefix prop to be able to clear just the localStorage items 
        // created by this instance of the react-simple-storage component
        <SimpleStorage parent={this} prefix={"ParentComponent"} />

        <input
          type="text"
          value={this.state.text}
          onChange={e => this.setState({ text: e.target.value })}
        />
        
        // removes only localStorage items related to the ParentComponent
        <button onClick={() => clearStorage("ParentComponent")}>
          Clear localStorage for ParentComponent
        </button>
        
         // removes all items from localStorage
        <button onClick={() => clearStorage()}>
          Clear all localStorage
        </button>
        
      </div>
    ) 
  }
}
```


### `resetParentState(parent, initialState, keysToIgnore)`
Resets the parent's state to given `initialState`. 
* `parent: Object | required` - Reference to the parent component, allowing `react-simple-storage` to access and update 
the parent component's state. If called within the parent component, simply pass `this`.
* `initialState: Object | required` - The `state` of the parent component after the function executes.
* `keysToIgnore: Array | optional` - A list of keys in the parent component's `state` to ignore on `resetParentState
`. These pieces of that parent's state will NOT be reset.

#### Example

```javascript
import React, { Component } from "react";
import SimpleStorage, { resetParentState } from "react-simple-storage";

export default class ParentComponent extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      text: "Initial Text",
    }
    
    // store the component's initial state to reset it
    this.initialState = this.state;
  }

  render() {
    return ( 
      <div>
      
        <SimpleStorage parent={this} />

        <input
          type="text"
          value={this.state.text}
          onChange={e => this.setState({ text: e.target.value })}
        />
        
        // will set "text" in state to "Initial Text"
         <button onClick={() => resetParentState(this, this.initialState)}>
           Reset parent state
         </button>
        
        // ignores "text" on reset, so will have no effect here
        <button onClick={() => resetParentState(this, this.initialState, ['text'])}>
          Do NOT reset text
        </button>
        
      </div>
    ) 
  }
}
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
