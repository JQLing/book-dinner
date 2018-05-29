import {getStyle} from '@/helper/utils'
import {imgBaseUrl} from '@/assets/js/env'

export const loadMore = {
  directives: {
    //到达底部加载更多数据
    'load-more': {
      // 一个指令定义对象可以提供如下几个钩子函数 (均为可选)：bind,inserted,update,componentUpdated,unbind
      // bind：只调用一次，指令第一次绑定到元素时调用。可以进行一次性的初始化设置
      // el：指令所绑定的元素，可以用来直接操作 DOM 。binding：一个对象，包含以下属性:name, value, ...
      bind: (el, binding) => {
        let windowHeight = window.screen.height;       // 屏幕分辨率的高
        let height;      // 加载出数据的总高度
        let setTop;
        let paddingBottom;
        let marginBottom;
        let oldScrollTop;
        
        let scrollEl;
        let heightEl;
        // el.attributes 属性返回指定节点属性的集合。
        let scrollType = el.attributes.type && el.attributes.type.value;
        let scrollReduce = 2;
        let requestFram;

        if(scrollType == 2) {
          scrollEl = el;
          heightEl = el.children[0];
        } else {
          scrollEl = document.body;     // msite页面：scrollType=el.attributes.type.value=1
          heightEl = el;
        }

        const loadMore = () => {
          // scrollTop卷起的高度，直到能把最后一条数据显示出来
          if(scrollEl.scrollTop + windowHeight >=  height + setTop + paddingBottom + marginBottom - scrollReduce) {
            // binding.value：指令的绑定值。在这里值是一个函数,调用函数
            binding.value();
          }
        }
        const moveEnd = () => {
          requestFram = requestAnimationFrame(() => {
            if(scrollEl.scrollTop != oldScrollTop.scrollTop) {
              oldScrollTop = scrollEl.scrollTop;
              moveEnd();
            } else {
              cancelAnimationFrame(requestFram);
              height = heightEl.clientHeight;
              loadMore();
            }
          });  
        }

        el.addEventListener('touchstart', () => {
          setTop = el.offsetTop;
          height = el.clientHeight;
          if(scrollType == 2) {
            height = height;
          }
          paddingBottom = getStyle(el, 'paddingBottom');
          marginBottom = getStyle(el, 'marginBottom');
        }, false);
        el.addEventListener('touchmove', () => {
          loadMore();
        }, false);
        el.addEventListener('touchend', () => {
          oldScrollTop = scrollEl.scrollTop;
          moveEnd();
        }, false);
      }
    }
  }
};
export const getImgPath = {};