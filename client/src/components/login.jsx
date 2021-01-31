import React, { Component } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      wrongemail: false,
      wrongpassword: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    localStorage.clear();
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({
      wrongemail: false,
      wrongpassword: false,
    });

    const data = {
      email: this.state.email,
      password: this.state.password,
    };
    
    axios
    .post("http://localhost:8080/addloginstatusfalse", data)
    .then((res) => {
      console.log("login status is false");
    })
    .catch((err) => {
      console.log(err);
    });

    axios
      .post("http://localhost:8080/login", data)
      .then((res) => {
        if (res.data.message === "Invalid email") {
          this.setState({
            wrongemail: true,
          });
        }
        if (res.data.message === "Invalid password") {
          this.setState({
            wrongpassword: true,
          });
        }
        if (res.data.message === "login successfully") {
          localStorage.setItem("token", res.data.token);
          this.props.history.push("/twofactorauth");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { wrongemail, wrongpassword } = this.state;
    return (
      <div className="loginwrapper">
        <div className="loginform-wrapper">
          <h1>Login</h1>
          <p>To view information, please log in first</p>
          {wrongemail && (
            <div className="alert alert-danger" role="alert">
              Wrong Email!
            </div>
          )}
          {wrongpassword && (
            <div className="alert alert-danger" role="alert">
              Wrong Password!
            </div>
          )}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="loginemail">
              <Form.Label>Enter Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="loginpassword">
              <Form.Label>Enter Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Link to="/forgotpassword" variant="link">
              Forgot password?
            </Link>
            <div className="createAccount">
              <button type="submit">Submit</button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
