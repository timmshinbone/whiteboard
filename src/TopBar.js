import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
// import ".TopBar.css";
import { withRouter } from "react-router-dom";

function TopBar({ location }) {
	const { pathname } = location;

	return(
		<Navbar bg="primary" expand="lg" variant="dark">
			<Navbar.Brand href="#home">React Canvas App</Navbar.Brand>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link href="/" active={pathname === "/"}>
						Home
					</Nav.Link>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
};





export default withRouter(TopBar);