import type { LogEntry, LogCategory } from '../types';

type LogListener = () => void;

class LogService {
  private logs: LogEntry[] = [];
  private listeners: Set<LogListener> = new Set();

  public log(message: string, category: LogCategory): void {
    const newEntry: LogEntry = {
      timestamp: new Date(),
      message,
      category,
    };
    this.logs.push(newEntry);
    console.log(`[${category}] ${message}`);
    this.notifyListeners();
  }

  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  public clearLogs(): void {
    this.logs = [];
    this.notifyListeners();
  }

  public subscribe(listener: LogListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }
}

export const logService = new LogService();