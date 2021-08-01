import React, { useState } from 'react';
import axios from 'axios';
import { shareEndpoint } from '../data/api';
import '../styles/ShareModal.css';

const ShareModal = ({ url, showModal, closeModal}) => {

  const [email, setEmail] = useState('');
  const [listShared, setListShared] = useState(false);
  const [shareNote, setShareNote] = useState('');

  const handleChange = (event) => {
    setEmail(event.target.value);
    setShareNote('');
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.length > 0) {
      axios.post(`${shareEndpoint}?destination_email=${email}&content_url=${url}`)
        .then(res => {
          setListShared(true);
          setShareNote('Email sent!');
        })
        .catch(error => {
          setListShared(false);
          setShareNote('Something went wrong, please try again.');
        });
    } else {
      setListShared(false);
      setShareNote('Please enter a valid email.');
    }
  }

  const handleCloseModal = () => {
    closeModal();
    setShareNote('');
  }

  const shareNoteClassName = listShared ? 'share-result done' : 'share-result error';

  if (showModal) {
    return (
      <div className="share-main" hidden={showModal ? true : false} >
        <div className="share-header">
          <button className="material-icons btn-close" onClick={handleCloseModal}>close</button>
        </div>
        <div className="share-box">
          <div className="share-title">Enter an email to share the results</div>
          <form className="share-form">
            <input type="email" placeholder="Enter Email" value={email} onChange={handleChange} required />
            <button type="submit" className="btn-send" onClick={handleSubmit}>Send</button>
          </form>
          <div className={shareNoteClassName}>{shareNote}</div>
        </div>
      </div>
    )
  } else {
    return null
  }
}
 
export default ShareModal;