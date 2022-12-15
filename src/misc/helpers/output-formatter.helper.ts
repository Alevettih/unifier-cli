import { cyan, dim, grey, red, yellow } from 'ansi-colors';

export class OutputFormatter {
  static danger(...messages: string[]): string {
    return OutputFormatter.show(red.bold, ...messages);
  }

  static accent(...message: string[]): string {
    return OutputFormatter.show(cyan, ...message);
  }

  static info(...messages: string[]): string {
    return OutputFormatter.show(dim, ...messages);
  }

  static warning(...messages: string[]): string {
    return OutputFormatter.show(yellow.bold, ...messages);
  }

  static code(...messages: string[]): string {
    return OutputFormatter.show(grey.italic, ...messages);
  }

  static show(color: (value: string) => string, ...messages: string[]): string {
    return messages.map((message: string): string => color(message)).join('\n› ');
  }
}
