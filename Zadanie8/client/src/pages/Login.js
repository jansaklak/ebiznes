import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const { user, login, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Jeśli użytkownik jest już zalogowany, przekieruj go na stronę główną
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="container text-center mt-5">Ładowanie...</div>;
  }

  return (
    <div className="container text-center mt-5">
      <div className="col-md-6 mx-auto">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title mb-4">Zaloguj się</h2>
            <button 
              onClick={login} 
              className="btn btn-danger btn-lg btn-block d-flex align-items-center justify-content-center"
              style={{ gap: '10px' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path 
                  fill="currentColor" 
                  d="M21.35,11.1H12.18V13.83H18.69C18.36,15.64 17.5,17 16.24,17.83C15.24,18.5 13.92,18.89 12.18,18.89C9.27,18.89 6.91,17 6.24,14.33C6.01,13.64 5.87,12.93 5.87,12.16C5.87,11.39 6.01,10.68 6.24,9.99C6.91,7.33 9.27,5.43 12.18,5.43C13.83,5.43 15.22,6.08 16.33,7.12L18.21,5.24C16.71,3.82 14.61,3 12.18,3C7.26,3 3.35,6.88 3.35,12C3.35,17.12 7.26,21 12.18,21C14.63,21 16.71,20.16 18.18,18.85C19.78,17.39 20.68,15.28 20.68,12.76C20.68,12.2 20.61,11.63 20.5,11.1H21.35Z"
                />
              </svg>
              Zaloguj przez Google
            </button>
            <p className="mt-3">
              Zostaniesz przekierowany do Google w celu uwierzytelnienia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;