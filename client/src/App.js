import "./App.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Footer from "./components/footer";
import Header from "./components/header";
import Login from "./components/login";
import Createaccount from "./components/createaccount";
import Home from "./components/home";
import Profile from "./components/profile";
import ChangePassword from "./components/changepassword";
import Register from "./components/register";
import Link from "./components/link";
import TestCorona from "./components/coronadata";
import Twofactorauth from "./components/twofactorauth";
import Privacypolicy from "./components/privacypolicy";
import Terms from "./components/terms";
import verifylink from "./components/verifylink";
import Forgotpassword from "./components/forgotpassword";

function App() {
  return (
    <div className="page-container">
      <BrowserRouter>
        <Header />
        <div className="content-wrap">
          <Switch>
            <Route exact path="/verifylink/:id" component={Link}></Route>
            <Route exact path="/" component={Login}></Route>
            <Route exact path="/register/:id" component={Register}></Route>
            <Route exact path="/login" component={Login}></Route>
            <Route exact path="/createaccount" component={Createaccount}></Route>
            <Route exact path="/home" component={Home}></Route>
            <Route exact path="/profile" component={Profile}></Route>
            <Route exact path="/changepassword" component={ChangePassword}></Route>
            <Route exact path="/coronadata" component={TestCorona}></Route>
            <Route exact path="/twofactorauth" component={Twofactorauth}></Route>
            <Route exact path="/privacypolicy" component={Privacypolicy}></Route>
            <Route exact path="/termsandconditions" component={Terms}></Route>
            <Route exact path="/verifyemail" component={verifylink}></Route>
            <Route exact path="/forgotpassword" component={Forgotpassword}></Route>
          </Switch>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
