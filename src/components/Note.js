import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { CircularProgress, Box, TextField, Button } from "@mui/material";

const Note = ({ noteId }) => {
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (noteId) {
      setLoading(true);
      const unsubscribe = onSnapshot(
        doc(db, "notes", noteId),
        (doc) => {
          setTitle(doc.data().title || "");
          setNote(doc.data().content || "");
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching note:", error);
          setLoading(false);
          setError("Failed to fetch note. Please try again.");
        }
      );

      return () => unsubscribe();
    } else {
      setTitle("");
      setNote("");
    }
  }, [noteId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (noteId) {
        await updateDoc(doc(db, "notes", noteId), { content: note, title: title });
      } else {
        const docRef = await addDoc(collection(db, "notes"), { content: note, title: title });
        // Optionally, handle new note creation logic
        console.log("New note added with ID: ", docRef.id);
      }
    } catch (error) {
      console.error("Error saving note:", error);
      setError("Failed to save note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <TextField
        fullWidth
        multiline
        rows={6}
        label="Content"
        variant="outlined"
        margin="normal"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your note here..."
      />
      <Button variant="contained" color="primary" onClick={handleSave} disabled={loading}>
        {noteId ? "Update Note" : "Add Note"}
      </Button>
    </div>
  );
};

export default Note;
