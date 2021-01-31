import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

export default class Verifylink extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      verifyError: false,
      verifySuccess: false,
      emailExists: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    localStorage.clear();
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({
      verifyError: false,
      verifySuccess: false,
      emailExists: false,
    });

    const email = {
      email: this.state.email,
    };

    axios
      .post("http://localhost:8080/checkverifyemail", email)
      .then((res) => {
        if (res.data.message === "Email is verified") {
          this.setState({
            emailExists: true,
          });
        }
        else if (res.data.message === "Email is not verified") {
          this.setState({
            verifyError: true,
          });
        }
        else if (res.data.message === "Email could be verified") {
          axios
            .post("http://localhost:8080/addverifyemail", email)
            .then((res) => {
              if (res.data.message === "Email sent") {
                this.setState({
                  verifySuccess: true,
                });
              }
            })
            .catch((err) => {
              console.log(err);
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

  render() {
    const { verifyError, verifySuccess, emailExists } = this.state;
    return (
      <div className="verifylinkwrapper">
        <div className="verifylinkform-wrapper">
          <h1>Email validation</h1>
          <p>
            You must verify your email address before signing up for a new
            account.
          </p>
          {verifyError && (
            <div className="alert alert-danger" role="alert">
              Please verify your email!
            </div>
          )}
          {emailExists && (
            <div className="alert alert-danger" role="alert">
              Your email has been verified!
            </div>
          )}
          {verifySuccess && (
            <div className="alert alert-success" role="alert">
              The verification link has been sent to your email!
            </div>
          )}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="email">
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
            <div className="link">
              <Button variant="link" type="submit">
                Plesae click here to verify your email
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
