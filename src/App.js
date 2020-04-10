import React, { Component } from 'react';
import './App.css';
import Calendar from './../src/Components/Calendar/index'

export default class App extends Component {
 
   /**
   * This is render method.
   */
  render() {
  
  return (
    <div className="App">
      <main>
        <Calendar />
      </main>
    </div>
  );
  }
}

