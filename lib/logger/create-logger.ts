import {
  createLogger as createWinstonLogger,
  type LogEntry,
  format,
  transports,
} from "winston";
import type * as winston from "winston";
import chalk from "chalk";
import { EventEmitter } from "events";
import { getEnvironment, getEnvironmentVar } from "../utils/environment";

const { blue, yellow, green, red } = chalk;

const COLOR_LEVELS: { [key: string]: typeof chalk.blue } = {
  debug: blue,
  info: green,
  warn: yellow,
  error: red,
};

export interface ILogger extends EventEmitter {
  log: (entry: LogEntry) => void;
  flush?: () => Promise<void>;
}

export const LogEvents = {
  logError: "logError",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function jsonSafeStringify(object: any): string {
  try {
    return JSON.stringify(object, null, 2);
  } catch {
    return `[failed to json-stringify object with keys: ${Object.keys(
      object
    ).join(",")}]`;
  }
}

function logToString({ entry, env }: { entry: LogEntry; env: string }): string {
  let log = `[${entry.level.toUpperCase()}] ${entry.message}`;

  const data: any = { ...entry };
  delete data.level;
  delete data.message;
  const stack = data.error?.stack;
  delete data.error?.stack;

  // Create the data we're going to print
  const printData = { ...data };

  // Add the stack as part of the logged data so that Cloudwatch writes it correctly
  if (stack) {
    printData.errorStack = stack.split("\n");
  }

  // Write the data in JSON form if we have any
  if (Object.keys(printData).length > 0) {
    log += ` ${jsonSafeStringify(printData)}`;
  }

  // If production, kill newlines because cloudwatch sucks at it and creates multiple
  // entries per line of text
  // Otherwise add a timestamp
  const format = getEnvironmentVar("LOG_FORMAT");
  if (env === "production" && (!format || format === "cloudwatch")) {
    log = log.replace(/\r?\n/gm, "\r");
  } else {
    log = `${new Date().toISOString()}: ${log}`;
  }

  const colorFn = COLOR_LEVELS[entry.level];
  if (colorFn) {
    return colorFn(log);
  }
  return log;
}

function createLogFormat(): winston.Logform.Format {
  const env = getEnvironment();
  return format.printf((info) => {
    return logToString({ entry: info as LogEntry, env });
  });
}

async function createLogger(): Promise<ILogger> {
  const level = getLevel();
  const logFormat = createLogFormat();
  return createWinstonLogger({
    level,
    format: logFormat,
    transports: [new transports.Console()],
  });
}

export function createLoggerSync(): ILogger {
  class SyncLogger extends EventEmitter implements ILogger {
    private static _asyncLogger?: ILogger;
    private static _asyncCreation?: Promise<ILogger>;

    log(entry: LogEntry): void {
      if (entry.level === "error") {
        this.emit(LogEvents.logError, entry);
      }

      // Once we have our logger, just send it along
      if (SyncLogger._asyncLogger) {
        SyncLogger._asyncLogger.log(entry);
        return;
      }

      // Start creating the async logger
      if (!SyncLogger._asyncCreation) {
        this.startCreatingLogger();
      }

      // Wait until the async logger is ready and then pass along the entry
      SyncLogger._asyncCreation = SyncLogger._asyncCreation!.then((logger) => {
        logger.log(entry);
        return logger;
      });
    }

    async flush(): Promise<void> {
      if (!SyncLogger._asyncCreation) {
        this.startCreatingLogger();
      }
      await SyncLogger._asyncCreation;
    }

    private startCreatingLogger(): void {
      SyncLogger._asyncCreation = createLogger().then(
        (logger) => (SyncLogger._asyncLogger = logger)
      );
    }
  }
  return new SyncLogger();
}

function getLevel(): string {
  const level = getEnvironmentVar("LOG_LEVEL");
  if (level) {
    return level;
  }
  const env = getEnvironment();
  if (env === "production") {
    return "error";
  }
  return "debug";
}
