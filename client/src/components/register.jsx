import React, { Component } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { Link } from "react-router-dom";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      firstName: "",
      lastName: "",
      phonenumber: "",
      companyname: "",
      companyurl: "",
      companyposition: "",
      verifyemail: false,
      emailSent: false,
      sentSuccess: false,
      isVerified: false,
      googlerecaptcha: false,
      verifyFail: false,
      correct: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmitForm = this.handleSubmitForm.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    localStorage.clear();

    const data = {
      id: this.props.match.params.id,
    };

    this.setState({
      verifyFail: false,
      correct: false,
      isVerified: false,
    });

    axios
      .post("http://localhost:8080/checkactiveemail", data)
      .then((res) => {
        if (res.data.message === "Email is null") {
          this.setState({
            verifyFail: true,
          });
        } else {
          this.setState({
            correct: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onChange() {
    this.setState({
      isVerified: true,
    });
    console.log("capcha successfully loaded");
  }

  handleSubmitForm = (event) => {
    event.preventDefault();

    const dataid = {
      id: this.props.match.params.id,
    };

    axios
      .post("http://localhost:8080/checkactiveemail", dataid)
      .then((res) => {

        const data = {
          email: res.data.data,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          phonenumber: this.state.phonenumber,
          companyname: this.state.companyname,
          companyurl: this.state.companyurl,
          companyposition: this.state.companyposition,
        };

        this.setState({
          verifyemail: false,
          emailSent: false,
          sentSuccess: false,
          googlerecaptcha: false,
        });

        axios
          .post("http://localhost:8080/checkform", data)
          .then((res) => {
            if (this.state.isVerified === true) {
              if (res.data.message === "Email is not verified") {
                this.setState({
                  verifyemail: true,
                });
              } else if (
                res.data.message === "Your data has been sent to admin"
              ) {
                this.setState({
                  emailSent: true,
                });
              } else if (res.data.message === "Email can be sent") {
                axios
                  .post("http://localhost:8080/sendform", data)
                  .then((res) => {
                    this.setState({
                      sentSuccess: true,
                    });
                  });
              }
            } else {
              this.setState({
                googlerecaptcha: true,
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
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
    const {
      verifyemail,
      emailSent,
      sentSuccess,
      googlerecaptcha,
      verifyFail,
      correct,
    } = this.state;
    return (
      <div>
        {correct && (
          <div className="wrapper">
            <div className="form-wrapper">
              <h1>Account Application</h1>
              <p>
                Your information will be sent to the administrator. If the
                information is correct, you will receive a login account and
                password.
              </p>
              {verifyemail && (
                <div className="alert alert-danger" role="alert">
                  Please verify your email!
                </div>
              )}
              {emailSent && (
                <div className="alert alert-danger" role="alert">
                  Your data has been sent to admin!
                </div>
              )}
              {sentSuccess && (
                <div className="alert alert-success" role="alert">
                  Your data has been sent successfully!
                </div>
              )}
              {googlerecaptcha && (
                <div className="alert alert-danger" role="alert">
                  Please click the box
                </div>
              )}
              <Form onSubmit={this.handleSubmitForm}>
                <Form.Group className="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="First Name"
                    name="firstName"
                    value={this.state.firstName}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Last Name"
                    name="lastName"
                    value={this.state.lastName}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="phonenumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Phone Number"
                    name="phonenumber"
                    value={this.state.phonenumber}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="lastName">
                  <Form.Label>Company/Institution Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Company/Institution Name"
                    name="companyname"
                    value={this.state.companyname}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="phonenumber">
                  <Form.Label>URL for Overview Employees</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Company/Institution URL"
                    name="companyurl"
                    value={this.state.companyurl}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="lastName">
                  <Form.Label>Company/Institution Position</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Company/Institution Position"
                    name="companyposition"
                    value={this.state.companyposition}
                    onChange={this.handleChange}
                    required
                  />
                </Form.Group>
                <p>
                  Please click the box below to help assure that a person and
                  not an automated program is submitting this application.
                </p>
                <ReCAPTCHA
                  className="g-recaptcha"
                  sitekey="6Lfjp-EZAAAAAKs2qPIVg38Nv3XWrAlF9ekYwZNL"
                  render="explicit"
                  onChange={this.onChange}
                />
                <Form.Check
                  required
                  label={
                    <h6>
                      Please note that any personal information you provide will
                      be treated in accordance with the{" "}
                      <Link to="/termsandconditions" target="_blank">
                        {" "}
                        CRTD Platform Terms and Conditions{" "}
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacypolicy" target="_blank">
                        {" "}
                        CRTD Platform Privacy Notice.{" "}
                      </Link>
                    </h6>
                  }
                />
                <div className="createAccount">
                  <button variant="primary" type="submit">
                    Send
                  </button>
                </div>
              </Form>
            </div>
          </div>
        )}
        {verifyFail && (
          <div className="verify">
            <h1>Email is not verified!</h1>
          </div>
        )}
      </div>
    );
  }
}
