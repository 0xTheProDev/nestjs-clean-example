declare global {
  namespace NodeJS {
    interface ProcessEnv {
      /** NodeJS Environment */
      NODE_ENV: "development" | "production" | "test";
      /** RDBMS Server Hostname */
      DATABASE_HOSTNAME: string;
      /** RDBMS Database Instance Name */
      DATABASE_NAME: string;
      /** RDBMS Server Passkey */
      DATABASE_PASSWORD: string;
      /** RDBMS Server Port */
      DATABASE_PORT: number;
      /** RDBMS Server Username */
      DATABASE_USERNAME: string;
    }
  }
}

/**
 * This file has no import/export statements (i.e. is a script).
 * Hence convert it into a module by adding an empty export statement.
 */
export {};
