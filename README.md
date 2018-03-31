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

class ParentComponent extends Component {
  constructor(props) { 
    super(props)
    this.state = {
      text: "Initial State",
    }
  }

  render() {
    return ( 
      <div>
      
        // include the component somewhere in the parent to save the parent's state in localStorage
        <SimpleStorage parent={this} />

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
* `prefix: String` - Corresponds to `prefix` prop passed to an instance of the `react-simple-storage` component.




## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
