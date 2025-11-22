import React, { useState } from "react";

export type ContactFormFields = {
  name?: boolean;
  email?: boolean;
  message?: boolean;
};

type ContactFormProps = {
  onSubmit: (data: Record<string, string>) => void;
  fields?: ContactFormFields;
  children?: React.ReactNode;
  submitLabel?: string;
};

const defaultFields: ContactFormFields = {
  name: true,
  email: true,
  message: true,
};

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  fields = defaultFields,
  children,
  submitLabel = "Submit",
}) => {
  const [formState, setFormState] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto border p-6 rounded-xl shadow bg-white">
      {fields.name && (
        <div>
          <label className="block font-medium mb-1" htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" type="text" className="w-full border rounded-lg p-2" onChange={handleChange} required />
        </div>
      )}
      {fields.email && (
        <div>
          <label className="block font-medium mb-1" htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" className="w-full border rounded-lg p-2" onChange={handleChange} required />
        </div>
      )}
      {children}
      {fields.message && (
        <div>
          <label className="block font-medium mb-1" htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" rows={4} className="w-full border rounded-lg p-2" onChange={handleChange} required />
        </div>
      )}
      <button type="submit" className="bg-blue-600 text-white rounded-lg py-2 px-6 font-bold hover:bg-blue-700">{submitLabel}</button>
    </form>
  );
};

export default ContactForm;
