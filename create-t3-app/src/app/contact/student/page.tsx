'use client';

import React, { useState } from "react";
import ContactForm from "../../_components/Contact/ContactForm";
import ContactDropdown from "../../_components/Contact/ContactDropdown";

const serviceOptions = [
  { value: "tutoring", label: "One-on-One Tutoring" },
  { value: "group-workshop", label: "Group Workshop" },
  { value: "resume-review", label: "Resume Review" },
  { value: "career-mentoring", label: "Career Mentoring" },
  { value: "coding-bootcamp", label: "Coding Bootcamp" },
];

const StudentContactPage = () => {
  const [service, setService] = useState("");
  const handleSubmit = (data: Record<string, string>) => {
    alert(`Query submitted!\nService: ${service}\nName: ${data.name}\nEmail: ${data.email}\nMessage: ${data.message}`);
  };
  return (
    <div className="py-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us (Students & Customers)</h1>
      <ContactForm onSubmit={handleSubmit}>
        <ContactDropdown
          options={serviceOptions}
          value={service}
          onChange={setService}
          label="Select a service or resource"
        />
      </ContactForm>
    </div>
  );
};

export default StudentContactPage;
