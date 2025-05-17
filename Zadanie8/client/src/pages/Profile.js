import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user, logout, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="container text-center mt-5">Ładowanie...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 mx-auto">
          <div className="card">
            <div className="card-body text-center">
              <img 
                src={user.avatar} 
                alt="Avatar" 
                className="rounded-circle mb-3" 
                style={{ width: '120px', height: '120px' }} 
              />
              <h3 className="card-title">{user.displayName}</h3>
              <p className="card-text">{user.email}</p>
              <div className="mt-4">
                <button onClick={logout} className="btn btn-danger">
                  Wyloguj się
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;