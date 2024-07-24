import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { ListGroup, Button, Form, Alert, Col, InputGroup } from "react-bootstrap";
import { useNotebook } from "../../hooks/useNotebook";

const NotebookList = () => {
  const { selectedNotebook, setSelectedNotebook } = useNotebook();
  const [user] = useAuthState(auth);
  const [notebooks, setNotebooks] = useState([]);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotebooks = async () => {
      const querySnapshot = await getDocs(collection(db, "notebooks"));
      const notebookData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotebooks(notebookData);
    };

    fetchNotebooks();
  }, []);

  const handleCreateNotebook = async () => {
    if (newNotebookName.trim() === "") {
      setError("Notebook name cannot be empty");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "notebooks"), {
        name: newNotebookName,
        uid: user.uid,
      });
      setNotebooks([...notebooks, { id: docRef.id, name: newNotebookName, uid: user.uid }]);
      setNewNotebookName("");
      setError("");
    } catch (error) {
      setError("Error creating notebook");
      console.error("Error creating notebook:", error);
    }
  };

  return (
    <Col
      md={3}
      className="bg-light d-flex flex-column px-4 py-2"
      style={{ height: "100vh", overflowY: "auto" }}
    >
      <h6>Notebooks</h6>
      <Form.Group controlId="newNotebookName">
        <InputGroup className="mb-3">
          <Form.Control
            onChange={(e) => setNewNotebookName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateNotebook();
              }
            }}
            value={newNotebookName}
            placeholder="Notebook name"
            aria-label="Notebook name"
          />
          <Button variant="outline-primary" onClick={handleCreateNotebook}>
            Create
          </Button>
        </InputGroup>
      </Form.Group>
      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
      <ListGroup className="mt-3 flex-grow-1">
        {notebooks.map((notebook) => (
          <ListGroup.Item
            key={notebook.id}
            action
            active={selectedNotebook && notebook.id === selectedNotebook.id}
            onClick={() => setSelectedNotebook(notebook)}
          >
            {notebook.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Col>
  );
};

export default NotebookList;
