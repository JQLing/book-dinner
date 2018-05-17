(function(doc, win) {
  var docEl = doc.documentElement,
      resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
      recalc = function() {
          var clientWidth = docEl.clientWidth;
          if (!clientWidth) return;
          // iphone5分辨率为640*1136，iphone6的分辨率是750*1334，
          // 640/2 = 320; 750/2= 375;  
          
          // 如果页面的宽度超过了640px，那么页面中html的font-size恒为100px，
          // 否则，页面中html的font-size的大小为： 100 * (当前页面宽度 / 640)
          // 设计图一般是640px的，这样相当于100px = 1rem，
          // 当deviceWidth大于设计稿的横向分辨率时，html的font-size始终等于
          if(clientWidth >= 640){
            docEl.style.fontSize = '100px';
          }else{
            docEl.style.fontSize = 100 * (clientWidth / 640) + 'px';
          }
          // docEl.style.fontSize = 20 * (clientWidth / 320) + 'px';  // 设置根字体是20px,   50px就是0.4rem
      };

  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);