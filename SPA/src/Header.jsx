import React, { Component } from "react";
import { Navbar, Button } from "react-bootstrap";
import { NavLink, Redirect } from "react-router-dom";
import $ from "jquery";
import { } from "jquery.cookie";
import "./css/style.css";

class Header extends Component {
  state = {
    buttonDisplay: "none"
  };

  componentDidMount() {
    if ($.cookie("login_id")) {
      this.setState({
        buttonDisplay: "block"
      });
    } else {
      this.setState({
        buttonDisplay: "none"
      });
    }
  }

  logout = () => {
    if ($.cookie("login_id")) {
      $.removeCookie("login_id");
      alert("로그아웃 되었습니다!");
      window.location.href = "/";
    } else {
      return <Redirect to="/" />
    }
  };

  render() {
    const buttonStyle = {
      margin: "0px 10px 0px 10px",
      display: this.state.buttonDisplay
    };

    return (
      <div className="headerBg">
        <Navbar>
          <Navbar.Brand href="/">
            <span className="textStyle">한성 R{"&"}D</span>
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
            <NavLink to="/">
              <Button style={buttonStyle} variant="outline-warning">
                글목록
              </Button>
            </NavLink>
            <NavLink to="/boardWrite">
              <Button style={buttonStyle} variant="outline-warning">
                글쓰기
              </Button>
            </NavLink>
            <Button style={buttonStyle} onClick={this.logout} variant="outline-warning">
              로그아웃
            </Button>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Header;
