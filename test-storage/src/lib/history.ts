
import { cloneDeep } from 'lodash'

export enum EACH_ORDER_TYPE {
  FIRST = 'first', // 顺序
  LAST = 'last' // 倒序
}

/**
 * 历史记录栈
 */
export class History<T> {
  cacheStack: Array<T[]>
  step: number
  constructor(cacheStack: T[]) {
    this.cacheStack = [cacheStack]
    this.step = 0
  }

  /**
   * 遍历cacheQueue
   * @param cb 遍历执行回调
   * @param order 倒叙 | 正序
   */
  each(cb?: (ele: T, i: number) => void, order = EACH_ORDER_TYPE.FIRST) {
    const cur = this.getCurrentStack()

    if (cur) {
      if (order === EACH_ORDER_TYPE.FIRST) {
        for (let i = 0; i < cur.length; i++) {
          cb?.(cur[i], i)
        }
      } else if (order === EACH_ORDER_TYPE.LAST) {
        for (let i = cur.length - 1; i >= 0; i--) {
          cb?.(cur[i], i)
        }
      }
    }
  }

  /**
   * 对缓存进行排序
   */
  sort(cb: (a: T, b: T) => number) {
    const last = at(this.cacheStack)
    last?.sort(cb)
  }

  /**
   * 添加数据
   */
  add(data: T) {
    // 如果在回退时添加数据就删除暂存数据
    if (this.step !== this.cacheStack.length - 1) {
      this.cacheStack.length = this.step + 1
    }

    const last = at(this.cacheStack)
    const newData = last ? [...cloneDeep(last), data] : [data]
    this.cacheStack.push(newData)
    this.step = this.cacheStack.length - 1
  }

  /**
   * 根据条件删除
   * @param key 删除条件匹配的key
   * @param value 删除条件匹配的值
   */
  delete<K extends keyof T>(key: K, value: T[K]) {
    if (this.step !== this.cacheStack.length - 1) {
      this.cacheStack.length = this.step + 1
    }
    const last = cloneDeep(at(this.cacheStack)) as T[]
    const newData =
      last?.filter((item) => {
        if (item && Object.hasOwn(item, key)) {
          return item[key] !== value
        }
        return false
      }) ?? []
    this.cacheStack.push(newData)
    this.step = this.cacheStack.length - 1
  }

  /**
   * 根据坐标删除
   * @param index 下标
   */
  deleteByIndex(index: number) {
    if (this.step !== this.cacheStack.length - 1) {
      this.cacheStack.length = this.step + 1
    }
    const newData = cloneDeep(at(this.cacheStack)) as T[]
    newData.splice(index, 1)
    this.cacheStack.push(newData)
    this.step = this.cacheStack.length - 1
  }

  /**
   * 后退
   */
  undo() {
    if (this.step >= 1) {
      this.step--
      return this.cacheStack[this.step]
    }
  }

  /**
   * 前进
   */
  redo() {
    if (this.step < this.cacheStack.length - 1) {
      this.step++
      return this.cacheStack[this.step]
    }
  }

  /**
   * 清空
   */
  clean() {
    this.cacheStack = [[]]
    this.step = 0
  }

  /**
   * 获取当前层
   */
  getCurrentStack() {
    return at(this.cacheStack, this.step < 0 ? 0 : this.step) as T[]
  }

  /**
   * 缓存栈插入数据
   * @param newData 插入数据
   * @param replaceData 需替换的数据
   * @returns 缓存栈
   */
  pushStack(newData: T[], replaceData?: T[]) {
    if (this.step !== this.cacheStack.length - 1) {
      this.cacheStack.length = this.step + 1
    }
    this.cacheStack.push(cloneDeep(newData))
    if (replaceData) {
      this.cacheStack[this.cacheStack.length - 2] = cloneDeep(replaceData)
    }
    this.step = this.cacheStack.length - 1
    return this.cacheStack
  }
}

/**
 * 获取数组元素，未传坐标时返回最后一个元素
 * @param arr 数组
 * @param n 坐标
 */
export const at = <T>(arr: T[], n?: number) => {
  n = n ?? arr.length - 1
  if (n < 0 || n >= arr.length) return undefined
  return arr[n]
}

