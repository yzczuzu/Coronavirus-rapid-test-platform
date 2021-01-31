import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";
import jwt_decode from "jwt-decode";

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      headerstyle: false,
      headerstyle2: false,
      headerstyle3: false,
      headerstyle4: false,
      companyname: "",
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const token = localStorage.getItem("token");

    if (window.location.toString().indexOf("verifylink") === 22) {
      this.setState({
        headerstyle1: true,
      });
    } else if (window.location.toString().indexOf("register") === 22) {
      this.setState({
        headerstyle1: true,
      });
    } else if (
      window.location.pathname === "/privacypolicy" ||
      window.location.pathname === "/termsandconditions"
    ) {
      this.setState({
        headerstyle1: true,
      });
    } else if (window.location.pathname === "/twofactorauth") {
      this.setState({
        headerstyle2: true,
      });
    } else if (token != null) {
      const decoded = jwt_decode(token);

      if (decoded.result.companyname === "Admin") {
        this.setState({
          headerstyle4: true,
        });
      } else {
        this.setState({
          headerstyle3: true,
        });
      }
    } else {
      this.setState({
        headerstyle2: true,
      });
    }
  }

  handleClick() {
    localStorage.removeItem("token");
  }

  render() {
    const {
      headerstyle1,
      headerstyle2,
      headerstyle3,
      headerstyle4,
    } = this.state;
    return (
      <Navbar collapseOnSelect expand="lg" variant="dark">
        <Navbar.Brand href="/home">
          Coronavirus Rapid Test Data Platform
        </Navbar.Brand>
        {headerstyle1}

        {headerstyle2 && (
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        )}
        {headerstyle2 && (
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav>
              <Nav.Link onClick={this.handleClick} href="/login">
                Login
              </Nav.Link>
              <Nav.Link onClick={this.handleClick} href="/verifyemail">
                Register
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
        {headerstyle3 && (
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        )}
        {headerstyle3 && (
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav>
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/profile">Profile</Nav.Link>
              <Nav.Link onClick={this.handleClick} href="/">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
        {headerstyle4 && (
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        )}
        {headerstyle4 && (
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto"></Nav>
            <Nav>
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/createaccount">New Account</Nav.Link>
              <Nav.Link href="/profile">Profile</Nav.Link>
              <Nav.Link onClick={this.handleClick} href="/">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
      </Navbar>
    );
  }
}
