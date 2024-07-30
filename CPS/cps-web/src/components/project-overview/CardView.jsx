import React from 'react'

const CardView = (props) => {
  return (
    <>
        <article class="classic-card">
           <div className="card-inner">
              <b>{props.cardTitle}</b>
              <p>{props.cardContent}</p>
           </div>
        </article>
    </>
  )
}

export default CardView