import React from "react";
import { Container, Navbar, Nav, Button, Row, Col } from "react-bootstrap";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import NotebookList from "./notebook/NotebookList";
import NotesList from "./notes/NotesList";
import { NotebookProvider } from "../hooks/useNotebook";

const Home = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  return (
    <Container fluid className="p-0">
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand>Collaborative Note-Taking App</Navbar.Brand>
          <Nav className="ml-auto">
            <Button variant="outline-light" onClick={handleSignOut}>
              Sign Out
            </Button>
          </Nav>
        </Container>
      </Navbar>
      <NotebookProvider>
        <Row>
          <NotebookList />
          <NotesList />
        </Row>
      </NotebookProvider>
    </Container>
  );
};

export default Home;
