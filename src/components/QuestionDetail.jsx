import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import ShareButton from './ShareButton';
import ShareModal from './ShareModal';
import { questionsDetailEndpoint } from '../data/api';
import ConnectionCheck from '../hoc/ConnectionCheck';
import RetryConnection from '../components/RetryConnection';
import '../styles/QuestionDetail.css';

const QuestionDetail = (props) => {

  const { id } = useParams();

  const [detail, setDetail] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getDetail();
  }, [id])

  const getDetail = () => {
    axios.get(`${questionsDetailEndpoint}/${Number(id)}`)
    .then(res => {
      setDetail(res.data);
    })
  }

  const handleVote = (event) => {
    const newDetail = detail;
    newDetail.choices.map(item => {
      if (item.choice === event.target.id) {
        item.votes++;
      }
      return item
    });

    axios.put(`${questionsDetailEndpoint}/${Number(id)}`, newDetail)
     .then(res =>{
        setDetail({...newDetail})
      })
  }

  const openModal = () => {
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const { question, choices, published_at, image_url } = detail; 
  const { isOnline } = props;
  
  if (!isOnline) {
    return <RetryConnection handleClick={getDetail} />
  }

  return (
    <div className="detail">
      <Link to="/questions" className="btn-back" >
        <span className="material-icons icon-back">arrow_back_ios</span>
        <span>List of Questions</span>
      </Link>
      <div className="detail-title">{question}</div>
      <div className="detail-published">Published on {moment(published_at).format('LLL')}</div>
      <div className="detail-image">
        <img src={image_url} alt="" />
      </div>
      <div className="detail-choices">
        {choices && choices.map((item) =>
          <div className="choice" key={item.choice}>
            <button className="btn-vote" id={item.choice} onClick={handleVote}>{item.choice}</button>
            <div className="choice-votes">{item.votes} votes</div>
          </div>
        )}
      </div>
      <div className="detail-share">
        <ShareButton openModal={openModal} />
      </div>
      <ShareModal url={window.location.href} showModal={showModal} closeModal={closeModal} />
    </div>
  );
}
 
export default ConnectionCheck(QuestionDetail);