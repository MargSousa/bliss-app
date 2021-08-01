import React from 'react';
import '../styles/ShareButton.css';

const ShareButton = ({ openModal }) => {

  return (
    <>
      <button className="btn-share" onClick={() => openModal() }>
          <span className="material-icons icon-email">mail</span>
          <span className="btn-share-text">Share</span>
        </button> 
    </>
  );
}
 
export default ShareButton;