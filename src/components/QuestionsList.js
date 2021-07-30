import React from 'react';
import './QuestionsList.css';

const QuestionsList = ({ list }) => {

  console.log(list)

  const questions = list && list.map((item) => {
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
    <>
      {questions}
    </>
  );
}
 
export default QuestionsList;