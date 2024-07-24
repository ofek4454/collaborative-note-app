import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import NoteEditor from "./NoteEditor";

const NoteList = ({ selectedNotebook }) => {
  const [user] = useAuthState(auth);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);

  useEffect(() => {
    if (user && selectedNotebook) {
      const fetchNotes = async () => {
        const q = query(collection(db, `notebooks/${selectedNotebook.id}/notes`));
        const querySnapshot = await getDocs(q);
        const notesData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setNotes(notesData);
      };

      fetchNotes();
    }
  }, [user, selectedNotebook]);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, `notebooks/${selectedNotebook.id}/notes`, id));
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Notes in {selectedNotebook.name}
        </Typography>
        <NoteEditor
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          setNotes={setNotes}
        />
        <List>
          {notes.map((note) => (
            <ListItem
              key={note.id}
              secondaryAction={
                <>
                  <IconButton edge="end" aria-label="edit" onClick={() => setSelectedNote(note)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(note.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText primary={note.title} secondary={note.content} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default NoteList;
