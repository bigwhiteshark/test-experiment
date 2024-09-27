export type DBTable = {
  dbName: string;
  tables: string[];
  version?: number;
  callback?: any;
  storage?: any;
};

/**
 * Web缓存类，用于封装存储和获取对象值
 * @author huangsq
 */
export default class IndexedDB {
  dbName: string;

  tables: string[];

  version: number;

  callback?: any;

  storage: any;

  /**
   * 删除指定数据库
   * @param dbName 数据库名称
   */
  static deleteDB(dbName: string) {
    window.indexedDB?.deleteDatabase(dbName);
  }

  constructor(options: DBTable) {
    const { dbName, tables, version = 1, ...args } = options;
    this.dbName = dbName;
    this.tables = tables;
    this.version = version;
    this.openDB({ dbName, tables, version, ...args });
  }

  /**
   * 根据主键删除指定表和主键中数据
   * @param table 表名
   * @param key 主键
   * @param callback 回调函数
   * @returns request
   */
  deleteItem(table: string, key: string, callback?: (args: any) => void) {
    const request = this.storage.transaction(table, 'readwrite').objectStore(table).delete(key);
    request.onsuccess = (event: any) => {
      if (typeof callback === 'function') {
        callback(event);
      }
    };
    return request;
  }

  /**
   * 获取当前数据库下指定表和主键对应的值,通过回调函数返回数据
   * @param table 表名
   * @param key 主键，key为null返回所有记录
   * @param callback 回调函数
   * @returns request
   */
  getItem(table: string, key: string | null, callback: any) {
    // 第二个参数可以省略
    const transaction = this.storage.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    let request: any = null;
    if (key) {
      request = store.get(key);
    } else {
      request = store.getAll();
    }

    request.onsuccess = (event: { target: { result: any } }) => {
      if (typeof callback === 'function') {
        callback(event?.target?.result);
      }
    };
    request.onerror = (event: any) => {
      console.error(event);
      callback(event);
    };
    return request;
  }

  /**
   * 新增或更新数据到指定的表和主键中
   * @param table 表名
   * @param key 主键
   * @param value 值
   * @param callback 回调函数
   * @returns request
   */
  setItem(table: string, key: string, value: any, callback?: (args: any) => void) {
    const transaction = this.storage.transaction(table, 'readwrite');
    const store = transaction.objectStore(table);
    const request = store.put(value, key);
    request.onsuccess = (event: any) => {
      if (typeof callback === 'function') {
        callback(event);
      }
    };
    request.onerror = (event: any) => {
      if (typeof callback === 'function') {
        callback(event);
      }
    };
    return request;
  }

  /**
   * 获取第一个表中主键对应的值,通过回调函数返回数据
   * @param key 主键，key为null返回所有记录
   * @param callback 回调函数
   * @returns request
   */
  get(key: string | null, callback: any) {
    return this.getItem(this.tables[0], key, callback);
  }

  /**
   * 新增或更新数据到第一个表中主键对应的值
   * @param key 主键
   * @param value 值
   * @param callback 回调函数
   * @returns request
   */
  set(key: string, value: any, callback?: (args: any) => void | null) {
    return this.setItem(this.tables[0], key, value, callback);
  }

  /**
   * 根据主键删除指定表和主键中数据
   * @param table 表名
   * @param key 主键
   * @param callback 回调函数
   * @returns request
   */
  delete(key: string, callback?: (args: any) => void) {
    return this.deleteItem(this.tables[0], key, callback);
  }

  /**
   * 清空表数据
   */
  clear(table: string, callback?: (args: any) => void) {
    const request = this.storage.transaction(this.dbName, 'readwrite').objectStore(table).clear();
    request.onsuccess = (event: any) => {
      if (typeof callback === 'function') {
        callback(event);
      }
    };
    return request;
  }

  /**
   * 获取数据库对象
   */
  getDB(): any {
    return this.storage;
  }

  /**
   * 关闭数据库连接
   */
  closeDB() {
    this.storage.close();
  }

  /**
   * 打开数据库
   * @param options
   * @returns
   */
  openDB(options: DBTable) {
    const { dbName, tables, version, callback } = options;
    const { indexedDB } = window;
    if (!indexedDB) {
      console.error('你的浏览器不支持indexedDB');
      return;
    }
    if (tables?.length < 1) {
      console.error('表名不能为空');
      return;
    }
    const request = indexedDB.open(dbName, version);
    request.onerror = (event) => {
      console.error(`打开数据库失败: ${(event.target as IDBRequest)?.error?.message}`);
      if (typeof callback === 'function') {
        callback(event);
      }
    };

    request.onsuccess = (event) => {
      this.storage = (event.target as IDBRequest)?.result;
      if (typeof callback === 'function') {
        callback(this.storage);
      }
    };

    request.onupgradeneeded = (event) => {
      this.storage = (event.target as IDBRequest)?.result;
      tables.forEach((table) => {
        if (!this.storage.objectStoreNames.contains(table)) {
          this.storage.createObjectStore(table);
          // this.storage.createObjectStore(table, {
          //   keyPath: 'id',
          // });
          if (typeof callback === 'function') {
            callback(event);
          }
        }
      });
    };
  }
}

