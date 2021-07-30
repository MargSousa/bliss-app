import axios from 'axios';
import { useState, useEffect } from 'react';
import Loader from "react-loader-spinner";
import QuestionsList from './components/QuestionsList';
import './App.css';

function App() {

  const [isLoading, setIsLoading] = useState(true);
  const [serverHealth, setServerHealth] = useState(false);
  const [questionsList, setQuestionsList] = useState([]);
  const [filter, setFilter] = useState("");

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

  const handleRetryClick  = () => {
    setIsLoading(true);
    getServerHealth();
  }

  const getQuestionsList = () => {
    axios.get(`http://private-anon-7c54611a93-blissrecruitmentapi.apiary-mock.com/questions?limit=10&filter=${filter}`)
    .then((res) => {
      setQuestionsList(res.data)
    })
  }

  return (
    <div className="App">
      <div className="main-title">Bliss Recruitment App</div>
      <div className="main-box">
        { isLoading && 
          <Loader type="Circles" color="#95D7BD" height={60} width={60} />
        }
        { !isLoading && !serverHealth &&
          <button className="btn btn-retry" onClick={handleRetryClick}>Retry Action</button>
        }
        { !isLoading && serverHealth &&
          <QuestionsList list={questionsList} />
        }
      </div>
    </div>
  );
}

export default App;
