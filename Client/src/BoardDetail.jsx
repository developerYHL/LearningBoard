import React, { Component } from "react";
import { Table, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import {} from "jquery.cookie";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

class BoardDetail extends Component {
    state = {
        board: {},
        buttonDisplay: "none",
        likeCnt: 0,
        badCnt: 0
    };

    componentDidMount() {
        this.getDetail();
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
                    if(returnData.data.message){
                        alert(returnData.data.message);
                    }
                    else{
                        if(returnData.data.isLike) {
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
                if(returnData.data) {
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
        return <div style={divStyle}>
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
        </div>;
    }
}

export default BoardDetail;