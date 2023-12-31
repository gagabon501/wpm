import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";

function NavBar() {
  const wpmuser = JSON.parse(localStorage.getItem("user"));

  return (
    <>
      {[false].map((expand) => (
        <Navbar
          key={expand}
          bg="dark"
          variant="dark"
          expand={expand}
          className="mb-2"
          // style={{ position: "fixed", zIndex: 1, width: "100%" }}
        >
          <Navbar.Brand href="/">
            <div style={{ marginLeft: "10px" }}>
              <img src="/WPM_Logo.png" width="220" height="50" alt="WPM Logo" />
            </div>
          </Navbar.Brand>
          <div className="text-white m-2">
            {" "}
            Web-based Password Manager (WPM)
          </div>

          {wpmuser && (
            <div className="ms-auto" style={{ marginRight: "10px" }}>
              <img
                style={{ borderRadius: "50px" }}
                src={`/api/wpm/image/${wpmuser.attachment}`}
                width="50"
                height="50"
                alt="User Profile Pix"
              />
            </div>
          )}
          <div className="vr text-white m-2" />
          {wpmuser && <div className="text-white m-2">{wpmuser.firstname}</div>}

          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-${expand}`}
            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
            placement="end"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                Profile Menu
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                <Nav.Link href="/updateuser">Update Profile</Nav.Link>
                <Nav.Link href="/changepassword">Change Password</Nav.Link>
                <Nav.Link href="/logout">Logout</Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Navbar>
      ))}
    </>
  );
}

export default NavBar;
