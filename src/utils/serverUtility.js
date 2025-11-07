import figlet from "figlet";
import { serverConfig } from "../config/env.js";

export function displayBanner() {
  const banner = figlet.textSync('Anivoy', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });

  console.log('\n' + banner);
  console.log(`Service Template v1.0.0 [${serverConfig.MODE}]\n`);
};

export async function gracefulShutdown(server) {
  console.log('\nShutdown signal received');
  console.log('Closing server...');

  server.close(async () => {
    console.log('Server closed');
    console.log('Disconnecting database...');

    try {
      await prisma.$disconnect();
      console.log('Database disconnected');
    } catch (error) {
      console.log(`Error disconnecting database: ${error.message}`);
    }

    console.log('Goodbye\n');
    process.exit(0);
  });

  setTimeout(() => {
    console.log('Forced shutdown - timeout exceeded');
    process.exit(1);
  }, 10000);
};
