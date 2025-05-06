import React, { useState } from 'react';
import './StarRating.css';

const StarRating = () => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (e) => {
    setRating(Number(e.target.value));
  };

  return (
    <form className="rating" onChange={handleRatingChange}>
      <div className="rating__stars">
        {[1, 2, 3, 4, 5].map((value) => (
          <React.Fragment key={value}>
            <input
              id={`rating-${value}`}
              className={`rating__input rating__input-${value}`}
              type="radio"
              name="rating"
              value={value}
            />
            <label className="rating__label" htmlFor={`rating-${value}`}>
              <svg
                className="rating__star"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                aria-hidden="true"
              >
                <g transform="translate(16,16)">
                  <circle
                    className="rating__star-ring"
                    fill="none"
                    stroke="#000"
                    strokeWidth="16"
                    r="8"
                    transform="scale(0)"
                  />
                </g>
                <g
                  stroke="#000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <g transform="translate(16,16) rotate(180)">
                    <polygon
                      className="rating__star-stroke"
                      points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                      fill="none"
                    />
                    <polygon
                      className="rating__star-fill"
                      points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07"
                      fill="#000"
                    />
                  </g>
                  <g
                    transform="translate(16,16)"
                    strokeDasharray="12 12"
                    strokeDashoffset="12"
                  >
                    {[0, 72, 144, 216, 288].map((angle) => (
                      <polyline
                        key={angle}
                        className="rating__star-line"
                        transform={`rotate(${angle})`}
                        points="0 4,0 16"
                      />
                    ))}
                  </g>
                </g>
              </svg>
              <span className="rating__sr">{value} star{value > 1 ? 's' : ''}</span>
            </label>
          </React.Fragment>
        ))}
      </div>
      <p className="rating__display">
        {rating > 0 ? `You rated: ${rating}` : 'Rate this!'}
      </p>
    </form>
  );
};

export default StarRating;