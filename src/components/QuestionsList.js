import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useHistory, useLocation, Link } from "react-router-dom";
import Loader from "react-loader-spinner";
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
    }
  )}

  const getQuestionsList = () => {
    if (queryFilter === null || filter.length > 0) {
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

  const questions = questionsList && questionsList.map((item) => {
    const date = (new Date(item.published_at)).toLocaleDateString('pt-PT');
    //const time = (new Date(item.published_at)).toLocaleTimeString().slice(0,5);

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
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="searchInput"
              ref={inputRef}
              value={filter} 
              onChange={handleChange} 
            />
            <button className="btn-search" type="submit">Search</button>
          </form>
          <div>{questions}</div>
        </>
      }
    </div>
  );
}
 
export default QuestionsList;