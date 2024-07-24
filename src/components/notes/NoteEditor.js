import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, addDoc, doc, updateDoc } from "firebase/firestore";
import { Button, Form, Alert, Col } from "react-bootstrap";
import { useNotebook } from "../../hooks/useNotebook";

const NoteEditor = ({ note, onClose }) => {
  const { selectedNotebook } = useNotebook();
  const [title, setTitle] = useState(note ? note.title : "");
  const [content, setContent] = useState(note ? note.content : "");
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (title.trim() === "" || content.trim() === "") {
      setError("Title and content cannot be empty");
      return;
    }

    try {
      if (note) {
        // Update existing note
        const noteRef = doc(db, "notebooks", selectedNotebook.id, "notes", note.id);
        await updateDoc(noteRef, {
          title,
          content,
          lastModified: new Date(),
        });
      } else {
        // Create new note
        await addDoc(collection(db, "notebooks", selectedNotebook.id, "notes"), {
          title,
          content,
          createdAt: new Date(),
          lastModified: new Date(),
        });
      }
      onClose();
    } catch (error) {
      setError("Error saving note");
      console.error("Error saving note:", error);
    }
  };

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  return (
    <Col md={9} className="p-3">
      <h6>{note ? "Edit Note" : "New Note"}</h6>
      <Form.Group controlId="noteTitle">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="noteContent">
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          placeholder="Enter note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </Form.Group>
      {error && (
        <Alert variant="danger" className="mt-2">
          {error}
        </Alert>
      )}
      <Button variant="primary" className="mt-2" onClick={handleSave}>
        Save
      </Button>
      <Button variant="secondary" className="mt-2 ms-2" onClick={onClose}>
        Cancel
      </Button>
    </Col>
  );
};

export default NoteEditor;
