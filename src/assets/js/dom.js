export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  // 利用空格 拆分
  let newClass = el.className.split(' ')
  newClass.push(className)
  // 然后 添加
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  // 利用正则表达式
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}
// 设置属性值 或 获取属性值
export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

// 智能判断浏览器属性，兼容样式，省去多余的兼容代码
let elStyle = document.createElement('div').style
// 识别浏览器内核
let browserVendor = (() => {
  // 以transform为引子
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (var key in transformNames) {
    console.log(transformNames[key])
    if (elStyle[transformNames[key]] !== undefined) {
      return key
    }
  }
  // 如果都不支持，那这个浏览器是有问题的
  return false
})()

export function prefixStyle(style) {
  if (browserVendor === false) {
    return false
  }
  if (browserVendor === 'standard') {
    return style
  }

  return browserVendor + style.charAt(0).toUpperCase() + style.substr(1)
}