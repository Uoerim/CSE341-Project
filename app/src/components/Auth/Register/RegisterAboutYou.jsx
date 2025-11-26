import React from "react";
import './registerAboutYou.css';

function RegisterAboutYou({ onGenderSelect }) {
    const [selectedGender, setSelectedGender] = React.useState(null);

    const handleGenderSelect = (gender) => {
        setSelectedGender(gender);
        onGenderSelect(gender);
    };

    return (
        <div className="register-about-you-container">
            <h1>About you</h1>
            <p>Tell us about yourself to improve your experience on Reddit.</p>
            
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
                </div>
            </div>
        </div>
    );
}

export default RegisterAboutYou;
