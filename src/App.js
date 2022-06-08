import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { Switch, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Users from "./components/Users";


function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" exact>
          <SignUp />
        </Route>
        <Route path="/login" exact>
          <Login />
        </Route>
        <Route path="/users" exact>
          <Users />
        </Route>
      </Switch>
    </div>
  );
}


export default App;
