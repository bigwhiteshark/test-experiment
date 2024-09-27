import { Log } from './Log';
Object.assign(Log.prototype, console);

export default new Log();
