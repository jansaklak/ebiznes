import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="container text-center mt-5">Ładowanie...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Witaj w aplikacji OAuth2</h1>
        <p className="lead">Ta aplikacja demonstruje uwierzytelnianie OAuth2 z Google.</p>
        <hr className="my-4" />
        <p>
          {user ? (
            <>
              Jesteś zalogowany jako <strong>{user.displayName}</strong>.
              <div className="mt-3">
                <Link to="/profile" className="btn btn-primary btn-lg mr-2">Mój profil</Link>
              </div>
            </>
          ) : (
            <>
              Zaloguj się, aby uzyskać dostęp do funkcji aplikacji.
              <div className="mt-3">
                <Link to="/login" className="btn btn-primary btn-lg">Zaloguj się</Link>
              </div>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Home;
