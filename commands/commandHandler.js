module.exports = { handleCommand };

const { validateEmail } = require("../utils/validation");
const contactService = require("../Services/contactService");

function handleCommand(args) {
  const command = args[0];

  if (!command) {
    return;
  }
  let result;

  switch (command) {
    case "add":
      if (!args[1] || !args[2] || !args[3]) {
        throw new Error(
          'Missing arguments for add command\nUsage: node contacts.js add "name" "email" "phone"',
        );
      }
      validateEmail(args[2]);
      console.log(`Loading contacts from contacts.json...`);
      result = contactService.add(args[1], args[2], args[3]);
      if (result.isDuplicate) {
        console.log(`✓ Loaded ${result.loadedCount} contacts`);
        throw new Error("Contact with this email already exists");
      }
      if (result.loadedCount === 0) {
        console.log(`✗ File not found - creating new contact list`);
      } else {
        console.log(`✓ Loaded ${result.loadedCount} contacts`);
      }
      console.log(`✓ Contact added: ${args[1]}`);
      console.log(`✓ Contacts saved to contacts.json`);
      break;

    case "list":
      console.log("Loading contacts from contacts.json...");
      result = contactService.list();
      if (result.loadedCount === 0) {
        console.log("=== No Contacts ===");
        break;
      }
      console.log(`✓ Loaded ${result.loadedCount} contacts\n`);
      console.log("=== All Contacts ===");
      result.contacts.forEach((contact, index) => {
        console.log(
          `${index + 1}. ${contact.name} - ${contact.email} - ${contact.phone}`,
        );
      });
      break;

    case "search":
      if (!args[1]) {
        throw new Error(
          'Missing query for search command\nUsage: node contacts.js search "query"',
        );
      }
      console.log("Loading contacts from contacts.json...");
      result = contactService.search(args[1]);
      if (result.loadedCount === 0) {
        console.log("=== No Contacts ===");
        break;
      }
      console.log(`✓ Loaded ${result.loadedCount} contacts\n`);
      console.log(`=== Search Results for "${args[1]}" ===`);
      if (result.contacts.length === 0) {
        console.log(`No contacts found matching "${args[1]}"`);
      } else {
        console.log("=== All Contacts ===");
        result.contacts.forEach((contact, index) => {
          console.log(
            `${index + 1}. ${contact.name} - ${contact.email} - ${contact.phone}`,
          );
        });
      }
      break;

    case "delete":
      if (!args[1]) {
        throw new Error(
          'Missing email for delete command\nUsage: node contacts.js delete "email"',
        );
      }
      console.log("Loading contacts from contacts.json...");
      result = contactService.remove(args[1]);
      if (result.loadedCount === 0) {
        console.log("=== No Contacts ===");
        break;
      }
      console.log(`✓ Loaded ${result.loadedCount} contacts`);
      if (result.contactNotFound) {
        console.log(`✗ Error: No contact found with email: "${args[1]}"`);
      } else {
        console.log(`Contact deleted: "${result.deletedName}"`);
        console.log(`✓ Contacts saved to contacts.json`);
      }
      break;

    case "help":
      printHelp();
      break;

    default:
      throw new Error(
        `Unknown command '${command}'\nUsage: node contacts.js [add|list|search|delete|help] [arguments]`,
      );
  }
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
