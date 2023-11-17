import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort, faSortUp, faSortDown } from "@fortawesome/free-solid-svg-icons";

const KanbanBoard = () => {
  const [tickets, setTickets] = useState([]);
  const [displayState, setDisplayState] = useState({
    grouping: "status",
    sort: "priority",
  });

  useEffect(() => {
    fetch("https://api.quicksell.co/v1/internal/frontend-assignment")
      .then((response) => response.json())
      .then((data) => setTickets(data.tickets));
  }, []);

  const handleGroupingChange = (event) => {
    setDisplayState({
      grouping: event.target.value,
      sort: displayState.sort,
    });
  };

  const handleSortingChange = (event) => {
    setDisplayState({
      grouping: displayState.grouping,
      sort: event.target.value,
    });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceIndex = source.droppableId;
    const destinationIndex = destination.droppableId;

    const updatedTickets = [...tickets];
    const [movedTicket] = updatedTickets.splice(sourceIndex, 1);
    updatedTickets.splice(destinationIndex, 0, movedTicket);

    setTickets(updatedTickets);
  };

  const filterTicketsByGrouping = () => {
    switch (displayState.grouping) {
      case "status":
        return tickets.sort((a, b) => a.status.localeCompare(b.status));
      case "user":
        return tickets.sort((a, b) => a.assignedUser.localeCompare(b.assignedUser));
      case "priority":
        return tickets.sort((a, b) => b.priorityLevel - a.priorityLevel);
      default:
        return tickets;
    }
  };

  const sortTickets = () => {
    switch (displayState.sort) {
      case "priority":
        return filterTicketsByGrouping().sort((a, b) => b.priorityLevel - a.priorityLevel);
      case "title":
        return filterTicketsByGrouping().sort((a, b) => a.title.localeCompare(b.title));
      default:
        return filterTicketsByGrouping();
    }
  };

  return (
    <div className="kanban-board">
      <h1>College Campus Hiring Assignment</h1>

      <div className="display-options">
        <label>Grouping:</label>
        <select value={displayState.grouping} onChange={handleGroupingChange}>
          <option value="status">By Status</option>
          <option value="user">By User</option>
          <option value="priority">By Priority</option>
        </select>

        <label>Sorting:</label>
        <select value={displayState.sort} onChange={handleSortingChange}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {sortTickets().map((ticket) => (
          <Droppable droppableId={ticket.status} key={ticket.id}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <div className="ticket-container">
                  <h5>{ticket.title}</h5>
                  <p>Priority: {ticket.priorityName}</p>
                  <p>Assigned User: {ticket.assignedUser}</p>
                  <p>Status: {ticket.status}</p>
                </div>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  );
};

export default Kan
