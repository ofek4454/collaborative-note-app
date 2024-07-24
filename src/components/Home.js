import React from "react";
import { Container, Typography, Box, AppBar, Toolbar, Button, Grid } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useNotebook } from "../NotebookContext";
import NotebookList from "./NotebookList";
import NoteList from "./NoteList";

const Home = () => {
  const navigate = useNavigate();
  const { selectedNotebook, setSelectedNotebook } = useNotebook();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/signin");
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Collaborative Note-Taking App
          </Typography>
          <Button color="inherit" onClick={handleSignOut}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box sx={{ mt: 2 }}>
            <NotebookList setSelectedNotebook={setSelectedNotebook} />
          </Box>
        </Grid>
        <Grid item xs={9}>
          {selectedNotebook && <NoteList selectedNotebook={selectedNotebook} />}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
