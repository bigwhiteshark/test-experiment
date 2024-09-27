type Command = {
  redo: Function;
  undo: Function;
  groupId?: string;
};

type UndoManagerOptions = {
  limit: number;
};

export default class UndoManager {
  commands: Array<Command> = [];
  index = -1;
  limit = 0;
  isExecuting = false;
  callback?: Function;

  constructor(public options: UndoManagerOptions) {
    this.limit = options.limit;
  }

  /**
   * Executes a single command.
   * @property {object} command        - Command
   * @property {function} command.undo - Undo function
   * @property {function} command.redo - Redo function
   * @property {string} action         - "undo" or "redo"
   */
  execute(command: Command, action: string) {
    if (!command || typeof command[action as keyof Command] !== "function") {
      return this;
    }
    this.isExecuting = true;

    if (action === "undo" || action === "redo") {
      command[action]();
    }

    this.isExecuting = false;
    return this;
  }

  /**
   * Adds a command to the queue.
   * @property {object} command           - Command
   * @property {function} command.undo    - Undo function
   * @property {function} command.redo    - Redo function
   * @property {string} [command.groupId] - Optional group id
   */
  add(command: Command) {
    if (this.isExecuting) {
      return this;
    }
    const { commands, limit, callback } = this;
    // if we are here after having called undo,
    // invalidate items higher on the stack
    commands.splice(this.index + 1, commands.length - this.index);
    commands.push(command);

    // if limit is set, remove items from the start
    if (limit && commands.length > limit) {
      removeFromTo(commands, 0, -(limit + 1));
    }

    // set the current index to the end
    this.index = commands.length - 1;
    if (callback) {
      callback();
    }
    return this;
  }

  /**
   * Pass a function to be called on undo and redo actions.
   * @property {function} callbackFunc - Callback function
   */
  setCallback(callbackFunc: Function) {
    this.callback = callbackFunc;
  }

  /**
   * Performs undo: call the undo function at the current index and decrease the index by 1.
   */
  undo() {
    debugger;
    const { commands, callback } = this;
    let command = commands[this.index];
    if (!command) {
      return this;
    }

    const groupId = command.groupId;
    while (command.groupId === groupId) {
      this.execute(command, "undo");
      this.index -= 1;
      command = commands[this.index];
      if (!command || !command.groupId) break;
    }

    if (callback) {
      callback();
    }
    return this;
  }

  /**
   * Performs redo: call the redo function at the next index and increase the index by 1.
   */
  redo() {
    const { commands, callback } = this;
    let command = commands[this.index + 1];
    if (!command) {
      return this;
    }

    const groupId = command.groupId;
    while (command.groupId === groupId) {
      this.execute(command, "redo");
      this.index += 1;
      command = commands[this.index + 1];
      if (!command || !command.groupId) break;
    }

    if (callback) {
      callback();
    }
    return this;
  }

  /**
   * Clears the memory, losing all stored states. Resets the index.
   */
  clear() {
    const { commands, callback } = this;
    let prev_size = commands.length;

    this.commands = [];
    this.index = -1;

    if (callback && prev_size > 0) {
      callback();
    }
  }

  /**
   * Tests if any undo actions exist.
   * @returns {boolean}
   */
  hasUndo(): boolean {
    return this.index !== -1;
  }

  /**
   * Tests if any redo actions exist.
   * @returns {boolean}
   */
  hasRedo(): boolean {
    return this.index < this.commands.length - 1;
  }

  /**
   * Returns the list of queued commands.
   * @param {string} [groupId] - Optionally filter commands by group ID
   * @returns {array}
   */
  getCommands(groupId: string): Array<Command> {
    const { commands } = this;
    return groupId
      ? commands.filter((c: Command) => c.groupId === groupId)
      : commands;
  }

  /**
   * Returns the index of the actions list.
   * @returns {number}
   */
  getIndex(): number {
    return this.index;
  }

  /**
   * Sets the maximum number of undo steps. Default: 0 (unlimited).
   * @property {number} max - Maximum number of undo steps
   */
  setLimit(max: number) {
    this.limit = max;
  }
}

/**
 * Removes a range of items from an array.
 * Negative indices are calculated from the end of the array.
 * @param {Array} array - Array to remove range from
 * @param {number} from - Start index (inclusive)
 * @param {number} [to] - End index (exclusive), default to from + 1
 * @returns {number} The new length of the array
 */
function removeFromTo(array: Command[], from: number, to?: number): number {
  // Calculate actual indices
  const actualFrom = from < 0 ? array.length + from : from;
  const actualTo = to ? (to < 0 ? array.length + to : to) : from + 1;
  // Remove items
  console.log(array, actualFrom, actualTo, 1 + actualTo - actualFrom);
  array.splice(actualFrom, 1 + actualTo - actualFrom);
  // Return new length
  return array.length;
}
