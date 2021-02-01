import React, { Component } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";

export default class Link extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      verifyFail: false,
      verifySuccess: false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    localStorage.clear();

    this.setState({
      verifyFail: false,
      verifySuccess: false,
    });

    const data = {
      id: this.props.match.params.id,
    };

    axios
      .post("http://localhost:8080/checkactiveemail", data)
      .then((res) => {
        if (res.data.message === "Email is null") {
          this.setState({
            verifyFail: true,
          });
        }
        if (
          res.data.message === "Email is not verified" ||
          res.data.message === "Email is verified"
        ) {
          axios
            .post("http://localhost:8080/verifylink", data)
            .then((res) => {
              this.setState({
                verifySuccess: true,
              });
            })
            .catch((err) => {
              console.log(err.data);
            });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleClick() {
    const data = {
      id: this.props.match.params.id,
    };
    axios
      .post("http://localhost:8080/checkactiveemail", data)
      .then((res) => {
        if (res.data.message === "Email is verified") {
          this.props.history.push(`/register/${this.props.match.params.id}`);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { verifyFail, verifySuccess } = this.state;
    return (
      <div>
        {verifySuccess && (
          <div className="verify">
            <h1>Verify Successfully!</h1>
            <h1>
              {" "}
              Please click the link to apply for a new account!
              <Button onClick={this.handleClick} variant="link">
                Register here!
              </Button>
            </h1>
          </div>
        )}
        {verifyFail && (
          <div className="verify">
            <h1>Verify Failed!</h1>
          </div>
        )}
      </div>
    );
  }
}
