import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [values, setValues] = useState([]);
  const [max, setMax] = useState();
  const [mesg, setMesg] = useState('');
  const [butttonDisabled, setButtonDisabled] = useState(true);
  const regex = new RegExp('^[0-9]*(,[0-9]*)*$');

  useEffect(() => {
    setButtonDisabled(values.length < 1);
    if (mesg) {
      setMesg('');
    };
  }, [values]);

  const inputOnChange = (changeEvent) => {
    setValues(changeEvent.target.value);
  };

  const buttonOnClick = () => {
    const validationResult = validateInput();
    if (!validationResult) {
      return;
    }
    const valuesObject = {
      values: values.split(",").map(Number)
    };
    axios.post('http://localhost:8080/api/max', valuesObject).then(resp => {
      if (resp.status === 200) {
        setMax(resp.data.max);
      };
    }).catch(err => {
      setMesg('Computation fails');
    });
  };

  const validateInput = () => {
    if (!regex.test(values)) {
      setMesg('Values were provided in unsupported format');
      setMax(null);
      return false;
    };
    return true;
  };

  return (
    <div className="App">
      <p className="Header">Provide values separated by commas</p>
      <input onChange={inputOnChange}  />
      <div className="Message">{mesg ? mesg : null}</div>
      <p>Maximum value: {max ? max : "-"} </p>
      <button onClick={buttonOnClick} disabled={butttonDisabled} className="Button">Calculate maximum value</button>
    </div>
  );
};

export default App;
