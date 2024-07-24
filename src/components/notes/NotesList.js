import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, addDoc } from "firebase/firestore";
import { ListGroup, Button, Alert, Col } from "react-bootstrap";
import { useNotebook } from "../../hooks/useNotebook";
import NoteEditor from "./NoteEditor";

const NotesList = () => {
  const { selectedNotebook } = useNotebook();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    if (!selectedNotebook) return;

    // Set up real-time listener for notes
    const notesCollection = collection(db, "notebooks", selectedNotebook.id, "notes");
    const unsubscribe = onSnapshot(
      notesCollection,
      (snapshot) => {
        const noteData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setNotes(noteData);
      },
      (error) => {
        console.error("Error fetching notes:", error);
      }
    );

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [selectedNotebook]);

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  const handleCreateNewNote = () => {
    setSelectedNote(null);
    setShowEditor(true);
  };

  if (!selectedNotebook) {
    return (
      <Col md={9} className="p-3">
        <h5>No selected notebook</h5>
      </Col>
    );
  }

  return (
    <Col md={9} className="p-3">
      <h6>Notes for {selectedNotebook.name}</h6>
      <Button variant="primary" className="mb-3" onClick={handleCreateNewNote}>
        New Note
      </Button>
      <ListGroup className="mt-3">
        {notes.map((note) => (
          <ListGroup.Item key={note.id} action onClick={() => handleNoteSelect(note)}>
            {note.title}
          </ListGroup.Item>
        ))}
      </ListGroup>
      {showEditor && <NoteEditor note={selectedNote} onClose={() => setShowEditor(false)} />}
    </Col>
  );
};

export default NotesList;
