import React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/esm/Container";
import CardBody from "react-bootstrap/esm/CardBody";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";

import InputGroup from "react-bootstrap/InputGroup";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";

//Login Screen
export default function LoginForm() {
  const formEmailRef = useRef();
  const formPasswordRef = useRef();

  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  const [passtype, setPassType] = useState("password");

  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();

    const enteredEmail = formEmailRef.current.value;
    const enteredPassword = formPasswordRef.current.value;

    try {
      const response = await axios.post("/api/wpm/login", {
        email: enteredEmail,
        password: enteredPassword,
      });
      // console.log(response.data);
      setUser(response.data);
      if (response.data.auth) {
        localStorage.setItem("auth", "true");
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        setMsg("Login successfull!");
        navigate("/dashboard", { replace: true });
      } else {
        localStorage.setItem("auth", "false");
        localStorage.setItem("user", null);
        setMsg("Login unsuccessful!");
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container className="login-container">
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

      <Card className="sign-in-box-card">
        <CardBody className="sign-in-box-card-body">
          <img className="profile-icon" src="../user.png" alt="profile icon" />

          <Card.Title className="card-title">Sign In</Card.Title>
          {user && user.auth ? (
            <div className="text-white">{msg}</div>
          ) : (
            <div className="text-warning text-center">{msg}</div>
          )}

          <Form className="login-form" onSubmit={submitHandler}>
            <Row className="mb-3">
              <Form.Group className="mb-3" controlId="formEmail">
                <Col lg={true}>
                  <Form.Control
                    type="email"
                    placeholder="email"
                    ref={formEmailRef}
                  />
                </Col>
              </Form.Group>
            </Row>
            <Row>
              <Col lg={true}>
                <InputGroup className="mb-3">
                  <Form.Control
                    type={passtype}
                    placeholder="password"
                    ref={formPasswordRef}
                  />
                  <InputGroup.Text>
                    <FontAwesomeIcon
                      style={{ cursor: "pointer" }}
                      icon={passtype !== "password" ? faEyeSlash : faEye}
                      onClick={() => {
                        setPassType(
                          passtype === "password" ? "text" : "password"
                        );
                      }}
                    />
                  </InputGroup.Text>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col lg={true}>
                <div id="login-btn" className="d-grid gap-2">
                  <Button
                    style={{
                      padding: "8px",
                      borderRadius: "12px",
                      backgroundColor: "#03989e",
                      color: "white",
                      marginTop: "15px",
                    }}
                    variant="light"
                    type="submit"
                  >
                    Login
                  </Button>
                </div>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
                <Nav.Link style={{ color: "white" }} href="/register">
                  No account? REGISTER
                </Nav.Link>
              </Col>
              <Col>
                <Nav.Link
                  style={{ float: "right", color: "white" }}
                  href="/forgot"
                >
                  Forgot Password?
                </Nav.Link>
              </Col>
            </Row>
          </Form>
        </CardBody>
      </Card>

      <Row className="mt-2"></Row>
    </Container>
  );
}
