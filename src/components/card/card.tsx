import { Ticket, User } from "@/types/kanbanTypes";
import "./card.css";

// Import your SVG files
import UrgentIcon from "@/assets/urgent.svg";
import HighIcon from "@/assets/high.svg";
import MediumIcon from "@/assets/medium.svg";
import LowIcon from "@/assets/low.svg";
import NoPriorityIcon from "@/assets/No-priority.svg";

interface CardProps {
  readonly ticket: Ticket;
  readonly user?: User;
}

export default function Card({ ticket, user }: CardProps) {
  const getPriorityIcon = (priority: number) => {
    switch (priority) {
      case 4:
        return <img src={UrgentIcon} alt="Urgent" />;
      case 3:
        return <img src={HighIcon} alt="High" />;
      case 2:
        return <img src={MediumIcon} alt="Medium" />;
      case 1:
        return <img src={LowIcon} alt="Low" />;
      default:
        return <img src={NoPriorityIcon} alt="No Priority" />;
    }
  };

  return (
    <div className="ticket">
      <div className="ticket-header">
        <span className="ticket-id">{ticket.id}</span>
        {user && (
          <div className="user-avatar">
            <img src="" alt={user.name} />
            <span
              className={`status-dot ${user.available ? "available" : ""}`}
            />
          </div>
        )}
      </div>
      <h3 className="ticket-title">{ticket.title}</h3>
      <div className="ticket-tags">
        <span className="priority-tag">
          {getPriorityIcon(ticket.priority)}
        </span>
        {ticket.tag.map((tag) => (
          <span key={tag} className="feature-tag">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
