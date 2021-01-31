import React, { Component } from "react";
import { Container, Card, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";

export default class Profile extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem("token");
    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }

    this.state = {
      loggedIn,
      loggedInstatus: true,
      email: "",
      id: "",
      firstname: "",
      lastname: "",
    };
  }

  componentWillMount() {
    const token = localStorage.getItem("token");

    if (token != null) {
      const decoded = jwt_decode(token);

      this.setState({
        email: decoded.result.email,
        id: decoded.result.id,
        firstname: decoded.result.firstname,
        lastname: decoded.result.lastname,
      });

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

  render() {
    if (this.state.loggedIn === false) {
      return <Redirect to="/" />;
    }
    if (this.state.loggedInstatus === false) {
      return <Redirect to="/twofactorauth" />;
    }
    return (
      <Container className="profile">
        <Card.Header className="header-meta">
          <h1 className="text-center">Profile</h1>
        </Card.Header>
        <Card.Body>
          <Table className="table col-md-6 mx-auto">
            <tbody>
              <tr>
                <td>UserId</td>
                <td>{this.state.id}</td>
              </tr>
              <tr>
                <td>Firstname</td>
                <td>{this.state.firstname}</td>
              </tr>
              <tr>
                <td>Lastname</td>
                <td>{this.state.lastname}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{this.state.email}</td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <Link to="/changepassword" variant="link">
                    Change password?
                  </Link>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Container>
    );
  }
}
