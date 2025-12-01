import React, { useEffect } from "react";
import './registerAboutYou.css';

function RegisterAboutYou({ onGenderSelect, onBack, selectedGender }) {
    const handleGenderSelect = (gender) => {
        onGenderSelect(gender);
    };

    useEffect(() => {
        const handleKeyPress = (e) => {
            // Only trigger Continue if Enter is pressed and not on a gender button
            if (e.key === 'Enter' && selectedGender && document.activeElement?.className !== 'gender-btn') {
                e.preventDefault();
                const continueButton = document.querySelector('[data-gender-continue]');
                if (continueButton && !continueButton.disabled) {
                    continueButton.click();
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedGender]);

    return (
        <div className="register-about-you-container">
            <div className="register-about-you-header">
            </div>
            <h1>About you</h1>
            <p>Tell us about yourself to improve your experience on Loopify.</p>
            
            <div className="gender-section">
                <h2>How do you identify?</h2>
                <div className="gender-buttons">
                    <button 
                        className={`gender-btn ${selectedGender === 'female' ? 'selected' : ''}`}
                        onClick={() => handleGenderSelect('female')}
                    >
                        Woman
                    </button>
                    <button 
                        className={`gender-btn ${selectedGender === 'male' ? 'selected' : ''}`}
                        onClick={() => handleGenderSelect('male')}
                    >
                        Man
                    </button>
                    <button 
                        className={`gender-btn ${selectedGender === 'prefer not to say' ? 'selected' : ''}`}
                        onClick={() => handleGenderSelect('prefer not to say')}
                    >
                        Prefer not to say
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RegisterAboutYou;
