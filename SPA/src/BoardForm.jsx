import React, { Component } from "react";
import { Table, Button, ButtonGroup } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import axios from "axios";
import $ from "jquery";
import { } from "jquery.cookie";

class BoardRow extends Component {
    render() {
        return (
            <tr>
                <td>
                    <NavLink
                        to={{ pathname: "/board/detail", query: { _id: this.props._id, writer: this.props.writer } }}
                    >
                        {this.props.createdAt.substring(0, 10)}
                    </NavLink>
                </td>
                <td>
                    <NavLink
                        to={{ pathname: "/board/detail", query: { _id: this.props._id, writer: this.props.writer } }}
                    >
                        {this.props.title}
                    </NavLink>
                </td>
                <td className="whiteFont">
                    {this.props.nickName}
                </td>
            </tr>
        );
    }
}

class BoardForm extends Component {
    state = {
        boardList: [],
        pageButton: []
    };

    componentDidMount() {
        this.getBoardList();
        this.getPageButton();
    }

    getBoardList = (page) => {
        const send_param = {
            _id: $.cookie("login_id"),
            page: page
        };
        axios
            .post("http://localhost:8080/board/getBoardList", send_param)
            .then(returnData => {
                let boardList;
                if (returnData.data.list.length > 0) {
                    const boards = returnData.data.list;
                    boardList = boards.map(item => (
                        <BoardRow
                            _id={item._id}
                            nickName={item.nickName}
                            createdAt={item.createdAt}
                            title={item.title}
                            writer={item.writer}
                        ></BoardRow>
                    ));
                    this.setState({
                        boardList: boardList
                    });
                } else {
                    boardList = (
                        <tr>
                            <td colSpan="3" className="whiteFont">작성한 게시글이 존재하지 않습니다.</td>
                        </tr>
                    );
                    this.setState({
                        boardList: boardList
                    });
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    getPageButton = () => {
        axios
            .get("http://localhost:8080/board/getLastPage")
            .then(returnData => {
                let pageButton = [];
                for (let i = 1; i <= returnData.data.count; i++) {
                    pageButton.push(
                        <Button
                            style={{ margin: "5px" }}
                            onClick={this.getBoardList.bind(
                                null,
                                i
                            )}
                            variant="secondary"
                            type="button"
                        >
                            {i}
                        </Button>
                    );
                }
                this.setState({
                    pageButton: pageButton
                })
            })
            .catch(err => {
                console.log(err);
            });
    };

    render() {
        return (
            <div>
                <div style={{ margin: "50px" }}>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th className="whiteFont">날짜</th>
                                <th className="whiteFont">글 제목</th>
                                <th className="whiteFont">작성자</th>
                            </tr>
                        </thead>
                        <tbody>{this.state.boardList}</tbody>
                    </Table>
                    <div>
                        <ButtonGroup>
                            {this.state.pageButton}
                        </ButtonGroup>
                    </div>
                </div>
            </div>
        );
    }
}

export default BoardForm;