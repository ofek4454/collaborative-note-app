import React, { useState } from "react";
import { Button, Collapse, ListGroup } from "react-bootstrap";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaLock } from "react-icons/fa";
import { Timestamp } from "firebase/firestore";
import { useNotebook } from "../../hooks/useNotebook";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase";

const NoteCard = ({ note, onEdit, onDelete }) => {
  const { selectedNotebook } = useNotebook();
  const [expanded, setExpanded] = useState(false);
  const [user] = useAuthState(auth);

  const toggleExpand = () => setExpanded((prev) => !prev);

  const isLocked = "lockedBy" in note;

  let lastModifiedDate;
  let createdDate;
  if (note.lastModified instanceof Timestamp) lastModifiedDate = note.lastModified.toDate();
  else lastModifiedDate = new Date(note.lastModified); // if it's already a Date or timestamp

  if (note.createdAt instanceof Timestamp) createdDate = note.createdAt.toDate();
  else createdDate = new Date(note.createdAt); // if it's already a Date or timestamp

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete();
    }
  };

  return (
    <ListGroup.Item key={note.id} action onClick={toggleExpand} className="p-2">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          {expanded ? <FaChevronUp /> : <FaChevronDown />}
          <span className="ms-3">{note.title}</span>
        </div>
        <div>
          <Button
            variant="link"
            className="p-0 me-2"
            onClick={(e) => {
              if (isLocked) return;
              e.stopPropagation();
              onEdit();
            }}
            disabled={isLocked}
          >
            {isLocked ? <FaLock style={{ color: "black" }} /> : <FaEdit />}
          </Button>
          <Button
            variant="link"
            className="p-0 text-danger"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
          >
            <FaTrash />
          </Button>
        </div>
      </div>
      <Collapse in={expanded}>
        <div className="mt-2">
          <p>{note.content}</p>
          <small className="text-muted">Created: {createdDate.toLocaleString()}</small>
          <small className="mx-2">|</small>
          <small className="text-muted">Modified: {lastModifiedDate.toLocaleString()}</small>
        </div>
      </Collapse>
    </ListGroup.Item>
  );
};

export default NoteCard;
