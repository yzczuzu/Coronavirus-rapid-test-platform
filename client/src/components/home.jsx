import React, { Component } from "react";
import Coronaimg from "../components/image/corona.jpg";
import { CardDeck, Card, Button } from "react-bootstrap";
import { Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";
import axios from "axios";

export default class Admin extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem("token");
    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }

    this.state = {
      loggedIn,
      email: "",
      loggedInstatus: true,
    };
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

      const data = {
        email: decoded.result.email,
      };

      axios
        .post("http://localhost:8080/removecode", data)
        .then((res) => {
          console.log("code remove");
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
      <div className="col d-flex justify-content-center">
        <div className="card-wrapper">
          <CardDeck>
            <Card className="text-center">
              <Card.Img variant="top" src={Coronaimg} />
              <Card.Body>
                <Card.Title>Corona Raid Test Data</Card.Title>
                <Card.Text>
                  Click the button to access Corona Rapid Test Data
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button href="/coronadata">Go somewhere</Button>
              </Card.Footer>
            </Card>
            <Card className="text-center">
              <Card.Img variant="top" src={Coronaimg} />
              <Card.Body>
                <Card.Title>National Credit Register</Card.Title>
                <Card.Text>
                  BKR registration when taking out a mortgage
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary">Go somewhere</Button>
              </Card.Footer>
            </Card>
            <Card className="text-center">
              <Card.Img variant="top" src={Coronaimg} />
              <Card.Body>
                <Card.Title>Certificate of conduct</Card.Title>
                <Card.Text>A VOG for a new job</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Button variant="primary">Go somewhere</Button>
              </Card.Footer>
            </Card>
          </CardDeck>
        </div>
      </div>
    );
  }
}
