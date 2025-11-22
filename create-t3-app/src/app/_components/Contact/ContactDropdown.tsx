import React from "react";

type Option = {
  value: string;
  label: string;
};

type ContactDropdownProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

const ContactDropdown: React.FC<ContactDropdownProps> = ({
  options,
  value,
  onChange,
  label = "Select a service/resource",
}) => (
  <div className="flex flex-col gap-1">
    <label className="font-medium mb-1">{label}</label>
    <select
      className="border rounded-lg p-2"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      <option value="" disabled>
        -- Select --
      </option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default ContactDropdown;
