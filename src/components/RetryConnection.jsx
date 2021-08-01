import React from 'react';
import noConnection from '../images/no_connection_green.png';
import '../styles/RetryConnection.css';

const Retry = ({ handleClick }) => {
  return (
    <div className="retry-main">
      <img src={noConnection} alt="No connection" />
      <div className="retry-text">Oops! It looks like you are not connected to the Internet.</div>
      <button className="btn-retry" onClick={() => handleClick()}>Retry Action</button>
    </div>
  );
}
 
export default Retry;