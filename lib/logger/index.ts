import { BaseError } from "../errors";
import { createLoggerSync, LogEvents } from "./create-logger";
import type { LogEntry as WinstonLogEntry } from "winston";
import { EventEmitter } from "events";

export { LogEvents };

export type LogLevel = "error" | "warn" | "info" | "debug";

export type DebugNamespace = "(no debug namespaces yet)";

export interface LogEntry {
  message?: string;
  error?: Error;
  level?: LogLevel;
  [key: string]: unknown;
}

export class Logger {
  private static logger = createLoggerSync();

  static get events(): EventEmitter {
    return Logger.logger;
  }

  static log(entry: LogEntry): void {
    entry.level = entry.level || "info";
    if (
      entry.error instanceof BaseError &&
      !(entry.error as BaseError).isInternal
    ) {
      entry.level = entry.level || "warn";
    }
    if (!entry.message) {
      if (entry.error instanceof Error) {
        entry.message = entry.error.message;
      }
      if (!entry.message) {
        entry.message = "(no message logged)";
      }
    }
    if (entry.error) {
      entry.error = {
        ...entry.error,
        stack: entry.error.stack,
        name: entry.error.name,
      };
    }
    Logger.logger.log(entry as WinstonLogEntry);
  }

  static error(entry: LogEntry): void {
    this.log({ ...entry, level: "error" });
  }

  static warn(entry: LogEntry): void {
    this.log({ ...entry, level: "warn" });
  }

  static debug(entry: LogEntry): void {
    if (!entry.namespace) {
      this.log({ ...entry, level: "debug" });
    }
  }

  static async flush(): Promise<void> {
    if (this.logger.flush) {
      await this.logger.flush();
    }
  }
}
