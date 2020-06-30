import React, { Component } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { NavLink, Redirect } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { } from "jquery.cookie";
import "./css/style.css";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class BoardDetail extends Component {
    state = {
        board: {},
        commentList: [],
        buttonDisplay: "none",
        likeCnt: 0,
        badCnt: 0,
        isComment: false,
        defaultValue:""
    };

    componentDidMount() {
        if (this.props.location.query !== undefined) {
            $.removeCookie("board_id");
            $.cookie("board_id", this.props.location.query._id);
        }
        this.getDetail();
        this.getCommentList();
    }

    commentFormatter = (_id, text, nickName) => {
        return (
            <tr>
                <th colSpan="2" className="whiteFont">{text}
                    <div>
                        <Button
                            style={{ float: "right" }}
                            variant="outline-warning"
                            onClick={this.deleteBoard.bind(
                                null,
                                $.cookie("board_id")
                            )}
                        >삭제
                    </Button>
                        <Button
                            style={{ float: "right" }}
                            variant="outline-warning"
                            onClick={this.deleteComment.bind(
                                null,
                                $.cookie("board_id")
                            )}
                        >수정
                    </Button>
                    </div>
                </th>
                <th colSpan="2" className="whiteFont">{nickName}</th>
            </tr>
        );
    };

    deleteComment = _id => {
        const send_param = {
            headers,
            _id
        };
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios
                .post("http://localhost:8080/comment/delete", send_param)
                .then(returnData => {
                    alert("댓글이 삭제 되었습니다.");
                    //window.location.href = "/";
                })
                .catch(err => {
                    console.log(err);
                    alert("댓글 삭제 실패");
                });
        }
    };

    deleteBoard = _id => {
        const send_param = {
            headers,
            _id
        };
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios
                .post("http://localhost:8080/board/delete", send_param)
                //정상 수행
                .then(returnData => {
                    alert("게시글이 삭제 되었습니다.");
                    window.location.href = "/";
                })
                //에러
                .catch(err => {
                    console.log(err);
                    alert("글 삭제 실패");
                });
        }
    };

    addAssessmentCnt = (_id, isLike) => {
        const send_param = {
            headers,
            _id,
            isLike,
            writer: $.cookie("login_id")
        };
        axios
            .post("http://localhost:8080/board/addAssessmentCnt", send_param)
            .then(returnData => {
                if (returnData.data) {
                    if (returnData.data.message) {
                        alert(returnData.data.message);
                    }
                    else {
                        if (returnData.data.isLike) {
                            this.setState({
                                likeCnt: this.state.likeCnt + 1
                            });
                        } else {
                            this.setState({
                                badCnt: this.state.badCnt + 1
                            });
                        }
                    }
                }
            })
            .catch(err => {
                console.log(err);
                alert("글 추천 실패");
            });
    };

    getDetail = () => {
        const send_param = {
            headers,
            _id: $.cookie("board_id")
        };

        axios
            .post("http://localhost:8080/board/getAssessmentCnt", send_param)
            .then(returnData => {
                if (returnData.data) {
                    this.setState({
                        likeCnt: returnData.data.likeCnt,
                    });
                    this.setState({
                        badCnt: returnData.data.badCnt,
                    });
                }
            })
            .catch(err => {
                console.log(err);
                alert("글 추천 실패");
            });

        axios
            .post("http://localhost:8080/board/detail", send_param)
            .then(returnData => {
                if (returnData.data) {
                    if ($.cookie("login_id") === returnData.data.board.writer) {
                        this.setState({
                            buttonDisplay: "block"
                        });
                    } else {
                        this.setState({
                            buttonDisplay: "none"
                        });
                    }
                    this.setState({
                        board: {
                            title: returnData.data.board.title,
                            content: returnData.data.board.content
                        }
                    });
                } else {
                    alert("글 상세 조회 실패");
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    getCommentList = () => {
        const send_param = {
            headers,
            board: $.cookie("board_id")
        };
        axios
            .post("http://localhost:8080/comment/getCommentList", send_param)
            .then(returnData => {
                let commentList;
                if (returnData.data.list.length > 0) {
                    const comments = returnData.data.list;
                    commentList = comments.map(item => (
                        this.commentFormatter(item._id, item.content, item.nickName)
                    ));
                    this.setState({
                        commentList: commentList,
                        isComment: true
                    });
                } else {
                    commentList = this.commentFormatter("작성한 댓글이 존재하지 않습니다.");
                    this.setState({
                        commentList: commentList,
                        isComment: false
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    writeComment = () => {
        if(this.commentContent.value === "") {
            alert("댓글을 입력해주세요.")
            this.commentContent.focus();
            return;
        }
        const send_param = {
            headers,
            writer: $.cookie("login_id"),
            board: $.cookie("board_id"),
            content: this.commentContent.value
        };
        axios
            .post("http://localhost:8080/comment/write", send_param)
            .then(returnData => {
                if (returnData.data.comment) {
                    let commentList = [];
                    if (this.state.isComment) {
                        commentList = this.state.commentList;
                    }
                    commentList.push(
                        this.commentFormatter(returnData.data.comment._id, returnData.data.comment.content, returnData.data.comment.nickName)
                    );
                    this.setState({
                        commentList: commentList,
                        isComment: true
                    });
                    this.commentContent.value = "";
                } else {
                    alert("댓글 실패");
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        if($.cookie("login_id") === undefined || $.cookie("board_id") === undefined) {
            return <Redirect to="/"/>
        }

        const divStyle = {
            margin: 50
        };
        const marginBottom = {
            marginBottom: 5,
            display: this.state.buttonDisplay
        };

        const buttonStyle = {
            margin: "10px",
            float: "right"
        }
        return (
            <div style={divStyle}>
                <div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className="whiteFont">
                                    {this.state.board.title}
                                    <Button
                                        style={buttonStyle}
                                        variant="outline-warning"
                                        onClick={this.addAssessmentCnt.bind(
                                            null,
                                            $.cookie("board_id"),
                                            false
                                        )}
                                    >싫어요 {this.state.badCnt}
                                    </Button>
                                    <Button
                                        style={buttonStyle}
                                        variant="outline-warning"
                                        onClick={this.addAssessmentCnt.bind(
                                            null,
                                            $.cookie("board_id"),
                                            true
                                        )}
                                    >좋아요 {this.state.likeCnt}
                                    </Button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="whiteFont"
                                    dangerouslySetInnerHTML={{
                                        __html: this.state.board.content
                                    }}
                                ></td>
                            </tr>
                        </tbody>
                    </Table>
                    <div>
                        <NavLink
                            to={{
                                pathname: "/boardWrite",
                                query: {
                                    title: this.state.board.title,
                                    content: this.state.board.content,
                                    _id: $.cookie("board_id")
                                }
                            }}
                        >
                            <Button block style={marginBottom} variant="outline-warning">
                                글 수정
                            </Button>
                        </NavLink>
                        <Button
                            block
                            style={marginBottom}
                            variant="outline-warning"
                            onClick={this.deleteBoard.bind(
                                null,
                                $.cookie("board_id")
                            )}
                        >
                            글 삭제
                        </Button>
                    </div>
                </div>
                <div>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th colSpan="2" width="400px" className="whiteFont">댓글</th>
                                <th colSpan="2" className="whiteFont">작성자</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.commentList}
                        </tbody>
                    </Table>
                    <Form.Control
                        type="text"
                        placeholder="댓글을 입력해주세요."
                        ref={ref => (this.commentContent = ref)}
                    />
                    <Button style={buttonStyle} variant="outline-warning" onClick={this.writeComment}>
                        저장하기
                    </Button>
                </div>
            </div>
        );
    }
}

export default BoardDetail;