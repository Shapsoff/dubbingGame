import React, { useEffect } from 'react';
import './StarRating.scss';

const StarRating = ({ setRating }) => {
  // const [rating, setRating] = useState(0); // Tracks the selected rating
  // const [hoverRating, setHoverRating] = useState(0); // Tracks the hovered rating

  useEffect(() => {
    const stars = document.querySelectorAll('.rating__input');
    const labels = document.querySelectorAll('.rating__label');

    // Add hover effect
    // labels.forEach((label, index) => {
    //   label.addEventListener('mouseenter', () => {
    //     setHoverRating(index + 1); // Temporarily set the hover rating
    //   });
    //   label.addEventListener('mouseleave', () => {
    //     setHoverRating(0); // Reset hover rating
    //   });
    // });

    // Add click effect
    stars.forEach((star, index) => {
      star.addEventListener('change', () => {
        setRating(index + 1); // Set the selected rating
        // console.log(`Selected rating: ${index + 1}`);
      });
    });

    // Cleanup event listeners on unmount
    return () => {
      labels.forEach((label) => {
        label.removeEventListener('mouseenter', () => {});
        label.removeEventListener('mouseleave', () => {});
      });
      stars.forEach((star) => {
        star.removeEventListener('change', () => {});
      });
    };
  }, [setRating]);

  return (
    <form className="rating">
      <div className="rating__stars">
        <input id="rating-1" className="rating__input rating__input-1" type="radio" name="rating" value="1" />
        <input id="rating-2" className="rating__input rating__input-2" type="radio" name="rating" value="2" />
        <input id="rating-3" className="rating__input rating__input-3" type="radio" name="rating" value="3" />
        <input id="rating-4" className="rating__input rating__input-4" type="radio" name="rating" value="4" />
        <input id="rating-5" className="rating__input rating__input-5" type="radio" name="rating" value="5" />
        <label className="rating__label" htmlFor="rating-1">
          <svg className="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <g transform="translate(16,16)">
              <circle className="rating__star-ring" fill="none" stroke="#000" strokeWidth="16" r="8" transform="scale(0)" />
            </g>
            <g stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <g transform="translate(16,16) rotate(180)">
                <polygon className="rating__star-stroke" points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="none" />
                <polygon className="rating__star-fill" points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="#000" />
              </g>
              <g transform="translate(16,16)" strokeDasharray="12 12" strokeDashoffset="12">
                <polyline className="rating__star-line" transform="rotate(0)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(72)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(144)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(216)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(288)" points="0 4,0 16" />
              </g>
            </g>
          </svg>
          <span className="rating__sr">1 star—Terrible</span>
        </label>
        <label className="rating__label" htmlFor="rating-2">
          <svg className="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <g transform="translate(16,16)">
              <circle className="rating__star-ring" fill="none" stroke="#000" strokeWidth="16" r="8" transform="scale(0)" />
            </g>
            <g stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <g transform="translate(16,16) rotate(180)">
                <polygon className="rating__star-stroke" points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="none" />
                <polygon className="rating__star-fill" points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="#000" />
              </g>
              <g transform="translate(16,16)" strokeDasharray="12 12" strokeDashoffset="12">
                <polyline className="rating__star-line" transform="rotate(0)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(72)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(144)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(216)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(288)" points="0 4,0 16" />
              </g>
            </g>
          </svg>
          <span className="rating__sr">2 stars—Bad</span>
        </label>
        <label className="rating__label" htmlFor="rating-3">
          <svg className="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <g transform="translate(16,16)">
              <circle className="rating__star-ring" fill="none" stroke="#000" strokeWidth="16" r="8" transform="scale(0)" />
            </g>
            <g stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <g transform="translate(16,16) rotate(180)">
                <polygon className="rating__star-stroke" points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="none" />
                <polygon className="rating__star-fill" points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="#000" />
              </g>
              <g transform="translate(16,16)" strokeDasharray="12 12" strokeDashoffset="12">
                <polyline className="rating__star-line" transform="rotate(0)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(72)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(144)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(216)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(288)" points="0 4,0 16" />
              </g>
            </g>
          </svg>
          <span className="rating__sr">3 stars—OK</span>
        </label>
        <label className="rating__label" htmlFor="rating-4">
          <svg className="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <g transform="translate(16,16)">
              <circle className="rating__star-ring" fill="none" stroke="#000" strokeWidth="16" r="8" transform="scale(0)" />
            </g>
            <g stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <g transform="translate(16,16) rotate(180)">
                <polygon className="rating__star-stroke" points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="none" />
                <polygon className="rating__star-fill" points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="#000" />
              </g>
              <g transform="translate(16,16)" strokeDasharray="12 12" strokeDashoffset="12">
                <polyline className="rating__star-line" transform="rotate(0)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(72)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(144)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(216)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(288)" points="0 4,0 16" />
              </g>
            </g>
          </svg>
          <span className="rating__sr">4 stars—Good</span>
        </label>
        <label className="rating__label" htmlFor="rating-5">
          <svg className="rating__star" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <g transform="translate(16,16)">
              <circle className="rating__star-ring" fill="none" stroke="#000" strokeWidth="16" r="8" transform="scale(0)" />
            </g>
            <g stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <g transform="translate(16,16) rotate(180)">
                <polygon className="rating__star-stroke" points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="none" />
                <polygon className="rating__star-fill" points="0,15 4.41,6.07 14.27,4.64 7.13,-2.32 8.82,-12.14 0,-7.5 -8.82,-12.14 -7.13,-2.32 -14.27,4.64 -4.41,6.07" fill="#000" />
              </g>
              <g transform="translate(16,16)" strokeDasharray="12 12" strokeDashoffset="12">
                <polyline className="rating__star-line" transform="rotate(0)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(72)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(144)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(216)" points="0 4,0 16" />
                <polyline className="rating__star-line" transform="rotate(288)" points="0 4,0 16" />
              </g>
            </g>
          </svg>
          <span className="rating__sr">5 stars—Excellent</span>
        </label>
        <p className="rating__display" data-rating="1" hidden>Terrible</p>
        <p className="rating__display" data-rating="2" hidden>Bad</p>
        <p className="rating__display" data-rating="3" hidden>OK</p>
        <p className="rating__display" data-rating="4" hidden>Good</p>
        <p className="rating__display" data-rating="5" hidden>Excellent</p>
      </div>
    </form>
  );
};

export default StarRating;