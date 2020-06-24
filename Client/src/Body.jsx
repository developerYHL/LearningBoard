import React, { Component } from "react";
import LoginForm from "./LoginForm.jsx";
//import BoardForm from "./BoardForm.jsx";
//import BoardWriteForm from "./BoardWriteForm";
//import BoardDetail from "./BoardDetail.jsx";
import { Route } from "react-router-dom";
import $ from "jquery";
import {} from "jquery.cookie";

class Body extends Component {
  render() {
    let resultForm;
    function getResultForm() {
      if ($.cookie("login_id")) {
        // resultForm = <Route exact path="/" component={BoardForm}></Route>;
        return resultForm;
      } else {
        resultForm = <Route exact path="/" component={LoginForm}></Route>;
        return resultForm;
      }
    }
    getResultForm();
    return (
      <div>
        {/* <Route path="/boardWrite" component={BoardWriteForm}></Route> */}
        {/* <Route path="/board/detail" component={BoardDetail}></Route> */}
        {resultForm}
      </div>
    );
  }
}

export default Body;