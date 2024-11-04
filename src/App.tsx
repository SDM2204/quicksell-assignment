import { useEffect, useState, useMemo } from "react";
import Header from "./components/header/header";
import Kanban from "./components/kanban/kanban";
import { Ticket, User } from "./types/kanbanTypes";

const getPriorityLabel = (priority: number): string => {
  const priorityMap: { [key: number]: string } = {
    4: "Urgent",
    3: "High",
    2: "Medium",
    1: "Low",
  };
  return priorityMap[priority] || "No Priority";
};

const App = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groupBy, setGroupBy] = useState<string>(
    () => localStorage.getItem("groupBy") ?? "status"
  );
  const [sortBy, setSortBy] = useState<string>(
    () => localStorage.getItem("sortBy") ?? "priority"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTickets(data.tickets);
        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load data. Please try again later.");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("groupBy", groupBy);
    localStorage.setItem("sortBy", sortBy);
  }, [groupBy, sortBy]);

  const groupTickets = useMemo(() => {
    const grouped = tickets.reduce((acc, ticket) => {
      let key: string;
      if (groupBy === "priority") {
        key = getPriorityLabel(ticket.priority);
      } else if (groupBy === "user") {
        key = users.find((u) => u.id === ticket.userId)?.name || "Unassigned";
      } else {
        key = ticket.status;
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ticket);
      return acc;
    }, {} as Record<string, Ticket[]>);

    Object.values(grouped).forEach((group) => {
      group.sort((a, b) =>
        sortBy === "priority"
          ? b.priority - a.priority
          : a.title.localeCompare(b.title)
      );
    });

    return grouped;
  }, [tickets, groupBy, sortBy, users]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="kanban">
      <Header
        sortBy={sortBy}
        groupBy={groupBy}
        setSortBy={setSortBy}
        setGroupBy={setGroupBy}
      />
      <Kanban users={users} groupTickets={groupTickets} />
    </div>
  );
};

export default App;
