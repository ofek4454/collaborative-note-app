import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { ListGroup, Button, Col } from "react-bootstrap";
import { useNotebook } from "../../hooks/useNotebook";
import NoteEditor from "./NoteEditor";
import NoteCard from "./NoteCard";

const NotesList = () => {
  const { selectedNotebook } = useNotebook();
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    if (!selectedNotebook) return;

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

  const handleDeleteNote = async (noteId) => {
    if (selectedNotebook && noteId) {
      try {
        await deleteDoc(doc(db, "notebooks", selectedNotebook.id, "notes", noteId));
        setNotes(notes.filter((note) => note.id !== noteId));
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
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
      <ListGroup className="mt-3 ms-2 me-4">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={() => handleNoteSelect(note)}
            onDelete={() => handleDeleteNote(note.id)}
          />
        ))}
      </ListGroup>
      {showEditor && <NoteEditor note={selectedNote} onClose={() => setShowEditor(false)} />}
    </Col>
  );
};

export default NotesList;
