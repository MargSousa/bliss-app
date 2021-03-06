import React from 'react';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import QuestionsList from './components/QuestionsList';
import QuestionDetail from './components/QuestionDetail';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <div className="main-title">Bliss Recruitment App</div>
      <div className="main-box">
        <Router>
          <Switch>
            <Route exact path="/" component={QuestionsList}/>
            <Route exact path="/questions" component={QuestionsList}/>
            <Route exact path="/questions/:id" component={QuestionDetail} />
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
