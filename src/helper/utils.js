/**
 * 显示 返回顶部 按钮
 * 开始、结束、运动 三个过程中调用函数判断是否达到目标点
 * 1. requestAnimationFrame 执行动画并请求浏览器在下一次重绘之前调用指定的函数来更新动画。该方法使用一个回调函数作为参数，这个回调函数会在浏览器重绘之前调用。
 * 2. cancelAnimationFrame(requestID) 取消一个先前通过调用window.requestAnimationFrame()方法添加到计划中的动画帧请求.
 * requestID:先前调用window.requestAnimationFrame()方法时返回的ID.
 * 3. passive 目前Chrome主要利用该特性来优化页面的滑动性能，当前仅支持mousewheel/touch相关事件
 * 当属性passive的值为true的时候，代表该监听器内部不会调用preventDefault函数来阻止默认滑动行为，Chrome浏览器称这类型的监听器为被动（passive）监听器。
 * https://blog.csdn.net/dj0379/article/details/52883315
 */
export const showBack = callback => {
  let requestFram;
  let oldScrollTop;

  const moveEnd = () => {
    requestFram = requestAnimationFrame(() => {
      if(document.documentElement.scrollTop != oldScrollTop) { // 滑动了：上滑或下滑
        oldScrollTop = document.documentElement.scrollTop;
        moveEnd();
      }else{
        cancelAnimationFrame(requestFram);
      }
      showBackFn();
    });
  }
  //判断是否达到目标点
  const showBackFn = () => {
    if(document.documentElement.scrollTop > 500) {
      callback(true);
    }else {
      callback(false);
    }
  }
  
  document.addEventListener('scroll', () => {
    showBackFn();
  }, false)            // true - 在捕获阶段执行，false- 默认。在冒泡阶段执行
  document.addEventListener('touchstart', () => {
    showBackFn();
  }, {passive: true})
  document.addEventListener('touchmove', () => {
    showBackFn();
  }, {passive: true})
  document.addEventListener('touchend', () => {
    oldScrollTop = document.documentElement.scrollTop;
    moveEnd();
  }, {passive: true})
}
/**
 * 获取style样式
 */
export const getStyle = (element, attr, NumberMode = 'int') => {
  let target;
  // scrollTop 不属于css属性，获取方式不同，只有document.body才能用
  if(attr == 'scrollTop') {
    target = element.scrollTop;
  }else if(element.currentStyle){
    target = element.currentStyle[attr];
  }else {
    target = document.defaultView.getComputedStyle(element,null)[attr];
  }
  //在获取 opactiy 时需要获取小数 parseFloat
  return  NumberMode == 'float' ? parseFloat(target) : parseInt(target);
}
/**
 * 运动效果
 * @param {HTMLElement} element   运动对象，必选
 * @param {JSON}        target    属性：目标值，必选
 * @param {number}      duration  运动时间，可选
 * @param {string}      mode      运动模式，可选
 * @param {function}    callback  可选，回调函数，链式动画
 */
export const animate = (element, target, duration = 400, mode="ease-out", callback) => {
  clearInterval(element.timer);
  //判断不同参数的情况
  if(duration instanceof Function){
    callback = duration;
    duration = 400;
  }else if(duration instanceof String){
    mode = duration;
    duration = 400;
  }
  //判断不同参数的情况
  if(mode instanceof Function){
    callback = mode;
    mode = 'ease-out';
  }
  // 获取css样式(得到数字)
  const attrStyle = attr => {
    if(attr == 'opacity') {
      return Math.round(getStyle(element, attr, 'float'))*100;
    }else {
      return getStyle(element, attr);
    }
  }
  //根字体大小（以便下面将 rem 改成 px ）
  const rootSize = document.documentElement.style.fontSize;
  let unit = {};        // 存放单位（传入值）
  let initState  = {};   // 存放当前动画属性值

  // 存储 传入值的单位  （为下面rem转为px）
  Object.keys(target).forEach(attr => { // eg: scrollTop
    if(/[^\d^\.]+/gi.test(target[attr])) {  // 是否有单位(无论rem， px)
      unit[attr] = target[attr].match(/[^\d^\.]+/gi)[0] || 'px';
    }else {
      unit[attr] = 'px';
    }
    
  });
  // (当前状态值 ----动画----> 将来状态值)
  Object.keys(target).forEach(attr => { // eg: scrollTop
    //传入的值 （将来状态值）
    if(unit[attr] == 'rem') {  // 传入的值 ：rem 换算 px 后的值
      target[attr] = Math.ceil(parseInt(target[attr]) * rootSize);
    } else {
      target[attr] = parseInt(target[attr]);
    }
    // 当前状态值
    initState[attr]  = attrStyle(attr);
  });

  let flag = true;  // 运动到达终点
  const remberSpeed = {};   //上一个速度值（在ease-in模式下需要用到）
  
  element.timer = setInterval(() => {
    Object.keys(target).forEach(attr => {
      let iSpeed = 0;           // 每次移动的距离
      let intervalTime;         //到达目标，分多少步执行
      let iCurrent = attrStyle(attr) || 0;     //当前元素属性值

      let base = 0;           //基础值（ 目标点-基础值 = ）
      let status = false;     //是否还需要运动

      switch(mode) {
        case 'ease-out':
          base = iCurrent;
          intervalTime = duration*5/400;
          break;
        case 'linear': 
          base = initState[attr];
          intervalTime = duration*20/400;
          break;
        case 'ease-in': 
          let oldSpeed = remberSpeed[attr] || 0;
          iSpeed = oldSpeed + (target[attr] - initState[attr])/duration;
          remberSpeed[attr] = iSpeed;
          break;
        default:
          base = iCurrent;
          intervalTime = duration*5/400;
      }
      if(mode != 'ease-in') {
        // （ 目标点-基础值 = ）
        iSpeed = (target[attr] - base)/intervalTime;
        iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
      }
      //是否到达终点
      switch(mode) {
        case 'ease-out':
          status = iCurrent != target[attr];
          break;
        case 'linear': 
          status =  Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed);
          break;
        case 'ease-in':
          status = Math.abs(Math.abs(iCurrent) - Math.abs(target[attr])) > Math.abs(iSpeed); 
          break;
        default:
          status = iCurrent != target[attr];
      }
      // 仍需运动
      if(status) {
        flag = false;
        //opacity 和 scrollTop 需要特殊处理
        // 每隔一段时间，获取当前属性值iCurrent，移动距离（改变程度）iSpeed，直到到达终点
        if(attr == 'opacity') {
          element.style.filter = "alpha(opacity:" + (iCurrent + iSpeed) + ")";
          element.style.opacity = (iCurrent + iSpeed) / 100;
        } else if (attr == 'scrollTop') {
          element.scrollTop = iCurrent + iSpeed;
        } else {
          element.style[attr] = iCurrent + iSpeed + 'px';
        }
      } else {
        flag = true;
      }
      if (flag) {
        clearInterval(element.timer);
        if(callback) {
          callback();
        }
      }
    });
  }, 20);
}