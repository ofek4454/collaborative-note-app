import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot } from "firebase/firestore";

const Notebook = () => {
  const [notebooks, setNotebooks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "notebooks"), (snapshot) => {
      const notebooksData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotebooks(notebooksData);
    });

    return () => unsubscribe();
  }, []);

  const handleCreate = async () => {
    await addDoc(collection(db, "notebooks"), { title });
    setTitle("");
  };

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Notebook Title"
      />
      <button onClick={handleCreate}>Create Notebook</button>
      <ul>
        {notebooks.map((notebook) => (
          <li key={notebook.id}>{notebook.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notebook;
