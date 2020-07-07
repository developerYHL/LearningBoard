import React, { Component } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { WithContext as ReactTags } from 'react-tag-input';
import axios from "axios";
import "./css/style.css";

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class BoardComment extends Component {
    state = {
        commentList: [],
        tags: [],
        suggestions: [],
        update_Id: "",
        isComment: false,
        isModalOpen: false
    };

    componentDidMount() {
        this.getCommentList();
    }

    commentFormatter = (_id, writer, text, nickName, tag) => {
        let tagButtons = [];
        let updateButtons;

        if (tag !== undefined) {
            for (const item of tag) {
                tagButtons.push(
                    <span
                        className={"tagStyle"}
                    >{item}
                    </span>
                )
            }
        }

        if (this.props.loginID === writer) {
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
                        onClick={this.getComment.bind(
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

    getComment = _id => {
        const send_param = {
            _id
        };
        axios
            .post("http://localhost:8080/comment/detail", send_param)
            .then(returnData => {
                if (returnData.data.comment) {
                    this.setState({
                        isModalOpen: true,
                        update_Id: returnData.data.comment._id
                    });
                    this.updateContent.value = returnData.data.comment.content
                }
            })
            .catch(err => {
                console.log(err);
            });
    };

    getCommentList = () => {
        const send_param = {
            board: this.props.boardID
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
                        return { id: item, text: item }
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

    writeComment = (_id, text) => {
        let url;
        let send_param;
        let tagName;
        if (_id === null) {
            url = "http://localhost:8080/comment/write";
            send_param = {
                writer: this.props.loginID,
                board: this.props.boardID,
                content: text
            };

            tagName = this.state.tags.map(item => item.id);
            send_param.tag = tagName;
            this.setState({ tags: [] })
        } else {
            if (this.updateContent.value === "") {
                alert("댓글을 입력해주세요.")
                this.updateContent.focus();
                return;
            }
            url = "http://localhost:8080/comment/update";
            send_param = {
                _id: _id,
                content: this.updateContent.value
            };
        }

        axios
            .post(url, send_param)
            .then(returnData => {
                if (returnData.data.message) {
                    window.location.reload();
                    return;
                }
                if (returnData.data.comment) {
                    let commentList = [];
                    if (this.state.isComment) {
                        commentList = this.state.commentList;
                    }

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

    handleDelete = (i) => {
        const { tags } = this.state;
        this.setState({
            tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition = (tag) => {
        const { suggestions } = this.state;
        if (suggestions.indexOf(tag) > -1) {
            this.setState(state => ({ tags: [...state.tags, tag] }));
        } else {
            this.writeComment(null, tag.text);
        }
    };

    handleDrag = (tag, currPos, newPos) => {
        const tags = this.state.tags;
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        this.setState({ tags: newTags });
    }

    handleCloseModal = () => {
        this.setState({ isModalOpen: false });
    };

    render() {
        const { tags, suggestions } = this.state;
        return (
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
        );
    }
}

export default BoardComment;