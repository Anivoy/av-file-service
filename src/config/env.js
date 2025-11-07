import { config } from "dotenv";
config();

const serverConfig = Object.freeze({
  PORT: parseInt(process.env.PORT || "5087"),
  MODE: process.env.NODE_ENV || "production",
});

export {
  serverConfig
}