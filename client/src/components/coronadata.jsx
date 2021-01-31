import React, { Component } from "react";
import axios from "axios";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory, {
  PaginationProvider,
  PaginationTotalStandalone,
} from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import { Redirect } from "react-router-dom";
import jwt_decode from "jwt-decode";

export default class Testcorona extends Component {
  constructor(props) {
    super(props);

    const token = localStorage.getItem("token");
    let loggedIn = true;
    if (token == null) {
      loggedIn = false;
    }

    this.state = {
      coronadata: [],
      loggedIn,
      loggedInstatus: true,
    };
  }

  componentDidUpdate() {
    this.componentDidMount();
  }

  componentDidMount() {
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

    const decoded = jwt_decode(token);
    const data = [];

    if (decoded.result.companyname === "Admin") {
      axios
        .get(
          "https://dynamic.dimml.io/results?dimml.concept=//dev.53e359d9f895@ds_stream_53e359d9f895.api"
        )
        .then((res) => {
          this.setState({ coronadata: res.data.returned });
        });
    }

    if (decoded.result.companyname === "Fontys") {
      axios
        .get(
          "https://dynamic.dimml.io/results?dimml.concept=//dev.53e359d9f895@ds_stream_53e359d9f895.api"
        )
        .then((res) => {
          var i;
          for (i = 0; i < res.data.returned.length; i++) {
            if (res.data.returned[i].testlocation === "Fontys") {
              data.push(res.data.returned[i]);
            }
          }
          this.setState({ coronadata: data });
        });
    }

    if (decoded.result.companyname === "Airport") {
      axios
        .get(
          "https://dynamic.dimml.io/results?dimml.concept=//dev.53e359d9f895@ds_stream_53e359d9f895.api"
        )
        .then((res) => {
          var i;
          for (i = 0; i < res.data.returned.length; i++) {
            if (res.data.returned[i].testlocation === "Airport") {
              data.push(res.data.returned[i]);
            }
          }
          this.setState({ coronadata: data });
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

    const { coronadata } = this.state;
    const { SearchBar } = Search;
    const columns = [
      { dataField: "idTestdata", text: "Test Data ID", sort: true },
      { dataField: "datetime", text: "Test Date Time", sort: true },
      { dataField: "result", text: "Result", sort: true },
      { dataField: "testlocation", text: "Test Location", sort: true },
    ];

    const sizePerPageRenderer = ({
      options,
      currSizePerPage,
      onSizePerPageChange,
    }) => (
      <div className="btn-group" role="group">
        {options.map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn ${isSelect ? "btn-secondary" : "btn-warning"}`}
            >
              {option.text}
            </button>
          );
        })}
      </div>
    );

    const options = {
      sizePerPageRenderer,
      totalSize: coronadata.length,
    };

    return (
      <PaginationProvider pagination={paginationFactory(options)}>
        {({ paginationProps, paginationTableProps }) => (
          <div>
            <div className="standalone-wrapper">
              <PaginationTotalStandalone {...paginationProps} />
            </div>
            <div className="datatable">
              <ToolkitProvider
                keyField="idTestdata"
                data={coronadata}
                columns={columns}
                search
              >
                {(props) => (
                  <div>
                    <div className="search-wrapper">
                      <SearchBar {...props.searchProps} />
                    </div>
                    <div>
                      <BootstrapTable
                        keyField="idTestdata"
                        {...paginationTableProps}
                        {...props.baseProps}
                      />
                    </div>
                  </div>
                )}
              </ToolkitProvider>
            </div>
          </div>
        )}
      </PaginationProvider>
    );
  }
}
