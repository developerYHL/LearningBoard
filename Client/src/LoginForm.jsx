import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import $ from "jquery";
import { } from "jquery.cookie";
import "./css/style.css";

class LoginForm extends Component {
    join = () => {
        const joinEmail = this.joinEmail.value;
        const joinName = this.joinName.value;
        const joinPw = this.joinPw.value;
        const confirmPw = this.confirmPw.value;

        const regexEmail = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        const regexPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

        if (joinEmail === "" || joinEmail === undefined) {
            alert("이메일 주소를 입력해주세요.");
            this.joinEmail.focus();
            return;
        } else if (
            joinEmail.match(regexEmail) === null ||
            joinEmail.match(regexEmail) === undefined
        ) {
            alert("이메일 형식에 맞게 입력해주세요.");
            this.joinEmail.value = "";
            this.joinEmail.focus();
            return;
        }

        if (joinName === "" || joinName === undefined) {
            alert("닉네임을 입력해주세요.");
            this.joinName.focus();
            return;
        }

        if (joinPw === "" || joinPw === undefined ||
            confirmPw === "" || confirmPw === undefined) {
            alert("비밀번호를 입력해주세요.");
            this.joinPw.focus();
            return;
        } else if (
            joinPw.match(regexPw) === null ||
            joinPw.match(regexPw) === undefined
        ) {
            alert("비밀번호를 숫자와 문자, 특수문자 포함 8~16자리로 입력해주세요.");
            this.joinPw.value = "";
            this.joinPw.focus();
            return;
        } else if (joinPw !== confirmPw) {
            alert("비밀번호가 일치하지 않습니다.");
            this.confirmPw.focus();
            return;
        }

        const send_param = {
            email: this.joinEmail.value,
            nickName: this.joinName.value,
            password: this.joinPw.value
        };

        axios.post("http://localhost:8080/member/join", send_param)
            .then(returnData => {
                if (returnData.data.message) {
                    alert(returnData.data.message);
                    if (returnData.data.isEmail) {
                        this.joinEmail.value = "";
                        this.joinEmail.focus();
                    } else if (returnData.data.isNickName) {
                        this.joinName.value = "";
                        this.joinName.focus();
                    } else {
                        this.joinEmail.value = "";
                        this.joinName.value = "";
                        this.joinPw.value = "";
                    }
                } else {
                    alert("서버에 문제가 생겼습니다. 잠시후 시도해주세요.");
                }
            })
            .catch(err => {
                console.log(err);
                alert("서버에 문제가 생겼습니다. 잠시후 시도해주세요.");
            });
    };

    login = () => {
        const loginEmail = this.loginEmail.value;
        const loginPw = this.loginPw.value;

        if (loginEmail === "" || loginEmail === undefined) {
            alert("이메일 주소를 입력해주세요.");
            this.loginEmail.focus();
            return;
        } else if (loginPw === "" || loginPw === undefined) {
            alert("비밀번호를 입력해주세요.");
            this.loginPw.focus();
            return;
        }

        const send_param = {
            email: this.loginEmail.value,
            password: this.loginPw.value
        };

        axios.post("http://localhost:8080/member/login", send_param)
            .then(returnData => {
                if(returnData.data.message) {
                    if (returnData.data._id && returnData.data.email) {
                        $.cookie("login_id", returnData.data._id, { expires: 1 });
                        $.cookie("login_email", returnData.data.email, { expires: 1 });
                        alert(returnData.data.message);
                        window.location.reload();
                    } else {
                        alert(returnData.data.message);
                    }
                } else {
                    alert("서버에 문제가 생겼습니다. 잠시후 시도해주세요.");
                }
            })
            .catch(err => {
                console.log(err);
                alert("서버에 문제가 생겼습니다. 잠시후 시도해주세요.");
            });
    };

    render() {
        const buttonStyle = {
            margin: "20px 0px 30px 0px"
        };
        const formStyle = {
            marginTop: "10px"
        }

        return (
            <Form className="formBg">
                <Form.Group className="formBg" controlId="joinForm">
                    <Form.Label>회원가입</Form.Label>
                    <Form.Control
                        style={formStyle}
                        type="email"
                        maxLength="100"
                        ref={ref => (this.joinEmail = ref)}
                        placeholder="이메일"
                    />
                    <Form.Text className="text-muted" />
                    <Form.Control
                        style={formStyle}
                        type="text"
                        maxLength="20"
                        ref={ref => (this.joinName = ref)}
                        placeholder="닉네임"
                    />
                    <Form.Control
                        style={formStyle}
                        type="password"
                        maxLength="16"
                        ref={ref => (this.joinPw = ref)}
                        placeholder="비밀번호 (영문,숫자,특수문자 8-16자)"
                    />
                    <Form.Control
                        style={formStyle}
                        type="password"
                        maxLength="16"
                        ref={ref => (this.confirmPw = ref)}
                        placeholder="비밀번호 확인"
                    />
                    <Button
                        style={buttonStyle}
                        onClick={this.join}
                        variant="warning"
                        type="button"
                        block
                    >
                        회원가입
                    </Button>
                </Form.Group>

                <Form.Group className="formBg" controlId="loginForm">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                        type="email"
                        maxLength="100"
                        ref={ref => (this.loginEmail = ref)}
                        placeholder="Enter email"
                    />
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        maxLength="20"
                        ref={ref => (this.loginPw = ref)}
                        placeholder="Password"
                    />
                    <Button
                        style={buttonStyle}
                        onClick={this.login}
                        variant="warning"
                        type="button"
                        block
                    >
                        로그인
                    </Button>
                </Form.Group>
            </Form>
        );
    }
}

export default LoginForm;