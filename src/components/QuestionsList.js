import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory, useLocation, Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import ShareModal from './ShareModal';
import './QuestionsList.css';

const QuestionsList = () => {

  const history = useHistory();
  const { search } = useLocation();
  const queryFilter = (new URLSearchParams(search).get('filter'));
  
  const inputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [serverHealth, setServerHealth] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);
  const [filter, setFilter] = useState(queryFilter ? queryFilter : '');
  const [showModal, setShowModal] = useState(false);

  const getResults = queryFilter === null || filter.length > 0;
  
  useEffect(() => {
    getServerHealth();
  }, [])
  
  const getServerHealth = () => {
    axios.get('https://private-anon-7c54611a93-blissrecruitmentapi.apiary-mock.com/health')
    .then((res) => {
      if(res.data.status === 'OK') {
        getQuestionsList();
        setServerHealth(true);
        setIsLoading(false);
    
        if (inputRef.current && queryFilter === '') {
          inputRef.current.focus();
        }
    
      } else {
        setIsLoading(false);
        setServerHealth(false);
      }
    })
  }

  const getQuestionsList = () => {
    if (getResults) {
      axios.get(`http://private-anon-7c54611a93-blissrecruitmentapi.apiary-mock.com/questions?limit=10&offset=&filter=${filter}`)
      .then((res) => {
        setQuestionsList(res.data);
      })
    }
  }

  const handleRetryClick  = () => {
    setIsLoading(true);
    getServerHealth();
  }

  const handleChange = (event) => {
    setFilter(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (filter.length > 0) {
      history.push({
        pathname: '/questions',
        search: `filter=${filter}`
      });
      getQuestionsList();
    }
  }

  const openModal = () => {
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const questions = questionsList && questionsList.map((item) => {
    const date = (new Date(item.published_at)).toLocaleDateString('pt-PT');

    return (
      <Link to={`/questions/${item.id}`} className="list-item" key={item.id} >
        <img src={item.thumb_url} alt={item.id} />
        <div className="list-info">
          <div className="list-title">{item.question}</div>
          <div className="list-published">Published on {date}</div>
        </div>
      </Link>
    )
  })

  const shareButton = getResults &&
    (
      <button className="btn-share" onClick={openModal}>
        <span className="material-icons icon-email">mail</span>
        <span className="btn-share-text">Share</span>
      </button> 
    )


  return (
    <div className="list">
      { isLoading && 
        <Loader type="Circles" color="#95D7BD" height={60} width={60} />
      }
      { !isLoading && !serverHealth &&
        <button className="btn-retry" onClick={handleRetryClick}>Retry Action</button>
      }
      { !isLoading && serverHealth &&
        <>
          <form className="search-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              className="search-input"
              name="searchInput"
              ref={inputRef}
              value={filter} 
              onChange={handleChange} 
            />
            <button className="btn-search" type="submit">Search</button>
          </form>
          <div>{shareButton}</div>
          <div>{questions}</div>
          <ShareModal url={window.location.href} showModal={showModal} closeModal={closeModal} />
        </>
      }
    </div>
  );
}
 
export default QuestionsList;