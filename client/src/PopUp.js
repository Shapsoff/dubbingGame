import React from "react";
import './PopUp.css';

const PopUp = () => {

    const closePopup = () => {
        const popup = document.querySelector('.popup');
        if (popup) {
            popup.style.display = 'none';
        }
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>⚠️ IMPORTANT ⚠️</h2>
                <h3>À lire avant de jouer</h3>
                <p>1. Penser à vérifier vos micros dans la page de connection</p><br />
                <p>2. Éviter d'appuyer sur "suivant" sans avoir arreter l'enregistrement</p><br />
                <p>3. Pendant la phase de vote il n'y a pas de retour en arrière si vous ne votez pas c'est 0 ⭐</p>
                <button className="close-button" onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};
 export default PopUp;