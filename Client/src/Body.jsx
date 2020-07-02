import React, { Component } from "react";
import LoginForm from "./LoginForm";
import BoardForm from "./BoardForm";
import BoardWriteForm from "./BoardWriteForm";
import BoardDetail from "./BoardDetail";
import NotFoundPage from "./NotFoundPage";
import { Route, Switch } from "react-router-dom";
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
        <Switch>
          <Route path="/boardWrite" component={BoardWriteForm}></Route>
          <Route path="/board/detail" component={BoardDetail}></Route>
          {this.getResultForm()}
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

export default Body;