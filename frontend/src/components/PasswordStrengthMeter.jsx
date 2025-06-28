import React from 'react';
import './styles/login.css';

import { validatePassword } from "../utils/Validations";


const PasswordStrengthMeter = ({ password }) => {
  const validation = validatePassword(password);

  if (!password) return null;

  return (
    <div className="password-meter-container">
      <div className="strength-bar-container">
        {[1, 2, 3].map((level) => {
          let className = 'strength-bar gray';
          if (validation.isValid) {
            className = 'strength-bar green';
          } else if (password.length >= level * 2) {
            className = 'strength-bar yellow';
          }

          return <div key={level} className={className}></div>;
        })}
      </div>
      <div className="password-errors">
        {Object.values(validation.errors).map((error, index) =>
          error ? (
            <p key={index} className="error-text">
              {error}
            </p>
          ) : null
        )}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
