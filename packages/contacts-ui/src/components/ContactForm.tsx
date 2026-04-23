import React, { useState, useEffect } from "react";
import { useContactsStore, Contact } from "../store/contactsStore";

interface ContactFormProps {
  currentContact?: Contact | null;
  onSuccess: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ currentContact, onSuccess }) => {
  const { addContact, updateContact } = useContactsStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "personal" as "personal" | "professional",
  });

  useEffect(() => {
    if (currentContact) {
      setFormData({
        name: currentContact.name,
        email: currentContact.email,
        phone: currentContact.phone,
        type: currentContact.type,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        type: "personal",
      });
    }
  }, [currentContact]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentContact) {
        await updateContact(currentContact.id, formData);
      } else {
        await addContact(formData);
      }
      onSuccess();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="card" onSubmit={handleSubmit} style={{ width: "100%" }}>
      <h2 style={{ marginBottom: "1.5rem" }}>{currentContact ? "Edit Contact" : "Add Contact"}</h2>
      
      <div className="input-group" style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          className="input-field"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="input-group" style={{ marginBottom: "1rem" }}>
        <input
          type="email"
          className="input-field"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="input-group" style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          className="input-field"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ marginBottom: "0.5rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>Contact Type</p>
        <div style={{ display: "flex", gap: "1rem" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input
              type="radio"
              name="type"
              value="personal"
              checked={formData.type === "personal"}
              onChange={() => setFormData({ ...formData, type: "personal" })}
            />
            Personal
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
            <input
              type="radio"
              name="type"
              value="professional"
              checked={formData.type === "professional"}
              onChange={() => setFormData({ ...formData, type: "professional" })}
            />
            Professional
          </label>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
        {currentContact ? "Update Contact" : "Add Contact"}
      </button>
      
      {currentContact && (
        <button 
          type="button" 
          className="btn btn-outline" 
          style={{ width: "100%", marginTop: "0.5rem" }}
          onClick={onSuccess}
        >
          Cancel
        </button>
      )}
    </form>
  );
};
