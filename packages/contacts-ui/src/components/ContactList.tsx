import React, { useEffect } from "react";
import { useContactsStore, Contact } from "../store/contactsStore";
import { ContactCard } from "./ContactCard";

interface ContactListProps {
  onEdit: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({ onEdit }) => {
  const { contacts, fetchContacts, isLoading } = useContactsStore();

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  if (isLoading && contacts.length === 0) {
    return <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>Loading contacts...</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>No contacts found. Add your first contact!</p>
      </div>
    );
  }

  return (
    <div className="contact-list">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} onEdit={onEdit} />
      ))}
    </div>
  );
};
