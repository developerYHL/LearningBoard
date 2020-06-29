import React, { Component } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { NavLink } from "react-router-dom";
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
        badCnt: 0
    };

    componentDidMount() {
        this.getDetail();
        this.getCommentList();
    }

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
            _id: this.props.location.query._id
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
                    if ($.cookie("login_id") == returnData.data.board.writer) {
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
            board: this.props.location.query._id
        };
        axios
            .post("http://localhost:8080/comment/getCommentList", send_param)
            .then(returnData => {
                let commentList;
                if (returnData.data.list.length > 0) {
                    const comments = returnData.data.list;
                    commentList = comments.map(item => (
                        <tr>
                            <td colSpan="2" className="whiteFont">{item.content}</td>
                        </tr>
                    ));
                    this.setState({
                        commentList: commentList
                    });
                } else {
                    commentList = (
                        <tr>
                            <td colSpan="2" className="whiteFont">작성한 댓글이 존재하지 않습니다.</td>
                        </tr>
                    );
                    this.setState({
                        commentList: commentList
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    writeComment = async() => {
        if(this.commentContent.value === "") {
            alert("댓글을 입력해주세요.")
            this.commentContent.focus();
            return;
        }
        const send_param = {
            headers,
            writer: $.cookie("login_id"),
            board: this.props.location.query._id,
            content: this.commentContent.value
        };
        await axios
            .post("http://localhost:8080/comment/write", send_param)
            .then(returnData => {
                if (returnData.data.comment) {
                    alert(this.state.commentList.length);
                    let commentList = this.state.commentList;
                    commentList.push(
                        <tr>
                            <td colSpan="2" className="whiteFont">{returnData.data.comment.content}</td>
                        </tr>
                    );
                    alert(commentList);
                    this.setState({
                        commentList: commentList
                    });
                } else {
                    alert(returnData.data.comment);
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        if (this.props.location.query === undefined)
            window.location.href = "/";

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
                                            this.props.location.query._id,
                                            false
                                        )}
                                    >싫어요 {this.state.badCnt}
                                    </Button>
                                    <Button
                                        style={buttonStyle}
                                        variant="outline-warning"
                                        onClick={this.addAssessmentCnt.bind(
                                            null,
                                            this.props.location.query._id,
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
                                    _id: this.props.location.query._id
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
                                this.props.location.query._id
                            )}
                        >
                            글 삭제
                    </Button>
                    </div>
                </div>
                <div>
                    {/* 목록들을 List화 시켜서 나오게 해야함 */}
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className="whiteFont">댓글</th>
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