import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const generateError = (error) =>
    toast.error(error, {
      position: "bottom-right",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "https://justchattingserver.herokuapp.com/api/login",
        {
          email,
          password,
        },
        { withCredentials: false}
      );

      if (data) {
        if (data.errors) {
          const { email, password } = data.errors;
          if (email) generateError(email);
          else if (password) generateError(password);
        } else {
          history.push("/users");
        }
      }
    } catch (err) {
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
          <div className="field button" onClick={handleSubmit}>
            <input type="submit" name="submit" value="Continue to Chat" />
          </div>
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
