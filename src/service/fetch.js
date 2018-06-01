import {baseUrl} from '@/assets/js/env'

export default async (url= '', data = {}, type = 'GET', method = 'fetch') => {
  type = type.toUpperCase();
  url = baseUrl + url;
  if(type == 'GET') {
    let dataStr = ''; // 拼接字符串
    // 循环对象 for...in 或 Object.keys()
    Object.keys(data).forEach(key => {
      dataStr += key + '=' +data[key] + '&';
    });
    if(dataStr != '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }  
  }
  
  if(window.fetch && method == 'fetch') {
    let requestConfig = {
      credentials: 'include',     // 把cookie发送给服务器
			method: type,
			headers: {
				'Accept': 'application/json',      // 用户代理可处理的媒体类型
				'Content-Type': 'application/json' // 报文主体对象类型
			},
			mode: "cors",   // 跨域
      cache: "force-cache"
      // body: ""         // 要发送到后台的参数
    };
    // JSON.parse(string) ：接受一个 JSON 字符串并将其转换成一个 JavaScript 对象。    jsonStr ='{"name":"Liza", "password":"123"}'
    // JSON.stringify(obj) ：接受一个 JavaScript 对象并将其转换为一个 JSON 字符串。   jsonObj = {"name":"Liza", "password":"123"}
    if(type == 'POST') {
      // Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      });
    }
    // fetch()方法返回的是一个promise对象
    try{
      const r = await fetch(url, requestConfig);
      const rJson = await r.json();
      return rJson;
      // return r;
    } catch (err) {
      throw new Error(err);
    }  
  } else {
    return new Promise((resolve, reject) => {
			let ajax;
			if (window.XMLHttpRequest) {
				ajax = new XMLHttpRequest();
			} else {
				ajax = new ActiveXObject;
			}

			let sendData = '';
			if (type == 'POST') {
				sendData = JSON.stringify(data);
			}

			ajax.open(type, url, true);
			ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			ajax.send(sendData);

			ajax.onreadystatechange = () => {
				if (ajax.readyState == 4) {
					if (ajax.status == 200) {
						let obj = ajax.response
						if (typeof obj != 'object') {
							obj = JSON.parse(obj);
						}
						resolve(obj)
					} else {
						reject(ajax)
					}
				}
			}
		})
  }
};