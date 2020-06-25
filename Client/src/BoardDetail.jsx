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
        board: [],
        buttonDisplay: "none"
    };

    componentDidMount() {
        console.log(this.props.location.query);
        if (this.props.location.query !== undefined) {
            this.getDetail();
        } else {
            window.location.href = "/";
        }
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

    getDetail = () => {
        const send_param = {
            headers,
            _id: this.props.location.query._id
        };

        axios
            .post("http://localhost:8080/board/detail", send_param)
            //정상 수행
            .then(returnData => {
                if (returnData.data.board) {
                    if ($.cookie("login_id") == returnData.data.board.writer) {
                        this.setState({
                            buttonDisplay: "block"
                        });
                    } else {
                        this.setState({
                            buttonDisplay: "none"
                        });
                    }

                    const marginBottom = {
                        marginBottom: 5,
                        display: this.state.buttonDisplay
                    };
                    
                    const board = (
                        <div>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th className="whiteFont">{returnData.data.board.title}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="whiteFont"
                                            dangerouslySetInnerHTML={{
                                                __html: returnData.data.board.content
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
                                            title: returnData.data.board.title,
                                            content: returnData.data.board.content,
                                            _id: this.props.location.query._id
                                        }
                                    }}
                                >
                                    <Button block style={marginBottom}>
                                        글 수정
                                    </Button>
                                </NavLink>
                                <Button
                                    block
                                    style={marginBottom}
                                    onClick={this.deleteBoard.bind(
                                        null,
                                        this.props.location.query._id
                                    )}
                                >
                                    글 삭제
                                </Button>
                            </div>
                        </div>
                    );
                    this.setState({
                        board: board
                    });
                } else {
                    alert("글 상세 조회 실패");
                }
            })
            //에러
            .catch(err => {
                console.log(err);
            });
    };

    //onClick={this.getBoard.bind(null,this.props._id)}
    render() {
        const divStyle = {
            margin: 50
        };
        return <div style={divStyle}>{this.state.board}</div>;
    }
}

export default BoardDetail;