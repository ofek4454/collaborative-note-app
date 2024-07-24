import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { ListGroup, Button, Form, Alert, Col, InputGroup } from "react-bootstrap";
import { useNotebook } from "../../hooks/useNotebook";
import { FaTrash } from "react-icons/fa";
import "./NotebookList.css";

const NotebookList = () => {
  const { selectedNotebook, setSelectedNotebook } = useNotebook();
  const [user] = useAuthState(auth);
  const [notebooks, setNotebooks] = useState([]);
  const [newNotebookName, setNewNotebookName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      collection(db, "notebooks"),
      (snapshot) => {
        const notebookData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setNotebooks(notebookData);
      },
      (error) => {
        console.error("Error fetching notebooks:", error);
        setError("Error fetching notebooks");
      }
    );

    // Clean up listener on component unmount
    return () => unsubscribe();
  }, [user]);

  const handleCreateNotebook = async () => {
    if (newNotebookName.trim() === "") {
      setError("Notebook name cannot be empty");
      return;
    }

    try {
      await addDoc(collection(db, "notebooks"), {
        name: newNotebookName,
        uid: user.uid,
      });
      setNewNotebookName("");
      setError("");
    } catch (error) {
      setError("Error creating notebook");
      console.error("Error creating notebook:", error);
    }
  };

  const handleDeleteNotebook = async (notebookId) => {
    if (window.confirm("Are you sure you want to delete this notebook?")) {
      try {
        await deleteDoc(doc(db, "notebooks", notebookId));
        if (selectedNotebook?.id === notebookId) {
          setSelectedNotebook(null);
        }
      } catch (error) {
        console.error("Error deleting notebook:", error);
        setError("Error deleting notebook");
      }
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
            className="notebook-item d-flex justify-content-between align-items-center"
          >
            <span>{notebook.name}</span>
            <Button
              variant="link"
              className="text-danger p-0 delete-btn"
              onClick={(e) => {
                e.stopPropagation(); // Prevent the notebook from being selected
                handleDeleteNotebook(notebook.id);
              }}
            >
              <FaTrash />
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Col>
  );
};

export default NotebookList;
