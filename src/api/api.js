import request from '@/utils/request.js'

export default {
  getList() {
    return request.get('/category/list')
  }

}
