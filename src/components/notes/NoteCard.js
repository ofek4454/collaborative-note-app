import React, { useState } from "react";
import { Button, Collapse, ListGroup, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaLock, FaHistory } from "react-icons/fa";
import { Timestamp, collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useNotebook } from "../../hooks/useNotebook";

const NoteCard = ({ note, onEdit, onDelete }) => {
  const { selectedNotebook } = useNotebook();
  const [expanded, setExpanded] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const toggleExpand = () => setExpanded((prev) => !prev);

  const isLocked = "lockedBy" in note;

  let lastModifiedDate;
  let createdDate;
  if (note.lastModified instanceof Timestamp) lastModifiedDate = note.lastModified.toDate();
  else lastModifiedDate = new Date(note.lastModified);

  if (note.createdAt instanceof Timestamp) createdDate = note.createdAt.toDate();
  else createdDate = new Date(note.createdAt);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDelete();
    }
  };

  const showHistory = async () => {
    const historyCollection = collection(
      db,
      "notebooks",
      selectedNotebook.id,
      "notes",
      note.id,
      "history"
    );
    const historySnapshot = await getDocs(historyCollection);
    const historyData = historySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Sort history by `changedAt` from oldest to newest
    historyData.sort((a, b) => b.changedAt.toDate() - a.changedAt.toDate());
    setHistory(historyData);
    setShowHistoryModal(true);
  };

  return (
    <>
      <ListGroup.Item key={note.id} action onClick={toggleExpand} className="p-2">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
            <span className="ms-3">{note.title}</span>
          </div>
          {isLocked ? (
            <FaLock style={{ color: "black" }} />
          ) : (
            <div>
              <Button
                variant="link"
                style={{ color: "black" }}
                className="p-0 me-2"
                onClick={(e) => {
                  e.stopPropagation();
                  showHistory();
                }}
              >
                <FaHistory />
              </Button>
              <Button
                variant="link"
                className="p-0 me-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
              >
                <FaEdit />
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
          )}
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

      <Modal show={showHistoryModal} onHide={() => setShowHistoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Note History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {history.length === 0 ? (
            <p>No history available.</p>
          ) : (
            <ListGroup>
              {history.map((entry) => (
                <ListGroup.Item key={entry.id}>
                  <div>
                    <strong>{entry.title}</strong>
                  </div>
                  <div>{entry.content}</div>
                  <div>{entry.changedAt.toDate().toLocaleString()}</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NoteCard;
