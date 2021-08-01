import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory, useLocation, Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import moment from 'moment';
import ShareModal from './ShareModal';
import ShareButton from './ShareButton';
import { healthCheckEndpoint, listEndpoint } from '../data/api';
import '../styles/QuestionsList.css';

const QuestionsList = () => {

  const history = useHistory();
  const { search } = useLocation();
  const queryFilter = (new URLSearchParams(search).get('filter'));
  
  const inputRef = useRef(null);
  const cleanRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [serverHealth, setServerHealth] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);
  const [filter, setFilter] = useState(queryFilter ? queryFilter : '');
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(0);

  const getResults = queryFilter === null || filter.length > 0;
  
  useEffect(() => {
    getServerHealth();
    setOffset(0);
  }, [])

  useEffect(() => {
    if (offset > 0) {
      addQuestionsList(filter);
    }
  }, [offset])
  
  const getServerHealth = () => {
    axios.get(`${healthCheckEndpoint}`)
    .then((res) => {
      if(res.data.status === 'OK') {
        getQuestionsList(filter);
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

  const getQuestionsList = (input) => {
    if (getResults) {
      axios.get(`${listEndpoint}?limit=10&offset={0}&filter=${input}`)
      .then((res) => {
        setQuestionsList(res.data);
      })
    }
  }

  const addQuestionsList = (input) => {
    if (getResults) {
      axios.get(`${listEndpoint}?limit=10&offset=${offset}&filter=${input}`)
      .then((res) => {
        const newData = questionsList;
        const newList = newData.concat(res.data);
        setQuestionsList(newList);
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
      getQuestionsList(filter);
    }
  }

  const openModal = () => {
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const handleCleanSearch = () => {
    setFilter('');
    if(history.location.pathname !== '/') {
      history.push('/questions');
      getQuestionsList('');
    }
  }

  const questions = questionsList && questionsList.map((item) => {
    const date = moment(item.published_at).format('LLL');
    return (
      <Link to={`/questions/${item.id}`} className="list-item" key={item.id} >
        <img className="list-thumb" src={item.thumb_url} alt={item.id} />
        <div className="list-info">
          <div className="list-title">{item.question}</div>
          <div className="list-published">Published on {date}</div>
        </div>
      </Link>
    )
  })

  return (
    <div className="list-main">
      { isLoading && 
        <Loader type="Circles" color="#4ACC90" height={60} width={60} />
      }
      { !isLoading && !serverHealth &&
        <button className="btn-retry" onClick={handleRetryClick}>Retry Action</button>
      }
      { !isLoading && serverHealth &&
        <>
          <form className="search-form" onSubmit={handleSubmit}>
            <div className="search-fields">              
              <input 
                type="text" 
                className="search-input"
                name="searchInput"
                ref={inputRef}
                value={filter} 
                onChange={handleChange} 
              />
              <div className="clean-search" ref={cleanRef} onClick={handleCleanSearch} hidden={filter.length > 0 ? false : true }>
                <span className="material-icons clean-icon">cancel</span>
              </div>
            </div>
            <button className="btn-search" type="submit">Search</button>
          </form>
          <div className="list">{questions}</div>

          {getResults && 
            <div>
              <button className="btn-show-more" onClick={() => setOffset(offset + 10)}>Show more</button>
              <ShareButton openModal={openModal} />
            </div>
          }
          <ShareModal url={window.location.href} showModal={showModal} closeModal={closeModal} />
        </>
      }
    </div>
  );
}
 
export default QuestionsList;