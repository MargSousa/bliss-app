import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from "react-router-dom";
import Loader from "react-loader-spinner";
import './QuestionsList.css';

const QuestionsList = () => {

  const { search } = useLocation();
  const queryFilter = (new URLSearchParams(search).get('filter'));

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
      } else {
        setIsLoading(false);
        setServerHealth(false);
      }
    }
  )}

  const getQuestionsList = () => {
    axios.get(`http://private-anon-7c54611a93-blissrecruitmentapi.apiary-mock.com/questions?limit=10&offset=&filter=${filter}`)
    .then((res) => {
      setQuestionsList(res.data);
    })
  }

  const handleRetryClick  = () => {
    setIsLoading(true);
    getServerHealth();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    getQuestionsList();
    setFilter('');
  }

  const handleChange = (event) => {
    setFilter(event.target.value);
  }

  const questions = questionsList && questionsList.map((item) => {
    const date = (new Date(item.published_at)).toLocaleDateString('pt-PT');
    //const time = (new Date(item.published_at)).toLocaleTimeString().slice(0,5);

    return (
      <div className="list-item" key={item.id}>
        <img src={item.thumb_url} alt={item.id} />
        <div className="list-info">
          <div className="list-title">{item.question}</div>
          <div className="list-published">Published on {date}</div>
        </div>
      </div>
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
      { !isLoading && serverHealth && questions &&
        <>
          <form onSubmit={handleSubmit}>
            <input type="text" value={filter} onChange={handleChange} />
            <button className="btn-search" type="submit">Search</button>
          </form>
          <div>{questions}</div>
        </>
      }
    </div>
  );
}
 
export default QuestionsList;