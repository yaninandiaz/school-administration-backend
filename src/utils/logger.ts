import { transports, format, createLogger } from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const setLevel = () => {
  const env = process.env.ENVIRONMENT || "development";

  const isDevelopment = env == "development";

  return isDevelopment ? "debug" : "http";
};

const winTransports = [
  new transports.File({ filename: "logs/error.log", level: "error" }),
  new transports.File({ filename: "logs/all.log" }),
];

const winFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  format.printf((info) => `${info.timestamp}  ${info.level} | ${info.message}`)
);

const Logger = createLogger({
  levels,
  level: setLevel(),
  transports: winTransports,
  format: winFormat,
});

export default Logger;