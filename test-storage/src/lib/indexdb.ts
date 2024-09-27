export type DBTable = {
  dbName: string;
  table: string;
  version?: number;
  storage?: any;
};

/**
 * Web缓存类，用于封装存储和获取对象值
 * @author huangsq
 */
export default class IndexedDB {

  dbName: string;
  table: string;
  version: number = 1;
  storage: any;
  #openDB: Promise<unknown>;

  /**
   * 删除指定数据库
   * @param dbName 数据库名称
   */
  static deleteDB(dbName: string) {
    window.indexedDB?.deleteDatabase(dbName);
  }

  constructor(options: DBTable) {
    const { dbName, table, version = 1, ...args } = options;
    this.dbName = dbName;
    this.table = table;
    this.version = version;

    if (!indexedDB) {
      throw Error('你的浏览器不支持indexedDB')
    }

    if (table?.length < 1) {
      throw Error('表名不能为空')
    }

    this.#openDB = this.openDB({ dbName, table, version, ...args });
  }


  /**
   * 获取当前数据库下指定表和主键对应的值,通过回调函数返回数据
   * @param key 主键，key为null返回所有记录
   * @returns request
   */
  async get(key?: string): Promise<any> {
    await this.#openDB;
    const table = this.table;
    const transaction = this.storage.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    let request: any = null;
    if (key) {
      request = store.get(key);
    } else {
      request = store.getAll();
    }

    return new Promise((resolve, reject) => {
      request.onsuccess = (event: { target: { result: any } }) => {
        resolve(event?.target?.result);
      };
      request.onerror = (event: any) => {
        console.error(event);
        reject(event);
      };
    })
  }

  /**
   * 新增或更新数据到指定的表和主键中
   * @param key 主键
   * @param value 值
   * @returns request
   */
  async set(key: string, value: any): Promise<Event> {
    await this.#openDB;
    const table = this.table;
    const transaction = this.storage.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    const request = store.put(value, key);
    return new Promise((resolve, reject) => {
      request.onsuccess = (event: any) => {
        resolve(event);
      };
      request.onerror = (event: any) => {
        reject(event);
      };
    })
  }


  /* 根据主键删除指定表和主键中数据
   * @param table 表名
  * @param key 主键
  * @returns request
  */
  async delete(key: string): Promise<Event> {
    await this.#openDB;
    const table = this.table;
    const transaction = this.storage.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    const request = store.delete(key)
    return new Promise((resolve, reject) => {
      request.onsuccess = (event: Event) => {
        resolve(event)
      };
      request.onerror = (event: Event) => {
        reject(event)
      };
    })
  }

  /**
   * 清空表数据
   */
  async clear(): Promise<Event> {
    await this.#openDB;
    const table = this.table;
    const transaction = this.storage.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    const request = store.clear();
    return new Promise((resolve, reject) => {
      request.onsuccess = (event: Event) => {
        resolve(event)
      };
      request.onerror = (event: Event) => {
        reject(event)
      };
    })
  }

  /**
   * 获取数据库对象
   */
  async getDB() {
    await this.#openDB;
    return this.storage;
  }

  /**
   * 关闭数据库连接
   */
  closeDB() {
    if (this.storage) {
      this.storage.close();
    }
  }

  /**
   * 打开数据库
   * @param options
   * @returns
   */
  async openDB(options: DBTable): Promise<Event> {
    const { dbName, table, version } = options;
    const { indexedDB } = window;
    const request = indexedDB.open(dbName, version);
    return new Promise((resolve, reject) => {
      request.onerror = (event) => {
        console.error(`打开数据库失败: ${(event.target as IDBRequest)?.error?.message}`);
        reject(event);
      };

      request.onsuccess = (event) => {
        this.storage = (event.target as IDBRequest)?.result;
        resolve(event);
      };

      request.onupgradeneeded = (event) => {
        this.storage = (event.target as IDBRequest)?.result;
        if (!this.storage.objectStoreNames.contains(table)) {
          this.storage.createObjectStore(table);
        }
      };
    })
  }
}

