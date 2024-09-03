import axios from 'axios'
import {ElMessage} from 'element-plus'


axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers['Access-Control-Allow-Origin'] = '*'
// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 100000
})

// request拦截器
service.interceptors.request.use(config => {

  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})


// 响应拦截器
service.interceptors.response.use(res => {
    // 未设置状态码则默认成功状态
    return res
  },
  error => {
    const code = error.response.status
    let {message, response} = error;
    console.log('request code: ' + code)
    console.log('response: ' + response)
    ElMessage({message: message, type: 'error', duration: 5 * 1000})
    return Promise.reject(error)
  }
)

export function postDownload(url, params) {
  return service.post(url, params, {
    responseType: 'blob',
  }).then(async (res) => {
    const data = res.data;
    let regFileNames = res.headers['content-disposition'] // 获取到Content-Disposition;filename
    let fileName = decodeURI(regFileNames.match(/=(.*)$/)[1]) // 文件名称  截取=后面的文件名称
    if (!data || data.size === 0) {
      Vue.prototype['$message'].warning('文件下载失败')
      return
    }
    if (typeof window.navigator.msSaveBlob !== 'undefined') {
      window.navigator.msSaveBlob(new Blob([data]), fileName)
    } else {
      let url = window.URL.createObjectURL(new Blob([data]), {type: "application/octet-stream"})
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName.replace(new RegExp('"', 'g'), ''))
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link) //下载完成移除元素
      window.URL.revokeObjectURL(url) //释放掉blob对象
    }

  }).catch((r) => {
    console.error(r)
    ElMessage.error('下载文件出现错误，请联系管理员！')
  })
}

export default service