import fs from "fs";

const CONTACTS_FILE = "contacts.json";

export class ContactService {
  constructor(filePath = "contacts.json") {
    this.filePath = filePath;
  }
  #loadContacts() {
    if (fs.existsSync(CONTACTS_FILE)) {
      const data = fs.readFileSync(CONTACTS_FILE, "utf8");
      return data.trim() ? JSON.parse(data) : [];
    }
    return []; // Return empty array if file doesn't exist yet
  }

  add(name, phone, email) {
    let result = {};
    const contacts = loadContacts();

    result.loadedCount = contacts.length;

    if (contacts.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
      //result.error = "Email already exists in contacts";
      result.isDuplicate = true;
      return result;
    }

    const contact = { name: name, phone: phone, email: email };
    contacts.push(contact);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), "utf8");

    //result.error = null;
    return result;
  }

  remove(email) {
    const result = {};
    const contacts = loadContacts();

    result.loadedCount = contacts.length;

    const toRemove = contacts.findIndex(
      (c) => c.email.toLowerCase() === email.toLowerCase(),
    );

    if (toRemove === -1) {
      result.contactNotFound = true;
      return result;
    } else {
      result.contactNotFound = false;
      result.deletedName = contacts[toRemove].name;
      contacts.splice(toRemove, 1);
      fs.writeFileSync(
        CONTACTS_FILE,
        JSON.stringify(contacts, null, 2),
        "utf8",
      );

      return result;
    }
  }

  list() {
    const result = {};
    const contacts = loadContacts();

    result.loadedCount = contacts.length;
    //   result.results = JSON.stringify(contacts);
    result.contacts = contacts;

    return result;
  }

  search(name) {
    const result = {};
    const contacts = loadContacts();

    result.loadedCount = contacts.length;

    const toSearch = name.toLowerCase();
    result.contacts = contacts.filter((c) =>
      c.name.toLowerCase().includes(toSearch),
    );

    return result;
  }
}
