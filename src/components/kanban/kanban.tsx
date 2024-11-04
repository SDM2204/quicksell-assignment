import "./kanban.css";
import Card from "../card/card";
import { Ticket, User } from "@/types/kanbanTypes";

import ToDoIcon from '@/assets/To-do.svg';
import DoneIcon from '@/assets/Done.svg';
import CancelledIcon from '@/assets/Cancelled.svg';
import BacklogIcon from '@/assets/Backlog.svg';
import InProgressIcon from '@/assets/in-progress.svg';


const groupIcons: Record<string, string> = {
  "Todo": ToDoIcon,
  "Done": DoneIcon,
  "Cancelled": CancelledIcon,
  "Backlog": BacklogIcon,
  "In progress": InProgressIcon,
};

interface KanbanBoardProps {
  users: User[];
  groupTickets: Record<string, Ticket[]>;
}

export default function KanbanBoard({ users, groupTickets }: KanbanBoardProps) {
  const groupedTickets = groupTickets;

  return (
    <div className="kanban-board">
      <div className="board">
        {Object.entries(groupedTickets).map(([group, tickets]) => (
          <div key={group} className="column">
            <div className="column-header">
              <span className="group-name">
                {groupIcons[group] && <img src={groupIcons[group]} alt={group} />}&nbsp;
                {group}
              </span>
              <span className="ticket-count">({tickets.length})</span>
            </div>
            <div className="tickets">
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  ticket={ticket}
                  user={users.find((u) => u.id === ticket.userId)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}