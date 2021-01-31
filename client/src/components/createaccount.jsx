import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default class Createaccount extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem("token");
    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }

    this.state = {
      email: "",
      confirmemail: "",
      password: "",
      companyname: "",
      emailExists: false,
      createsuccess: false,
      sameemail: false,
      loggedIn,
      loggedInstatus: true,
      wrongemail: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
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

  handleSubmit = (e) => {
    e.preventDefault();

    this.setState({
      emailExists: false,
      createsuccess: false,
      sameemail: false,
      wrongemail: false,
    });

    const data = {
      email: this.state.email,
      confirmemail: this.state.confirmemail,
      password: this.state.password,
      companyname: this.state.companyname,
    };

    axios
      .post("http://localhost:8080/checkemail", data)
      .then((res) => {
        if (data.email === data.confirmemail) {
          if (res.data.message === "Account has been created") {
            this.setState({
              emailExists: true,
            });
          } else if (
            res.data.message === "Wrong email"
          ) {
            this.setState({
              wrongemail: true,
            });
          }
          else if (res.data.message === "Account can be created") {
            axios.post("http://localhost:8080/create", data).then((res) => {
              this.setState({
                createsuccess: true,
              });
            });
          }
        }
        else {
          this.setState({
            sameemail: true,
          });
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

  handleClick() {
    axios
      .get("http://localhost:8080/generatepasswords")
      .then((res) => {
        this.setState((state) => ({
          password: res.data,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/" />;
    }
    if (this.state.loggedInstatus === false) {
      return <Redirect to="/twofactorauth" />;
    }
    const { emailExists, createsuccess, sameemail, wrongemail } = this.state;
    return (
      <div className="adminwrapper">
        <div className="adminform-wrapper">
          <h1>Register</h1>
          <p>Create a new account for the researcher</p>
          {emailExists && (
            <div className="alert alert-danger" role="alert">
              Email has been registered!
            </div>
          )}
          {wrongemail && (
            <div className="alert alert-danger" role="alert">
              Wrong email!
            </div>
          )}
          {createsuccess && (
            <div className="alert alert-success" role="alert">
              Register successfully!
            </div>
          )}
          {sameemail && (
            <div className="alert alert-danger" role="alert">
              Email should be the same!
            </div>
          )}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="loginemail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={this.state.email}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="loginemail">
              <Form.Label>Confirm Email</Form.Label>
              <Form.Control
                type="confirmemail"
                placeholder="Email"
                name="confirmemail"
                value={this.state.confirmemail}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="createpassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                required
              />
            </Form.Group>
            <div className="passwordbutton">
              <Button onClick={this.handleClick}>Generate Password</Button>
            </div>
            <Form.Group className="loginemail">
              <Form.Label>Data Access Permission</Form.Label>
              <Form.Control
                type="companyname"
                placeholder="Data Access Permission"
                name="companyname"
                value={this.state.companyname}
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
