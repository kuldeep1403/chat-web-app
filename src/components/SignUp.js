import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const SignUp = () => {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const TransformFileData = (file) => {
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageURL(reader.result);
      };
    } else {
      setImageURL("");
    }
  };

  const handleProductImageUpload = (e) => {
    const file = e.target.files[0];

    TransformFileData(file);
  };

  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://justchattingserver.herokuapp.com/api/register",
        {
          name,
          username,
          email,
          password,
          image: imageURL,
        }
      );
      setLoading(false);
      if (data) {
        if (data.errors) {
          const { email, password, name, username, image } = data.errors;
          if (name) {
            generateError(name);
          } else if (username) {
            generateError(username);
          } else if (email) {
            generateError(email);
          } else if (password) {
            generateError(password);
          } else if (image) {
            generateError(image);
          }
        } else {
          localStorage.setItem("userInfo", JSON.stringify(data));
          history.push("/login");
        }
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  return (
    <div className="wrapper">
      <section className="form signup">
        <header>Realtime Chat App</header>
        <form onSubmit={(e) => handleFormSubmit(e)}>
          <div className="error-text"></div>
          <div className="name-details">
            <div className="field input">
              <label>Name</label>
              <input
                type="text"
                id="fname"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="field input">
              <label>Username</label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
          </div>
          <div className="field input">
            <label>Email Address</label>
            <input
              type="text"
              id="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field input">
            <label>Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field image">
            <label>Select Image</label>
            <input
              type="file"
              id="image"
              name="avatar"
              accept="image/*"
              onChange={handleProductImageUpload}
            />
          </div>

          {loading ? (
            <div className="loading">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="field button">
              <input type="submit" id="submit" value="Continue to Chat" />
            </div>
          )}
        </form>
        <div className="link">
          Already signed up? <Link to="/login">Login now</Link>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
