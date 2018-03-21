import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const SEARCH_MAX_LENGTH = 15

// 要存储到数组
// 要插入到值
// 比较函数==>不同的条件
// 最大值
function insertArray(arr, item, compare, maxlen) {
  const index = arr.findIndex(compare)
  // 如果是第一条记录，则直接返回
  if (index === 0) {
    return
  }
  if (index > 0) {
    // 在记录列表中删除该数据
    arr.splice(index, 1)
  }
  // !!! unshift() 方法可向数组的开头添加一个或更多元素，并返回新的长度。
  arr.unshift(item)
  if (maxlen && arr.length > maxlen) {
    // 删除最后一个
    arr.pop()
  }
}

// 缓存到 本地
export function saveSearch(query) {
  //  1.查询原有的
  let searches = storage.get(SEARCH_KEY, [])
  // 2.插入新的值
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  // 3.保存
  storage.set(SEARCH_KEY, searches)
  // 4.返回
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 删除单项
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
// 清空
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}