'use client';

import React, { useState } from "react";
import ContactForm from "../../_components/Contact/ContactForm";

const TutorContactPage = () => {
  const [profile, setProfile] = useState("");
  const handleSubmit = (data: Record<string, string>) => {
    alert(`Tutor Application Submitted!\nName: ${data.name}\nEmail: ${data.email}\nProfile: ${profile}\nMessage: ${data.message}`);
  };
  return (
    <div className="py-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us (Tutors)</h1>
      <ContactForm onSubmit={handleSubmit}>
        <div>
          <label className="block font-medium mb-1" htmlFor="contact-profile">LinkedIn / Profile URL</label>
          <input
            id="contact-profile"
            name="profile"
            type="url"
            className="w-full border rounded-lg p-2"
            placeholder="https://linkedin.com/in/your-profile"
            value={profile}
            onChange={e => setProfile(e.target.value)}
            required
          />
        </div>
      </ContactForm>
    </div>
  );
};

export default TutorContactPage;
