import React from "react";
import { Contact, useContactsStore } from "../store/contactsStore";

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onEdit }) => {
  const { deleteContact } = useContactsStore();

  return (
    <div className="card contact-card" style={{ marginBottom: "1rem", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 style={{ margin: 0, fontSize: "1.25rem" }}>{contact.name}</h3>
          <span className={`badge badge-${contact.type}`} style={{ marginTop: "0.5rem", display: "inline-block" }}>
            {contact.type}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button 
            className="btn btn-outline" 
            style={{ padding: "6px 10px", fontSize: "0.75rem" }}
            onClick={() => onEdit(contact)}
          >
            Edit
          </button>
          <button 
            className="btn btn-outline" 
            style={{ padding: "6px 10px", fontSize: "0.75rem", color: "var(--danger)", borderColor: "var(--danger)" }}
            onClick={() => deleteContact(contact.id)}
          >
            Delete
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: "1rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
        <p style={{ margin: "4px 0" }}>📧 {contact.email}</p>
        {contact.phone && <p style={{ margin: "4px 0" }}>📞 {contact.phone}</p>}
      </div>
    </div>
  );
};
