export class DebugLog {
  static info(message: string, ...data: unknown[]) {
    message = this.formatMessage(message);    
    console.log(`${new Date().toISOString()} [INFO] ${message}`);
    if (data.length > 0) {
      for (const item of data) {
        console.log(item);
      }
    }
  }

  static warn(message: string) {
    message = this.formatMessage(message);
    console.warn(`${new Date().toISOString()} [WARN] ${message}`);
  }

  static error(message: string, error?: unknown) {
    message = this.formatMessage(message);
    console.error(`${new Date().toISOString()} [ERROR] ${message}`);
    if (error) {
      console.error(error);
    }
  }

  static debug(message: string, data?: unknown[]) {
    message = this.formatMessage(message);
    console.debug(`${new Date().toISOString()} [DEBUG] ${message}`);
    if (data) {
      console.debug(data);
    }
  }

  private static formatMessage(message: string): string {
    const startNewLine = message.startsWith('\n');
    if (startNewLine) {
      console.log(); // Print new line before log message
      message = message.slice(1); // Remove leading newline for consistent formatting
    }
    return message;
  }
}