import React, { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthSuccess = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    
    if (token) {
      setToken(token);
      // Przekieruj użytkownika na stronę profilu
      navigate('/profile');
    } else {
      // W przypadku braku tokena, przekieruj z powrotem do strony logowania
      navigate('/login');
    }
  }, [location, navigate, setToken]);

  return (
    <div className="container text-center mt-5">
      <h2>Uwierzytelnianie pomyślne</h2>
      <p>Przekierowywanie...</p>
    </div>
  );
};

export default AuthSuccess;