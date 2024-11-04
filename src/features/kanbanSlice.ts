import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { KanbanState, Ticket, User } from "@/types/kanbanTypes";

// Async action to fetch tickets and users
export const fetchTicketsData = createAsyncThunk(
  "kanban/fetchTicketsData",
  async (): Promise<{ tickets: Ticket[]; users: User[] }> => {
    try {
      const response = await fetch(
        "https://api.quicksell.co/v1/internal/frontend-assignment"
      );
      if (!response.ok) throw new Error("Failed to fetch tickets data.");
      return await response.json();
    } catch (error) {
      console.error("Error fetching tickets data:", error);
      throw error;
    }
  }
);

const initialState: KanbanState = {
  tickets: [],
  users: [],
  loading: false,
};

// Helper function to update ticket status immutably
const updateTicketStatus = (
  tickets: Ticket[],
  ticketId: string,
  newStatus: Ticket["status"]
) =>
  tickets.map((ticket) =>
    ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
  );

const kanbanSlice = createSlice({
  name: "kanban",
  initialState,
  reducers: {
    moveTicket: (
      state,
      action: PayloadAction<{ ticketId: string; newStatus: Ticket["status"] }>
    ) => {
      const { ticketId, newStatus } = action.payload;
      state.tickets = updateTicketStatus(state.tickets, ticketId, newStatus);
    },
    sortTicketsByPriority: (state) => {
      state.tickets = [...state.tickets].sort(
        (a, b) => b.priority - a.priority
      );
    },
    sortTicketsByTitle: (state) => {
      state.tickets = [...state.tickets].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTicketsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTicketsData.fulfilled, (state, action) => {
        state.tickets = action.payload.tickets;
        state.users = action.payload.users;
        state.loading = false;
      })
      .addCase(fetchTicketsData.rejected, (state) => {
        state.loading = false;
        console.error("Failed to load tickets data");
      });
  },
});

export const { moveTicket, sortTicketsByPriority, sortTicketsByTitle } =
  kanbanSlice.actions;
export default kanbanSlice.reducer;
