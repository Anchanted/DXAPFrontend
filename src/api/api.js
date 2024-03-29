import axios from 'axios'
import store from 'store'
import alert from 'plugins/AlertMessage'
import i18n from 'locales'
import { decryptByAES } from "assets/js/aesUtils"
import HttpError from "assets/js/HttpError"
// const qs = require('qs')

const instance = axios.create()

instance.defaults.baseURL = process.env.VUE_APP_BASE_API
instance.defaults.headers['Content-type'] = 'application/x-www-form-urlencoded'
instance.defaults.withCredentials = true
instance.defaults.timeout = 10000

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  res => Promise.resolve(res),
  // 请求失败
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.msg);
      return Promise.reject(new HttpError(response.data.msg, response.status, response));
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      if (!window.navigator.onLine) {
        store.commit('changeNetwork', false);
      } else {
        return Promise.reject(new HttpError("Connection Error", null, error));
      }
    }
  })

const errorHandle = (status, other) => {
  // 状态码判断
  switch (status) {
    // // 401: 未登录状态，跳转登录页
    // case 401:
    //   toLogin();
    //   break;
    // // 403 token过期
    // // 清除token并跳转登录页
    // case 403:
    //   tip('登录过期，请重新登录');
    //   localStorage.removeItem('token');
    //   store.commit('loginSuccess', null);
    //   setTimeout(() => {
    //     toLogin();
    //   }, 1000);
    //   break;
    // 404请求不存在
    case 404:
      alert({
        message: '请求的资源不存在',
        time: 3000
      });
      break;
    default:
      console.log(status, other);
      alert({
        message: status,
        time: 3000
      })
    }}

const api = {
  get: (url, params, options = {}) => {
    return new Promise((resolve, reject) =>{
      instance.get(url, {
        params,
        headers: {
          "Content-Language": i18n.locale || "en" + ", " + i18n.fallbackLocale || "en"
        },
        ...options
      }).then(res => {
        if (res.status === 200 && res.data.code === 1) {
          try {
            const data = res.data.data
            resolve(typeof data == "string" ? JSON.parse(decryptByAES(data)) : data)
          } catch (error) {
            reject(error)
          }
        }
        else {
          reject(new HttpError(res.data.msg, res.status, res))
        }
      }).catch(err => reject(err))
    })
  }
}

export default api
