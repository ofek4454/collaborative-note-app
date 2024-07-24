import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { TextField, Button, Box } from "@mui/material";

const NoteEditor = ({ selectedNote, setSelectedNote, setNotes }) => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [selectedNote]);

  const handleSave = async () => {
    if (selectedNote) {
      await updateDoc(doc(db, "notes", selectedNote.id), {
        title,
        content,
      });
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === selectedNote.id ? { ...note, title, content } : note))
      );
    } else {
      const docRef = await addDoc(collection(db, "notes"), {
        uid: user.uid,
        title,
        content,
      });
      setNotes((prevNotes) => [...prevNotes, { id: docRef.id, uid: user.uid, title, content }]);
    }
    setSelectedNote(null);
    setTitle("");
    setContent("");
  };

  return (
    <Box sx={{ mb: 4 }}>
      <TextField
        fullWidth
        label="Title"
        margin="normal"
        variant="outlined"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        fullWidth
        label="Content"
        margin="normal"
        variant="outlined"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
        {selectedNote ? "Update Note" : "Add Note"}
      </Button>
    </Box>
  );
};

export default NoteEditor;
