const fs = require("fs");

const CONTACTS_FILE = "contacts.json";

class ContactService {
  #loadContacts() {
    if (fs.existsSync(CONTACTS_FILE)) {
      const data = fs.readFileSync(CONTACTS_FILE, "utf8");
      return data.trim() ? JSON.parse(data) : [];
    }
    return [];
  }

  add(name, email, phone) {
    let result = {};
    const contacts = this.#loadContacts();

    result.loadedCount = contacts.length;

    if (contacts.some((c) => c.email.toLowerCase() === email.toLowerCase())) {
      result.isDuplicate = true;
      return result;
    }

    const contact = { name: name, phone: phone, email: email };
    contacts.push(contact);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), "utf8");

    return result;
  }

  remove(email) {
    const result = {};
    const contacts = this.#loadContacts();

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
    const contacts = this.#loadContacts();

    result.loadedCount = contacts.length;
    result.contacts = contacts;

    return result;
  }

  search(name) {
    const result = {};
    const contacts = this.#loadContacts();

    result.loadedCount = contacts.length;

    const toSearch = name.toLowerCase();
    result.contacts = contacts.filter((c) =>
      c.name.toLowerCase().includes(toSearch),
    );

    return result;
  }
}

module.exports = new ContactService();
