import React, { Component } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";

export default class Forgotpassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      wrongemail: false,
      passwordreset: false,
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
      passwordreset: false,
    });

    const data = {
      email: this.state.email,
    };

    axios
      .post("http://localhost:8080/checkregisteremail", data)
      .then((res) => {
        if (res.data.message === "Wrong email") {
          this.setState({
            wrongemail: true,
          });
        }
        if (res.data.message === "Password can be reset") {
          axios
            .post("http://localhost:8080/resetpassword", data)
            .then((res) => {
              this.setState({
                passwordreset: true,
              });
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
    const { wrongemail, passwordreset } = this.state;
    return (
      <div className="loginwrapper">
        <div className="loginform-wrapper">
          <h1>Forgot password</h1>
          <p>
            Please enter your registered email, New passoword will be sent your
            email
          </p>
          {wrongemail && (
            <div className="alert alert-danger" role="alert">
              Wrong Email!
            </div>
          )}
          {passwordreset && (
            <div className="alert alert-success" role="alert">
              Password has been reset successfully!
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
            <div className="createAccount">
              <button type="submit">Submit</button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}
