const { validateEmail } = require("../utils/validation");
const contactService = require("../Services/contactService");

function handleCommand(args) {

    const [command, ...cmdArgs] = args;
    if (!command) return;

    switch (command) {
        case "add":
            add(cmdArgs);
            break;
        case "list":
            list();
            break;
        case "search":
            search(cmdArgs);
            break;
        case "delete":
            remove(cmdArgs);
            break;
        case "help":
            printHelp();
            break;
        default:
            throw new Error(
                `Unknown command '${command}'\nUsage: node contacts.js [add|list|search|delete|help] [arguments]`
            );
    }
}

function add(args) {
    const [name, email, phone] = args;
    if (!name || !email || !phone) {
        throw new Error('Missing arguments for add command\nUsage: node contacts.js add "name" "email" "phone"');
    }
    validateEmail(email);
    console.log("Loading contacts from contacts.json...");
    const result = contactService.add(name, email, phone);
    if (result.isDuplicate) {
        console.log(`✓ Loaded ${result.loadedCount} contacts`);
        throw new Error("Contact with this email already exists");
    }
    if (result.loadedCount === 0) {
        console.log(`✗ File not found - creating new contact list`);
    } else {
        console.log(`✓ Loaded ${result.loadedCount} contacts`);
    }
    console.log(`✓ Contact added: ${name}`);
    console.log(`✓ Contacts saved to contacts.json`);
}

function list() {
    console.log("Loading contacts from contacts.json...");
    const result = contactService.list();
    if (result.loadedCount === 0) {
        console.log("=== No Contacts ===");
        return;
    }
    console.log(`✓ Loaded ${result.loadedCount} contacts\n`);
    printContactsList("All Contacts", result.contacts);
}

function search(args) {
    const [query] = args;
    if (!query) {
        throw new Error('Missing query for search command\nUsage: node contacts.js search "query"');
    }
    console.log("Loading contacts from contacts.json...");
    const result = contactService.search(query);
    if (result.loadedCount === 0) {
        console.log("=== No Contacts ===");
        return;
    }
    console.log(`✓ Loaded ${result.loadedCount} contacts\n`);
    console.log(`=== Search Results for "${query}" ===`);
    if (result.contacts.length === 0) {
        console.log(`No contacts found matching "${query}"`);
    } else {
        printContactsList("All Contacts", result.contacts);
    }
}

function remove(args) {
    const [email] = args;
    if (!email) {
        throw new Error('Missing email for delete command\nUsage: node contacts.js delete "email"');
    }
    console.log("Loading contacts from contacts.json...");
    const result = contactService.remove(email);
    if (result.loadedCount === 0) {
        console.log("=== No Contacts ===");
        return;
    }
    console.log(`✓ Loaded ${result.loadedCount} contacts`);
    if (result.contactNotFound) {
        console.log(`✗ Error: No contact found with email: ${email}`);
    } else {
        console.log(`Contact deleted: ${result.deletedName}`);
        console.log(`✓ Contacts saved to contacts.json`);
    }
}

function printContactsList(title, contacts) {
    console.log(`=== ${title} ===`);
    contacts.forEach((contact, index) => {
        console.log(`${index + 1}. ${contact.name} - ${contact.email} - ${contact.phone}`);
    });
}

function printHelp() {
    console.log(`Usage: node contacts.js [command] [arguments]

Commands:
  add "name" "email" "phone"  - Add a new contact
  list                        - List all contacts
  search "query"              - Search contacts by name or email
  delete "email"              - Delete contact by email
  help                        - Show this help message

Examples:
  node contacts.js add "John Doe" "john@example.com" "555-123-4567"
  node contacts.js search "john"
  node contacts.js delete "john@example.com"`);
}

module.exports = { handleCommand };