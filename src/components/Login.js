import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import LoadingSpinner from "./LoadingSpinner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        "https://justchattingserver.herokuapp.com/api/login",
        {
          email,
          password,
        }
      );
      setLoading(false);
      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          localStorage.setItem("userInfo", JSON.stringify(data));
          history.push("/users");
        }
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  return (
    <div className="wrapper">
      <section className="form login">
        <header>Realtime Chat App</header>
        <form>
          <div className="error-text"></div>
          <div className="field input">
            <label>Email Address</label>
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field input">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {loading ? (
            <div className="centered">
              <LoadingSpinner/>
            </div>
          ) : (
            <div className="field button" onClick={handleSubmit}>
              <input type="submit" name="submit" value="Continue to Chat" />
            </div>
          )}
        </form>
        <div className="link">
          Not yet signed up? <Link to="/">Signup now</Link>
        </div>
      </section>
      <ToastContainer />
    </div>
  );
};

export default Login;
