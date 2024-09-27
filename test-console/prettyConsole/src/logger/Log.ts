type Color =
  | 'primary'
  | 'success'
  | 'info'
  | 'warning'
  | 'danger'
  | 'error'
  | 'log';

const COLORS: Color[] = [
  'primary',
  'success',
  'info',
  'warning',
  'danger',
  'error',
  'log',
];

const COLOR_MAP: Record<Color, string> = {
  primary: '#2d8cf0',
  success: '#19be6b',
  info: '#909399',
  warning: '#ff9900',
  danger: '#35495E',
  error: '#FF0000',
  log: '#0000ff',
};

const getColor = (type: Color) => COLOR_MAP[type];

export class Log {
  static instance: Log;
  constructor() {
    // 单例
    if (!Log.instance) {
      this.createLog(this.#nsLog.bind(this));
      Log.instance = this;
    }
    return Log.instance;
  }

  #nsLog = (type: Color, ns: string, msg: string, ...args: any[]) => {
    const color = getColor(type);
    return console.log(
      `%c ${ns} %c ${msg} %c ${args.length ? '%o' : ''}`,
      `background:${color};border:1px solid ${color}; padding: 1px; border-radius: 4px 0 0 4px; color: #fff;`,
      `border:1px solid ${color}; padding: 1px; border-radius: 0 4px 4px 0; color: ${color};`,
      'background:transparent',
      ...args
    );
  };

  createLog = <T extends any[]>(
    fn: (type: Color, ...args: T) => void
  ): Record<Color, (...args: T) => void> => {
    return COLORS.reduce((logs, type) => {
      (this as any)[type] = (...args: T) => fn(type, ...args);
      return logs;
    }, {} as Record<Color, (...args: T) => void>);
  };
}