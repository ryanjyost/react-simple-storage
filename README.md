# React Simple Storage

A simple component and helper functions for using localStorage with React.

[Check out the demo app and basic example. https://ryanjyost.github.io/react-simple-storage-example-project](https://ryanjyost.github.io/react-simple-storage-example-project/) 

#### Good use cases for react-simple-storage
* Persist and experiment with a component's state while developing.
* 

## Install

[Install via npm.](https://www.npmjs.com/package/react-simple-storage)
```
npm install react-simple-storage
```

## Usage

### Component

Import react-simple-storage into a component whose state you want to save to [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
```
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
| Name             | Type          | Default   | Description
| ---------------- |:------------- | ----------|-----:
| parent           | object        | required  |
| prefix           | string        | ''        |
| blacklist        | array         | []        |



## Helper Functions




## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
