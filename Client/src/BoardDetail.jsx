import React, { Component } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { NavLink, Redirect } from "react-router-dom";
import { WithContext as ReactTags } from 'react-tag-input';
import axios from "axios";
import $ from "jquery";
import { } from "jquery.cookie";
import "./css/style.css";
axios.defaults.withCredentials = true;
const headers = { withCredentials: true };

const KeyCodes = {
    comma: 188,
    enter: 13,
  };

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class BoardDetail extends Component {
    state = {
        tags: [],
        suggestions: [],
         board: {},
         commentList: [],
         buttonDisplay: "none",
         likeCnt: 0,
         badCnt: 0,
         isComment: false,
         isModalOpen: false,
         update_Id: ""
    };

    handleDelete = (i) => {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition = (tag) => {
        const { suggestions } = this.state;
        if(suggestions.indexOf(tag) > -1){
            this.setState(state => ({ tags: [...state.tags, tag] }));
        } else {
            this.writeComment(null, tag.text);
        }
    };

    handleDrag = (tag, currPos, newPos) => {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: newTags });
    }

    handleCloseModal = () => {
        this.setState({ isModalOpen: false });
    };

    componentDidMount() {
        if (this.props.location.query !== undefined) {
            $.removeCookie("board_id");
            $.cookie("board_id", this.props.location.query._id, { expires: 1 });
        }
        this.getDetail();
        this.getCommentList();
    }

    commentFormatter = (_id, writer, text, nickName, tag) => {
        let tagButtons = [];
        let updateButtons;

        if(tag !== undefined) {
            for (const item of tag) {
                tagButtons.push(
                    <span
                        style={{
                            color: "#009900",
                            border: "1px solid #ddd",
                            background: "#eee",
                            display: "inline-block",
                            padding: "5px",
                            margin: "0 5px",
                            borderRadius: "2px"
                        }}
                    >{item}
                    </span>
                )
            }
        }

        if ($.cookie("login_id").indexOf(writer) > -1) {
            updateButtons = (
                <div>
                    <Button
                        style={{ float: "right" }}
                        variant="outline-warning"
                        onClick={this.deleteComment.bind(
                            null,
                            _id
                        )}
                    >삭제
                    </Button>
                    <Button
                        style={{ float: "right" }}
                        variant="outline-warning"
                        onClick={this.updateComment.bind(
                            null,
                            _id
                        )}
                    >수정
                    </Button>
                </div>
            )
        }

        return (
            <tr>
                <th colSpan="2" className="whiteFont">
                    {tagButtons}
                    {text}
                    {updateButtons}
                </th>
                <th colSpan="2" className="whiteFont">{nickName}</th>
            </tr>
        );
    };

    updateComment = _id => {
        const send_param = {
            headers,
            _id
        };
        axios
            .post("http://localhost:8080/comment/getComment", send_param)
            .then(returnData => {
                this.setState({
                    isModalOpen: true,
                    update_Id: returnData.data.comment._id
                });
                this.updateContent.value = returnData.data.comment.content
            })
            .catch(err => {
                console.log(err);
            });
    };

    writeComment = (_id, text) => {
        let url;
        let send_param;
        let tagName;
        let suggestions;
        if(_id === null) {
            url = "http://localhost:8080/comment/write";
            send_param = {
                headers,
                writer: $.cookie("login_id"),
                board: $.cookie("board_id"),
                content: text
            };

            tagName = this.state.tags.map(item => item.id);
            send_param.tag = tagName;
        } else {
            if(this.updateContent.value === "") {
                alert("댓글을 입력해주세요.")
                this.updateContent.focus();
                return;
            }
            url = "http://localhost:8080/comment/update";
            send_param = {
                headers,
                _id: _id,
                content: this.updateContent.value
            };
        }

        axios
            .post(url, send_param)
            .then(returnData => {
                if(returnData.data.message) {
                    window.location.reload();
                    return;
                }
                if (returnData.data.comment) {
                    let commentList = [];
                    if (this.state.isComment) {
                        commentList = this.state.commentList;
                    }

                    // 이 부분이 문제인듯
                    commentList.push(
                        this.commentFormatter(
                            returnData.data.comment._id, 
                            returnData.data.comment.writer, 
                            returnData.data.comment.content, 
                            returnData.data.comment.nickName,
                            returnData.data.comment.tag)
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
                    window.location.reload();
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
                let nickNameList = [];
                let suggestions = [];
                if (returnData.data.list.length > 0) {
                    const comments = returnData.data.list;
                    commentList = comments.map(item => {
                        nickNameList.push(item.nickName);
                        return this.commentFormatter(item._id, item.writer, item.content, item.nickName, item.tag);
                    });
                    suggestions = Array.from(new Set(nickNameList)).map((item) => {
                        return {id: item, text: item}
                    });
                    this.setState({
                        suggestions: suggestions,
                        commentList: commentList,
                        isComment: true
                    });
                } else {
                    commentList = this.commentFormatter(null, null, "작성된 댓글이 없습니다.");
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
        const { tags, suggestions } = this.state;
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
                    <ReactTags
                        placeholder="댓글을 입력해주세요."
                        minQueryLength={1}
                        tags={tags}
                        suggestions={suggestions}
                        handleDelete={this.handleDelete}
                        handleAddition={this.handleAddition}
                        handleDrag={this.handleDrag}
                        delimiters={delimiters} />
                    <Modal show={this.state.isModalOpen} onHide={this.handleCloseModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>댓글 수정</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Control
                                type="text"
                                placeholder="댓글을 입력해주세요."
                                ref={ref => (this.updateContent = ref)}
                            />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={this.handleCloseModal}>
                                닫기
                            </Button>
                            <Button variant="primary" onClick={this.writeComment.bind(
                                null,
                                this.state.update_Id
                            )}>
                                저장
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default BoardDetail;