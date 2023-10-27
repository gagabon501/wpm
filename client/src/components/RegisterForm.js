import React from "react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/esm/Container";
import Card from "react-bootstrap/Card";
import Nav from "react-bootstrap/Nav";

import Message from "./Message";
import Progress from "./Progress";

export default function RegisterForm() {
  const formEmailRef = useRef();
  const formPasswordRef = useRef();
  const formRePasswordRef = useRef();
  const formLastnameRef = useRef();
  const formFirstnameRef = useRef();

  const [error, setError] = useState(null);
  const [file, setFile] = useState("");
  const [filepreview, setFilePreview] = useState(null);

  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);

  const [focused, setFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [password, setPassword] = useState("");

  const handleFocus = async (e) => {
    setFocused(true);
    setErrorMessage("Invalid email");
    try {
      const response = await axios.get("/api/wpm/user/" + e.target.value);

      if (response.data.duplicate) {
        e.target.setCustomValidity("Invalid field."); //forcefully set the :invalid pseudo CSS
        setFocused(true);
        setErrorMessage("Email already registered!");
      } else {
        e.target.setCustomValidity(""); //restores :valid pseudo CSS
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkPassword = (e) => {
    if (password.val !== e.target.value) {
      e.target.setCustomValidity("Invalid field."); //forcefully set the :invalid pseudo CSS
      setFocused(true);
      setPasswordMessage("Passwords don't match!");
    } else {
      e.target.setCustomValidity(""); //restores :valid pseudo CSS
      setFocused(false);
    }
  };

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0])); //this stuffs the filePreview state variable which is then used as the img src in the preview section
  };

  const navigate = useNavigate();

  async function submitHandler(e) {
    e.preventDefault();

    const enteredEmail = formEmailRef.current.value;
    const enteredPassword = formPasswordRef.current.value;
    const enteredLastname = formLastnameRef.current.value;
    const enteredFirstname = formFirstnameRef.current.value;

    //Create Formdata - did this due to the addition of file in the submission of data
    const formData = new FormData();
    formData.append("email", enteredEmail);
    formData.append("password", enteredPassword);
    formData.append("lastname", enteredLastname);
    formData.append("firstname", enteredFirstname);

    formData.append("file", file);

    try {
      const response = await axios.post("/api/wpm/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((progressEvent.loaded * 100) / progressEvent.total)
            )
          );
        },
      });

      console.log("response: ", response.data);

      navigate("/", { replace: true });
    } catch (err) {
      console.log(err);
      setError(err.response.data.error);
    }
  }

  return (
    <div>
      <Container className="registration-container">
        <Nav.Item style={{ backgroundColor: "black" }}>
          <Nav.Link href="/">
            <div className="logo-registration">
              <img
                src="../WPM_Logo.png"
                alt="Upper left logo"
                align="left"
                width="200"
                height="50"
              />
            </div>
          </Nav.Link>
        </Nav.Item>

        <div className="h1-login">
          <h1>Web-based Password Manager</h1>
        </div>

        <Card style={{ backgroundColor: "#759EB8" }}>
          <Card.Header className="card-header text-center text-black">
            <h3>User Registration</h3>
          </Card.Header>
          <Card.Body>
            {message ? <Message msg={message} /> : null}
            <Form onSubmit={submitHandler}>
              <Row>
                <Col lg={5}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="email"
                      ref={formEmailRef}
                      required
                      onBlur={handleFocus}
                      focused={focused.toString()}
                    />
                    <span className="spanerror">{errorMessage}</span>
                  </Form.Group>
                </Col>
                <Col lg={2}></Col>
                <Col lg={5}>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Upload Photo</Form.Label>
                    <Form.Control type="file" onChange={onChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={5}>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      ref={formPasswordRef}
                      required
                      onChange={(e) => setPassword({ val: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col lg={2}></Col>
                <Col lg={5}>
                  {filepreview && (
                    <div className="mt-4">
                      <img
                        src={filepreview}
                        style={{
                          border: "1px solid #ddd",
                          borderRadius: "50%",
                          width: "200px",
                          height: "200px",
                        }}
                        alt="preview"
                      />
                    </div>
                  )}
                </Col>
              </Row>
              <Row>
                <Col lg={5}>
                  <Form.Group className="mb-3" controlId="formRePassword">
                    <Form.Label>Re-type Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Re-type password"
                      ref={formRePasswordRef}
                      pattern={password.val}
                      onBlur={checkPassword}
                      focused={focused.toString()}
                      required
                    />
                    <span className="spanerror">{passwordMessage}</span>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={5}>
                  <Form.Group className="mb-3" controlId="formFirstname">
                    <Form.Label>Firstname</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="firstname"
                      ref={formFirstnameRef}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col lg={5}>
                  <Form.Group className="mb-3" controlId="formLastname">
                    <Form.Label>Lastname</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="lastname"
                      ref={formLastnameRef}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col lg={2}></Col>
                <Col lg={5}>
                  <Progress percentage={uploadPercentage} />
                  {error}
                  <div className="mt-3 d-grid">
                    <Button
                      variant="light"
                      type="submit"
                      style={{ backgroundColor: "#B3C5D7" }}
                    >
                      Submit
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
