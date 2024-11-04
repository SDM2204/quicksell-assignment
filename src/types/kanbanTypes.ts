export interface Ticket {
  id: string;
  title: string;
  tag: string[];
  userId: string;
  status: "Todo" | "In progress" | "Backlog" | "Done" | "Cancelled";
  priority: number;
}

export interface User {
  id: string;
  name: string;
  available: boolean;
}

export interface KanbanState {
  tickets: Ticket[];
  users: User[];
  loading: boolean;
}
