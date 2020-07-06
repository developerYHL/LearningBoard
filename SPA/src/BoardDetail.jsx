import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import { NavLink, Redirect } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import BoardComment from "./BoardComment";
import { } from "jquery.cookie";
import "./css/style.css";

class BoardDetail extends Component {
    state = {
        board: {},
        boardWriter: "",
        likeCnt: 0,
        badCnt: 0,
        isModalOpen: false
    };

    componentWillMount() {
        if (this.props.location.query !== undefined) {
            $.removeCookie("board_id");
            $.cookie("board_id", this.props.location.query._id, { expires: 1 });
        }
    }

    componentDidMount() {
        this.getDetail();
    }

    boardStateButton = (writer) => {
        if (writer === $.cookie("login_id")) {
            return (
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
                        <Button block variant="outline-warning">
                            글 수정
                                </Button>
                    </NavLink>
                    <Button
                        block
                        variant="outline-warning"
                        onClick={this.deleteBoard.bind(
                            null,
                            $.cookie("board_id")
                        )}
                    >
                        글 삭제
                            </Button>
                </div>
            )
        }
    }

    getDetail = () => {
        const send_param = {
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
                    this.setState({
                        boardWriter: returnData.data.board.writer,
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

    deleteBoard = _id => {
        const send_param = {
            _id
        };
        if (window.confirm("정말 삭제하시겠습니까?")) {
            axios
                .post("http://localhost:8080/board/delete", send_param)
                .then(returnData => {
                    if (returnData.data.message)
                        alert(returnData.data.message);

                    window.location.href = "/";
                })
                .catch(err => {
                    alert("글 삭제 실패");
                });
        }
    };

    addAssessmentCnt = (_id, isLike) => {
        const send_param = {
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
                alert("글 추천 실패");
            });
    };

    render() {
        if ($.cookie("login_id") === undefined || $.cookie("board_id") === undefined) {
            return <Redirect to="/" />
        }

        const buttonStyle = {
            margin: "10px",
            float: "right"
        }

        return (
            <div style={{ margin: "50px" }}>
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
                    {this.boardStateButton(this.state.boardWriter)}
                </div>
                <BoardComment
                    boardID={$.cookie("board_id")}
                    loginID={$.cookie("login_id")}
                ></BoardComment>
            </div>
        );
    }
}

export default BoardDetail;