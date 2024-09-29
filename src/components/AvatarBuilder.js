import React, { useEffect, useState } from "react";
import { useTaskContext } from "../hooks/useTaskContext";
import { useAuthContext } from "../hooks/useAuthContext";
import Dropdown from "./Dropdown";
import Avatar, { genConfig } from "react-nice-avatar";

const AvatarBuilder = ({
  isActive,
  setIsActive,
  editMode,
  avatarData,
  viewMode,
  setAvaratData,
}) => {
  const [error, setError] = useState(null);
  const [updatedAvatar, setUpdatedAvatar] = useState(avatarData)
  const { dispatch } = useTaskContext();
  const { user } = useAuthContext();
  const config = genConfig(updatedAvatar);

  console.log("config", config);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("user", user)
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/update`, {
      method: "PATCH",
      body: JSON.stringify({userAvatar: updatedAvatar}),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();
    if (!response.ok) {
      console.log(json.error);
      setError(json.error);
    }

    if (response.ok) {
      setError(null);
      let userData = JSON.parse(localStorage.getItem('user'))
      userData.userAvatar = json.userAvatar
      localStorage.setItem('user', JSON.stringify(userData))
      console.log("userData------",userData)
      dispatch({ type: 'LOGIN', payload: userData })
      setAvaratData(updatedAvatar)
      setIsActive(false);
    }
  };

  const handleSelect = (selectedOption, name) => {
    setUpdatedAvatar((prev) => ({ ...prev, [name]: selectedOption.value }));
  };

  const onChangeInput = (e, type) => {
    const { name, value } = e.target;
    setUpdatedAvatar((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="task-modal">
      <div className="task-container">
        <div className="flexGroup">
          <Avatar style={{ width: "3rem", height: "3rem" }} {...config} />
          <h4>Make Awesome Avatar</h4>
        </div>
        <form>
          <div className="flexGroup">
            <div>
              <label htmlFor="">Gender:</label>
              <Dropdown
                options={[
                  { value: "man", label: "Man" },
                  { value: "woman", label: "Woman" },
                ]}
                onSelect={(option) => handleSelect(option, "sex")}
              />
            </div>
            <div>
              <label htmlFor="">Face Color:</label>
              <input
                type="color"
                name="faceColor"
                value={avatarData?.faceColor}
                placeholder=""
                onChange={onChangeInput}
              />
            </div>
          </div>
          <div className="flexGroup">
            <div>
              <label htmlFor="">Hair Color:</label>
              <input
                type="color"
                name="hairColor"
                value={avatarData?.hairColor}
                placeholder=""
                onChange={onChangeInput}
              />
            </div>

            <div>
              <label htmlFor="">Hair Style:</label>
              <Dropdown
                options={[
                  { value: "normal", label: "normal" },
                  { value: "thick", label: "thick" },
                  { value: "womanShort", label: "womanShort" },
                  { value: "womanLong", label: "womanLong" },
                  { value: "mohawk", label: "mohawk" },
                ]}
                onSelect={(option) => handleSelect(option, "hairStyle")}
              />
            </div>
          </div>
          <div className="flexGroup">
            <div>
              <label htmlFor="">Hat Style:</label>
              <Dropdown
                options={[
                  { value: "beanie", label: "beanie" },
                  { value: "turban", label: "turban" },
                  { value: "none", label: "none" },
                ]}
                onSelect={(option) => handleSelect(option, "hatStyle")}
              />
            </div>
            <div>
              <label htmlFor="">Eye Style:</label>
              <Dropdown
                options={[
                  { value: "circle", label: "circle" },
                  { value: "oval", label: "oval" },
                  { value: "smile", label: "smile" },
                ]}
                onSelect={(option) => handleSelect(option, "eyeStyle")}
              />
            </div>
          </div>
          <div className="flexGroup">
            <div>
              <label htmlFor="">Glasses Style:</label>
              <Dropdown
                options={[
                  { value: "none", label: "none" },
                  { value: "round", label: "round" },
                  { value: "square", label: "square" },
                ]}
                onSelect={(option) => handleSelect(option, "glassesStyle")}
              />
            </div>
            <div>
              <label htmlFor="">Nose Style:</label>
              <Dropdown
                options={[
                  { value: "short", label: "short" },
                  { value: "long", label: "long" },
                  { value: "round", label: "round" },
                ]}
                onSelect={(option) => handleSelect(option, "noseStyle")}
              />
            </div>
          </div>
          <div className="flexGroup">
            <div>
              <label htmlFor="">Mouth Style:</label>
              <Dropdown
                options={[
                  { value: "laugh", label: "laugh" },
                  { value: "smile", label: "smile" },
                  { value: "peace", label: "peace" },
                ]}
                onSelect={(option) => handleSelect(option, "mouthStyle")}
              />
            </div>
            <div>
              <label htmlFor="">Shirt Style:</label>
              <Dropdown
                options={[
                  { value: "hoody", label: "hoody" },
                  { value: "short", label: "short" },
                  { value: "polo", label: "polo" },
                ]}
                onSelect={(option) => handleSelect(option, "shirtStyle")}
              />
            </div>
          </div>
          <div className="flexGroup">
            <div>
              <label htmlFor="">Shirt Color:</label>
              <input
                type="color"
                name="shirtColor"
                value={avatarData?.shirtColor}
                placeholder=""
                onChange={onChangeInput}
              />
            </div>
            <div>
              <label htmlFor="">Background Color:</label>
              <input
                type="color"
                name="bgColor"
                value={avatarData?.bgColor}
                placeholder=""
                onChange={onChangeInput}
              />
            </div>
          </div>
        </form>
        <div className="task-footer">
          {!viewMode && (
            <button
              className="btn btn-filled btn-filled-blue"
              onClick={handleSubmit}
            >
              {`Update Avatar`}
            </button>
          )}
          <button
            className="btn btn-filled p-0"
            onClick={() => setIsActive(false)}
          >
            Close
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default AvatarBuilder;
