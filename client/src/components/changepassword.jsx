import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";

export default class Changepassword extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem("token");
    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }

    this.state = {
      confirmpassword: "",
      newpassword: "",
      password: "",
      loggedIn,
      loggedInstatus: true,
      wrongpassword: false,
      changesuccess: false,
      passwordnotmatch: false,
      minilength: false,
      maxlength: false,
      uppercase: false,
      lowercase: false,
      digits: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    const token = localStorage.getItem("token");

    if (token != null) {
      const decoded = jwt_decode(token);
      axios
        .get("http://localhost:8080/checkloginstatus")
        .then((res) => {
          var i;
          for (i = 0; i < res.data.data.length; i++) {
            if (
              res.data.data[i].email === decoded.result.email &&
              res.data.data[i].loginstatus === "false"
            ) {
              this.setState({
                loggedInstatus: false,
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({
      wrongpassword: false,
      changesuccess: false,
      passwordnotmatch: false,
      minilength: false,
      maxlength: false,
      uppercase: false,
      lowercase: false,
      digits: false,
    });

    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);

    const data = {
      email: decoded.result.email,
      password: this.state.password,
      newpassword: this.state.newpassword,
      confirmpassword: this.state.confirmpassword,
    };

    axios
      .post("http://localhost:8080/checkoldpassword", data)
      .then((res) => {
        if (res.data.message === "Wrong password") {
          this.setState({
            wrongpassword: true,
          });
        } else if (res.data.message === "Correct password") {
          if (data.newpassword === data.confirmpassword) {
            const data = {
              email: decoded.result.email,
              password: this.state.newpassword,
            };
            axios
              .post("http://localhost:8080/changepassword", data)
              .then((res) => {
                if (res.data.message === "Minimum length 8") {
                  this.setState({
                    minilength: true,
                  });
                }
                if (res.data.message === "Maxmum length 20") {
                  this.setState({
                    maxlength: true,
                  });
                }
                if (res.data.message === "Must have uppercase letters") {
                  this.setState({
                    uppercase: true,
                  });
                }
                if (res.data.message === "Must have lowercase letters") {
                  this.setState({
                    lowercase: true,
                  });
                }
                if (res.data.message === "Must have at least 2 digits") {
                  this.setState({
                    digits: true,
                  });
                }
                if (res.data.message === "Password has been changed") {
                  this.setState({
                    changesuccess: true,
                  });
                }
              });
          } else {
            this.setState({
              passwordnotmatch: true,
            });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/" />;
    }
    if (this.state.loggedInstatus === false) {
      return <Redirect to="/twofactorauth" />;
    }
    const {
      wrongpassword,
      changesuccess,
      passwordnotmatch,
      minilength,
      maxlength,
      uppercase,
      lowercase,
      digits,
    } = this.state;
    return (
      <div className="adminwrapper">
        <div className="adminform-wrapper">
          <h1>Change password</h1>
          {wrongpassword && (
            <div className="alert alert-danger" role="alert">
              Wrong old passowrd!
            </div>
          )}
          {changesuccess && (
            <div className="alert alert-success" role="alert">
              Password has been changed successfully!
            </div>
          )}
          {passwordnotmatch && (
            <div className="alert alert-danger" role="alert">
              New password and confirmed passoword not match!
            </div>
          )}
          {minilength && (
            <div className="alert alert-danger" role="alert">
              Minimum length 8!
            </div>
          )}
          {maxlength && (
            <div className="alert alert-danger" role="alert">
              Maxmum length 20!
            </div>
          )}
          {uppercase && (
            <div className="alert alert-danger" role="alert">
              Must have uppercase letters!
            </div>
          )}
          {lowercase && (
            <div className="alert alert-danger" role="alert">
              Must have lowercase letters!
            </div>
          )}
          {digits && (
            <div className="alert alert-danger" role="alert">
              Must have at least 2 digits!
            </div>
          )}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="loginpassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Old Password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="loginpassword">
              <Form.Label>
                New Password &nbsp;&nbsp;*Mini length 8, Max length 20, At least
                one uppercase and lowercase, At least two digits
              </Form.Label>
              <Form.Control
                type="password"
                placeholder="New Password"
                name="newpassword"
                value={this.state.newpassword}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="loginpassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="confirmpassword"
                value={this.state.confirmpassword}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <div className="createAccount">
              <button type="submit">Submit</button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
