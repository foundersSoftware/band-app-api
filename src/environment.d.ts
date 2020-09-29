declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SECRET_KEY: string;
      NODE_ENV: "development" | "production";
      AWS_ACCESS_KEY_ID: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
    }
  }
}

// this is the accepted standard to force typescript to treat this file
// as a module
export {};
