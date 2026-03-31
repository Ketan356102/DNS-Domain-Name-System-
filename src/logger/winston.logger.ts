import winston, { format as winstonFormat, transports as winstonTransports, Logger } from "winston";

const levels: winston.config.AbstractConfigSetLevels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const level = (): keyof typeof levels => {
    const env = process.env.NODE_ENV || "development";
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "warn";
};

const colors: winston.config.AbstractConfigSetColors = {
    error: "red",
    warn: "yellow",
    info: "blue",
    http: " magenta",
    debug: "white",
};

winston.addColors(colors);

const logFormat = winstonFormat.combine(
    // Add the message timestamp with the preferred format
    winstonFormat.timestamp({ format: "DD MMM, YYYY - HH:mm:ss:ms" }),
    // Tell Winston that the logs must be colored
    winstonFormat.colorize({ all: true }),
    // Define the format of the message showing the timestamp, the level, and the message
    winstonFormat.printf(
        (info) => `[${info.timestamp}] ${info.level}: ${info.message}`
    )
);

const loggerTransports: winston.transport[] = [
    // Allow the use of the console to print the messages
    new winstonTransports.Console(),
    new winstonTransports.File({ filename: "logs/error.log", level: "error" }),
    new winstonTransports.File({ filename: "logs/info.log", level: "info" }),
    new winstonTransports.File({ filename: "logs/http.log", level: "http" }),
];

const logger: Logger = winston.createLogger({
    level: level() as string,
    levels,
    format: logFormat,
    transports: loggerTransports,
});

export default logger;