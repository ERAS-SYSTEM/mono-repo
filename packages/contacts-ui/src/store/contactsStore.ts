import { create } from "zustand";
import axios from "axios";

export interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  type: "personal" | "professional";
  created_at: string;
}

export interface ContactsState {
  contacts: Contact[];
  filteredContacts: Contact[];
  isLoading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, "id" | "created_at">) => Promise<void>;
  updateContact: (id: number, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  filterContacts: (text: string) => void;
  clearFilter: () => void;
}

const API_URL = "/api/contacts/";

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: [],
  filteredContacts: [],
  isLoading: false,
  error: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(API_URL);
      set({ contacts: response.data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  addContact: async (contact) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(API_URL, contact);
      set((state) => ({
        contacts: [response.data, ...state.contacts],
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateContact: async (id, contact) => {
    set({ isLoading: true });
    try {
      const response = await axios.put(`${API_URL}${id}/`, contact);
      set((state) => ({
        contacts: state.contacts.map((c) => (c.id === id ? response.data : c)),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteContact: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete(`${API_URL}${id}/`);
      set((state) => ({
        contacts: state.contacts.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  filterContacts: (text) => {
    set((state) => ({
      filteredContacts: state.contacts.filter((contact) => {
        const regex = new RegExp(`${text}`, "gi");
        return contact.name.match(regex) || contact.email.match(regex);
      }),
    }));
  },

  clearFilter: () => {
    set({ filteredContacts: [] });
  },
}));
