import fs from "fs";
import { resourceUsage } from "process";

const CONTACTS_FILE = "contacts.json";

function loadContacts() {
  if (fs.existsSync(CONTACTS_FILE)) {
    const data = fs.readFileSync(CONTACTS_FILE, "utf8");
    return data.trim() ? JSON.parse(data) : [];
  }
  return []; // Return empty array if file doesn't exist yet
}

function add(name, phone, email) {
  let result = {};
  const contacts = loadContacts();

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

function reomve(email) {
  const result = {};
  const contacts = loadContacts();

  result.size = contacts.length;

  const toRemove = contacts.findIndex(
    (c) => c.email.toLowerCase() === email.toLowerCase(),
  );

  if (toRemove === -1) {
    result.deletedName = undefined;
    return result;
  } else {
    result.deletedName = contacts[toRemove].name;
    contacts.splice(toRemove, 1);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), "utf8");

    return result;
  }
}

function list() {
  const result = {};
  const contacts = loadContacts();

  result.size = contacts.length;
  result.results = JSON.stringify(contacts);
}

function search(name) {
  const result = {};
  const contacts = loadContacts();

  result.size = contacts.length;

  const toSearch = name.toLowerCase();
  result.results = contacts.filter((c) =>
    c.name.toLowerCase().includes(toSearch),
  );

  return result;
}
