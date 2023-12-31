import React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/esm/Container";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";

import InputGroup from "react-bootstrap/InputGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

export default function ForgotPassword() {
  const formEmailRef = useRef();
  const formPasswordRef = useRef();
  const formRePasswordRef = useRef();
  const formVerifyCodeRef = useRef();

  const [focused, setFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [password, setPassword] = useState("");

  const [verifycode, setVerifyCode] = useState(false);
  const [isverified, setIsVerified] = useState(false);
  const [email, setEmail] = useState("");

  const [passtype, setPassType] = useState("password");
  const [passtype1, setPassType1] = useState("password");

  const navigate = useNavigate();

  function onChange(e) {
    setPassword(e.target.value);
  }

  function onChangeCode(e) {
    setVerifyCode(e.target.value);
  }

  const checkPassword = (e) => {
    if (password !== e.target.value) {
      e.target.setCustomValidity("Passwords don't match!"); //forcefully set the :invalid pseudo CSS
      setFocused(true);
      setErrorMessage("Passwords don't match!");
    } else {
      e.target.setCustomValidity(""); //restores :valid pseudo CSS
      setErrorMessage("");
      setFocused(false);
    }
  };

  async function submitHandlerEmail(e) {
    e.preventDefault();

    const enteredEmail = formEmailRef.current.value;
    setEmail(enteredEmail);
    // console.log(enteredEmail);

    try {
      const response = await axios.post("/api/wpm/forgot", {
        email: enteredEmail,
      });
      // console.log(response.data);
      if (response.data.valid) {
        setVerifyCode(true);
        setErrorMessage("Please check your email. Verification code sent.");
      } else {
        setVerifyCode(false);
        setErrorMessage("User does not exist.");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function submitHandlerVerification(e) {
    e.preventDefault();

    const enteredCode = formVerifyCodeRef.current.value;
    // console.log(enteredCode);

    try {
      const response = await axios.get("/api/wpm/reset/" + enteredCode);
      // console.log(response.data);
      if (response.data.token === enteredCode) {
        setIsVerified(true);
        setErrorMessage("Reset password verified. Enter new password.");
      } else {
        setErrorMessage("Token not found.");
        setIsVerified(false);
        setVerifyCode(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function submitHandler(e) {
    e.preventDefault();

    // const enteredEmail = JSON.parse(localStorage.getItem("user")).email;
    const enteredPassword = formPasswordRef.current.value;
    // console.log("Hey!", email);

    try {
      await axios.post("/api/wpm/resetpwd", {
        email: email,
        password: enteredPassword,
      });

      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div>
      <Container className="forgot-password-container">
        <Nav.Item>
          <Nav.Link href="/">
            <div className="logo-registration">
              <img
                src="../WPM_Security-logos_white.png"
                alt="Upper left logo"
                align="left"
                width="200"
                height="120"
              />
            </div>
          </Nav.Link>
        </Nav.Item>
        <Card className="forgot-pass-box-card">
          <Card.Header className="card-header text-center text-black">
            <h3 className="m-auto text-white">Forgot Password</h3>
            {errorMessage && <p style={{ color: "yellow" }}>{errorMessage}</p>}
          </Card.Header>
          <Card.Body>
            <Form onSubmit={submitHandlerEmail}>
              <Row className="mb-3">
                <Col>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Control
                      type="email"
                      placeholder="Email Address"
                      ref={formEmailRef}
                      required
                      disabled={verifycode}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <div className="d-grid gap-2">
                    <Button
                      style={{
                        padding: "8px",
                        borderRadius: "15px",
                        backgroundColor: "#C5D5EA",
                      }}
                      variant="light"
                      type="submit"
                      disabled={verifycode}
                    >
                      Submit
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
            {verifycode && (
              <Form onSubmit={submitHandlerVerification}>
                <Row>
                  <Col lg={true}>
                    <Form.Group className="mb-3" controlId="formVerification">
                      <Form.Control
                        type="text"
                        placeholder="Verification code"
                        ref={formVerifyCodeRef}
                        required
                        onChange={onChangeCode}
                        disabled={isverified}
                      />
                    </Form.Group>
                  </Col>
                  <Col>
                    <div className="d-grid">
                      <Button
                        style={{
                          padding: "8px",
                          borderRadius: "15px",
                          backgroundColor: "#C5D5EA",
                        }}
                        variant="light"
                        type="submit"
                        disabled={isverified}
                      >
                        Submit
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            )}
            {isverified && (
              <div>
                <Form onSubmit={submitHandler}>
                  <Row>
                    <Col lg={true}>
                      <Form.Group
                        className="mb-3 text-white"
                        controlId="formPassword"
                      >
                        <Form.Label>New Password</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={passtype}
                            placeholder="Password"
                            ref={formPasswordRef}
                            required
                            onChange={onChange}
                          />
                          <InputGroup.Text>
                            <FontAwesomeIcon
                              style={{ cursor: "pointer" }}
                              icon={
                                passtype !== "password" ? faEyeSlash : faEye
                              }
                              onClick={() => {
                                setPassType(
                                  passtype === "password" ? "text" : "password"
                                );
                              }}
                            />
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </Col>

                    <Col lg={true}>
                      <Form.Group
                        className="mb-3 text-white"
                        controlId="formConfirmPassword"
                      >
                        <Form.Label>Confirm Password</Form.Label>
                        <InputGroup>
                          <Form.Control
                            type={passtype1}
                            placeholder="Password"
                            ref={formRePasswordRef}
                            onBlur={checkPassword}
                            focused={focused.toString()}
                            required
                          />
                          <InputGroup.Text>
                            <FontAwesomeIcon
                              style={{ cursor: "pointer" }}
                              icon={
                                passtype1 !== "password" ? faEyeSlash : faEye
                              }
                              onClick={() => {
                                setPassType1(
                                  passtype1 === "password" ? "text" : "password"
                                );
                              }}
                            />
                          </InputGroup.Text>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="d-grid">
                        <Button
                          style={{
                            padding: "8px",
                            borderRadius: "15px",
                            backgroundColor: "#C5D5EA",
                          }}
                          variant="light"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Form>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
