import fs from "fs";

const CONTACTS_FILE = "contacts.json";

function add(name, phone, email) {
  let contacts = [];
  let result = {};

  if (fs.existsSync(CONTACTS_FILE)) {
    const data = fs.readFileSync(CONTACTS_FILE, "utf8");
    contacts = data.trim() ? JSON.parse(data) : [];
  }

  result.size = contacts.length;
  if (contacts.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
    result.error = "Email already exists in contacts";
    return result;
  }

  const contact = { name: name, phone: phone, email: email };
  contacts.push(contact);
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), "utf8");

  result.error = null;
  return result;
}
