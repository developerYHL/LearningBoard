import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import CKEditor from "ckeditor4-react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import { } from "jquery.cookie";

class BoardWriteForm extends Component {
  state = {
    data: ""
  };

  componentDidMount() {
    if (this.props.location.query !== undefined) {
      this.boardTitle.value = this.props.location.query.title;
    }
  }

  componentWillMount() {
    if (this.props.location.query !== undefined) {
      this.setState({
        data: this.props.location.query.content
      });
    }
  }

  writeBoard = () => {
    let url;
    let send_param;

    const boardTitle = this.boardTitle.value;
    const boardContent = this.state.data;

    if (boardTitle === undefined || boardTitle === "") {
      alert("글 제목을 입력 해주세요.");
      return;
    } else if (boardContent === undefined || boardContent === "") {
      alert("글 내용을 입력 해주세요.");
      return;
    }

    if (this.props.location.query !== undefined) {
      url = "http://localhost:8080/board/update";
      send_param = {
        "_id": this.props.location.query._id,
        "title": boardTitle,
        "content": boardContent
      };
    } else {
      url = "http://localhost:8080/board/write";
      send_param = {
        "_id": $.cookie("login_id"),
        "title": boardTitle,
        "content": boardContent
      };
    }

    axios
      .post(url, send_param)
      .then(returnData => {
        if (returnData.data.message) {
          alert(returnData.data.message);
          window.location.href = "/";
        } else {
          alert("글쓰기 실패");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  onEditorChange = evt => {
    this.setState({
      data: evt.editor.getData()
    });
  };

  render() {
    if ($.cookie("login_id") === undefined) {
      return <Redirect to="/" />
    }

    return (
      <div style={{ margin: 50 }} className="App">
        <h2 className="whiteFont">글쓰기</h2>
        <Form.Control
          type="text"
          style={{ marginBottom: 5 }}
          placeholder="글 제목"
          ref={ref => (this.boardTitle = ref)}
        />
        <CKEditor
          data={this.state.data}
          onChange={this.onEditorChange}
        ></CKEditor>
        <Button style={{ marginTop: 5 }} variant="outline-warning" onClick={this.writeBoard} block>
          저장하기
        </Button>
      </div>
    );
  }
}

export default BoardWriteForm;