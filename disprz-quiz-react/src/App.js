import React, { Component } from 'react';
import Questions from './components/Questions';

class App extends Component {
  constructor(props){
    super(props);
  }

  render() {
    return (
      <div className="App container">
        <Questions/>
      </div>
    );
  }
}

export default App;