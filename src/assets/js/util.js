function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let arrTmp = arr.slice(0)
  console.log(arrTmp)
  for (let i = 0; i < arrTmp.length; i++) {
    let j = getRandomInt(0, i)
    let tmp = arrTmp[i]
    arrTmp[i] = arrTmp[j]
    arrTmp[j] = tmp
  }
  return arrTmp
}

// 节流函数
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}