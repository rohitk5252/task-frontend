import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import AvatarBuilder from "./AvatarBuilder";
import Avatar from 'react-nice-avatar'

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [avatarData, setAvaratData] = useState(user?.userAvatar)
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);

  console.log(isActive)
  const handleClick = () => {
    logout();
  };

  useEffect(() => {
    if(user?.userAvatar) {
      setAvaratData(user?.userAvatar)
    }
  }, [user?.userAvatar])

  console.log("avatarData--------------------------", avatarData)
  return (
    <>
    {isActive && <AvatarBuilder setIsActive={setIsActive} avatarData={avatarData} setAvaratData={setAvaratData}/> }
    <header>
      <div className="container">
        <Link to="/">
          <i
            class="fa-solid fa-list-check"
            style={{ color: "#ffffff", fontSize: "24px" }}
          ></i>
        </Link>
        <nav>
          {user ? (
            <>
              {user.userAvatar ? (
                // <div className="user-icon">
                //   <img src={user.userAvatar} alt="User Avatar" />
                // </div>
                <div style={{"cursor": "pointer"}}  onClick={()=> setIsActive(true)}>
                {avatarData && <Avatar style={{ width: '3rem', height: '3rem' }} {...avatarData}/>}
                </div>
              ) : (
                <span style={{color: "#fff"}}>{user.firstName}</span>
              )}
              <button
                className="btn btn-filled btn-filled-red"
                onClick={handleClick}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`btn ${
                  location.pathname.includes("login") ? "btn-filled" : ""
                }`}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className={`btn ${
                  location.pathname.includes("signup") ? "btn-filled" : ""
                }`}
              >
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
    </>
  );
};

export default Navbar;
