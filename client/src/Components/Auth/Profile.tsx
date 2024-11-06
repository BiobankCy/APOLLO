import React from "react";
//import { getCurrentUser } from "src/services/auth.service";
import { useAuth } from "src/contexts/UserContext";

const Profile: React.FC = () => {
  const userContext = useAuth();

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>
          <strong>{userContext?.currentUser?.fullname}</strong> Profile
        </h3>
      </header>
      {/*<p>*/}
      {/*    <strong>Token:</strong> {currentUser.accessToken.substring(0, 20)} ...{" "}*/}
      {/*    {currentUser.accessToken.substr(currentUser.accessToken.length - 20)}*/}
      {/*</p>*/}
      <p>
        <strong>Id:</strong> {userContext?.currentUser?.id}
      </p>
      <p>
        <strong>Email:</strong> {userContext?.currentUser?.email}
      </p>
      <strong>Authorities:</strong>
      <ul>
        {userContext?.currentUser?.role && (
          <li key={userContext?.currentUser?.role.id}>
            {userContext?.currentUser?.role.roleName}
          </li>
        )}
      </ul>
    </div>
  );
};

export default Profile;
