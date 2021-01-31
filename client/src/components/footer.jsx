import React, { Component } from "react";

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <div className="container">
          <div className="row">
            <p className="col-sm">
              &copy;{new Date().getFullYear()} Corona Rapid Test Data Platform
            </p>
          </div>
        </div>
      </div>
    );
  }
}
