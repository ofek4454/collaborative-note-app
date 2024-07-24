import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  TextField,
  Button,
  Box,
} from "@mui/material";

const NotebookList = ({ setSelectedNotebook }) => {
  const [user] = useAuthState(auth);
  const [notebooks, setNotebooks] = useState([]);
  const [newNotebookName, setNewNotebookName] = useState("");

  useEffect(() => {
    if (user) {
      const fetchNotebooks = async () => {
        const q = query(collection(db, "notebooks"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const notebookData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setNotebooks(notebookData);
      };

      fetchNotebooks();
    }
  }, [user]);

  const handleNotebookSelect = (notebook) => {
    setSelectedNotebook(notebook);
  };

  const handleCreateNotebook = async () => {
    try {
      const docRef = await addDoc(collection(db, "notebooks"), {
        name: newNotebookName,
        uid: user.uid,
      });
      setNotebooks([...notebooks, { id: docRef.id, name: newNotebookName, uid: user.uid }]);
      setNewNotebookName("");
    } catch (error) {
      console.error("Error creating notebook:", error);
    }
  };

  return (
    <Box>
      <List>
        <Typography variant="h6" gutterBottom>
          Notebooks
        </Typography>
        <Divider />
        <Box mt={2}>
          <TextField
            label="New Notebook Name"
            variant="outlined"
            fullWidth
            value={newNotebookName}
            onChange={(e) => setNewNotebookName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreateNotebook();
              }
            }}
          />
        </Box>
        {notebooks.map((notebook) => (
          <ListItem button key={notebook.id} onClick={() => handleNotebookSelect(notebook)}>
            <ListItemText primary={notebook.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default NotebookList;
