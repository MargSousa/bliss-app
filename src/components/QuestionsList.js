import React from 'react';
import './QuestionsList.css';

const QuestionsList = ({ list, filter, searchChange, searchSubmit }) => {

  const handleSubmit = (event) => {
    event.preventDefault();
    searchSubmit();
  }

  const handleChange = (event) => {
    searchChange(event.target.value);
  }

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
      <form onSubmit={handleSubmit}>
        <input type="text" value={filter} onChange={handleChange} />
        <button className="btn-search" type="submit">Search</button>
      </form>
      <div>{questions}</div>
    </>
  );
}
 
export default QuestionsList;