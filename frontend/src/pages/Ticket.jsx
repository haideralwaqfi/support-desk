import React, { useEffect } from "react";
import { toast } from "react-toastify";
import Modal from "react-modal";
import { useDispatch, useSelector } from "react-redux";
import { getTicket, reset, closeTicket } from "../features/ticket/ticketSlice";
import {
  getNotes,
  createNote,
  reset as noteReset,
} from "../features/notes/noteSlice";
import BackButton from "../components/BackButton";
import Spinner from "../components/Spinner";
import NoteItem from "../components/NoteItem";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
const customStyles = {
  content: {
    width: "600px",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    position: "relative",
  },
};

Modal.setAppElement("#root");

function Ticket() {
  const [modalIsOpened, setModalIsOpened] = useState(false);
  const [noteText, setNoteText] = useState("");
  const { isLoading, isError, message, ticket, isSuccess } = useSelector(
    (state) => state.tickets
  );
  const { notes, isLoading: notesIsLoading } = useSelector(
    (state) => state.notes
  );
  const params = useParams();
  const dispatch = useDispatch();
  const { ticketId } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getTicket(ticketId));
    dispatch(getNotes(ticketId));
  }, [isError, ticketId, message]);

  //close ticket
  const onTicketClose = () => {
    dispatch(closeTicket(ticketId));
    toast.success("Ticket was closed");
    navigate("/tickets");
  };

  //create note submit
  const onNoteSubmit = (e) => {
    e.preventDefault();
    dispatch(createNote({ noteText, ticketId }));
    closeModal();
  };

  //Open/Close Ticket
  const openModal = () => setModalIsOpened(true);
  const closeModal = () => setModalIsOpened(false);

  if (isLoading || notesIsLoading) {
    return <Spinner />;
  }
  if (isError) {
    <h3>Something went wrong</h3>;
  }
  return (
    <div className="ticket-page">
      <header className="ticket-header">
        <BackButton url="/tickets" />
        <h2>
          Ticket ID: {ticket._id}
          <span className={`status status-${ticket.status}`}>
            {ticket.status}
          </span>
        </h2>
        <h3>
          Date Submitted: {new Date(ticket.createdAt).toLocaleString("en-US")}
        </h3>
        <h3>Product: {ticket.product}</h3>
        <hr />
        <div className="ticket-desc">
          <h2>Issue Description</h2>
          <p>{ticket.description}</p>
        </div>
        <h2>Notes</h2>
      </header>
      {ticket.status !== "closed" && (
        <button onClick={openModal} className="btn">
          <FaPlus />
          Add Notes
        </button>
      )}
      <Modal
        isOpen={modalIsOpened}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Add-Note">
        <h2>Add Note</h2>
        <button className="btn-close" onClick={closeModal}>
          X
        </button>
        <form onSubmit={onNoteSubmit}>
          <div className="form-group">
            <textarea
              name="noteText"
              id="noteText"
              className="form-control"
              placeholder="Note Text"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}></textarea>
          </div>
          <div className="form-group">
            <button className="btn" type="submit">
              Submit
            </button>
          </div>
        </form>
      </Modal>
      {notes.map((note) => (
        <NoteItem key={note._id} note={note} />
      ))}
      {ticket.status !== "closed" && (
        <button onClick={onTicketClose} className="btn btn-danger btn-block">
          Close ticket
        </button>
      )}
    </div>
  );
}

export default Ticket;
