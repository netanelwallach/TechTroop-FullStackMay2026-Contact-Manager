const { handleCommand } = require('./commands/commandHandler');


function main() {
    const args = process.argv.slice(2);
    try {
        handleCommand(args);
    } catch (error) {
        console.error(`✗ Error: ${error.message}`);
    }
}

main();