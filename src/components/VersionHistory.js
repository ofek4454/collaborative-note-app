import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";

const VersionHistory = ({ noteId }) => {
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    if (noteId) {
      const q = query(collection(db, "notes", noteId, "versions"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const versions = querySnapshot.docs.map((doc) => doc.data());
        setVersions(versions);
      });

      return () => unsubscribe();
    }
  }, [noteId]);

  return (
    <div>
      <h3>Version History</h3>
      <ul>
        {versions.map((version, index) => (
          <li key={index}>
            <strong>{version.title}</strong> -{" "}
            {new Date(version.timestamp.seconds * 1000).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VersionHistory;
