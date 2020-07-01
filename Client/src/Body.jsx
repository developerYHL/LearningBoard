import React, { Component } from "react";
import LoginForm from "./LoginForm.jsx";
import BoardForm from "./BoardForm.jsx";
import BoardWriteForm from "./BoardWriteForm";
import BoardDetail from "./BoardDetail.jsx";
import { Route } from "react-router-dom";
import $ from "jquery";
import {} from "jquery.cookie";

class Body extends Component {
  getResultForm = () => {
    if ($.cookie("login_id")) {
      return <Route exact path="/" component={BoardForm}></Route>;
    } else {
      return <Route exact path="/" component={LoginForm}></Route>;
    }
  };
  
  render() {
    return (
      <div>
        <Route path="/boardWrite" component={BoardWriteForm}></Route>
        <Route path="/board/detail" component={BoardDetail}></Route>
        {this.getResultForm()}
      </div>
    );
  }
}

export default Body;