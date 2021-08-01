import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import ShareButton from './ShareButton';
import ShareModal from './ShareModal';
import '../styles/QuestionDetail.css';

const QuestionDetail = () => {

  const { questionId } = useParams();
  const history = useHistory();

  const [detail, setDetail] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios.get(`https://private-anon-a031f60989-blissrecruitmentapi.apiary-mock.com/questions/${Number(questionId)}`)
      .then(res => {
        setDetail(res.data);
      })
  }, [questionId])

  const handleVote = (event) => {
    detail.choices.map(item => {
      if (item.choice === event.target.id) {
        item.votes++;
      }
      return item
    });

    axios.put(`https://private-anon-a031f60989-blissrecruitmentapi.apiary-mock.com/questions/${Number(questionId)}`, detail)
     .then(res =>{
        setDetail({...res.data})
      })
  }

  const openModal = () => {
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const { id, question, choices, published_at, image_url } = detail; 

  return (
    <div className="detail">
      <button className="btn-back" onClick={()=>history.goBack()}>
        <span className="material-icons icon-back">arrow_back_ios</span>
        List of Questions
      </button>
      <div className="detail-title">{question}</div>
      <div className="detail-info">
        <div className="detail-published">Published on {moment(published_at).format('LLL')}</div>
        <ShareButton openModal={openModal} />
      </div>
      <div className="detail-image">
        <img src={image_url} alt={id} />
      </div>
      <div className="detail-choices">
        {choices && choices.map((item) =>
          <div className="choice" key={item.choice}>
            <button className="btn-vote" id={item.choice} onClick={handleVote}>{item.choice}</button>
            <div className="choice-votes">{item.votes} votes</div>
          </div>
        )}
      </div>
      <ShareModal url={window.location.href} showModal={showModal} closeModal={closeModal} />
    </div>
  );
}
 
export default QuestionDetail;