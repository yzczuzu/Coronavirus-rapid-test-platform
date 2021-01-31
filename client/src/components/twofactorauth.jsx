import React, { Component } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import { Button } from "react-bootstrap";
import jwt_decode from "jwt-decode";
import { Redirect } from "react-router-dom";

export default class Twofactorauth extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem("token");
    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }

    this.state = {
      email: "",
      logincode: "",
      resend: false,
      wrongcode: false,
      loggedIn,
      twofactorauth: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem("token");

    this.setState({
      twofactorauth: false,
    });

    if (token != null) {
      const decoded = jwt_decode(token);
      const data = {
        email: decoded.result.email,
      };

      axios
        .get("http://localhost:8080/checkloginstatus")
        .then((res) => {
          var i;
          for (i = 0; i < res.data.data.length; i++) {
            if (
              res.data.data[i].email === decoded.result.email &&
              res.data.data[i].loginstatus === "true"
            ) {
              this.setState({
                twofactorauth: true,
              });
              this.props.history.push("/login");
              window.location.reload();
            }
          }

          if (this.state.twofactorauth === false) {
            axios
              .post("http://localhost:8080/twofactorauth", data)
              .then((res) => {
                console.log("code sent");
              })
              .catch((err) => {
                console.log(err);
              });
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
      wrongcode: false,
      resend: false,
    });

    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);
    const data = {
      email: decoded.result.email,
    };

    axios
      .post("http://localhost:8080/checklogincode",data)
      .then((res) => {
        if (res.data.data.logincode === this.state.logincode) {
          const token = localStorage.getItem("token");
          if (token != null) {
            axios
              .post("http://localhost:8080/addloginstatustrue", data)
              .then((res) => {
                console.log("login status is true");
              })
              .catch((err) => {
                console.log(err);
              });
          }
          this.props.history.push("/home");
          window.location.reload();
        } else {
          this.setState({
            wrongcode: true,
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
    this.setState({
      resend: false,
    });
    const token = localStorage.getItem("token");
    const decoded = jwt_decode(token);

    const data = {
      email: decoded.result.email,
    };

    axios
      .post("http://localhost:8080/twofactorauth", data)
      .then((res) => {
        this.setState({
          resend: true,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/" />;
    }
    const { resend, wrongcode } = this.state;
    return (
      <div className="codewrapper">
        <div className="codeform-wrapper">
          <h1>Verification code</h1>
          <p>
            The verification code has been sent to you email. Click the Resend
            button to resend code.
          </p>
          {resend && (
            <div className="alert alert-success" role="alert">
              Please check your email!
            </div>
          )}
          {wrongcode && (
            <div className="alert alert-danger" role="alert">
              Please enter the correct code
            </div>
          )}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="twofactorauth">
              <Form.Label>Verification code</Form.Label>
              <Form.Control
                type="logincode"
                placeholder="Verification code"
                name="logincode"
                value={this.state.logincode}
                onChange={this.handleChange}
                required
              />
            </Form.Group>

            <div className="twofactorauthbutton">
              <Button onClick={this.handleClick} variant="outline-primary">
                Resend
              </Button>
            </div>

            <div className="createAccount">
              <button type="submit">Submit</button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
