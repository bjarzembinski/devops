import React from 'react';
import './App.css';

function App() {
  const randomNumber = Math.random();
  return (
    <div className="App">
      {randomNumber}
    </div>
  );
}

export default App;
