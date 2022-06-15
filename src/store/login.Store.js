import { makeAutoObservable } from 'mobx'
import { http, setToken, getToken, removeToken } from '@/utils'
class LoginStore {
  token = getToken() || ''
  constructor() {
    makeAutoObservable(this)
  }
  login = async ({ mobile, code }) => {
    const res = await http.post('/authorizations', {
      mobile,
      code,
    })
    // console.log(res.data);
    this.token = res.data.token
    setToken(this.token)
  }
  loginOut = () => {
    this.token = ''
    removeToken()
  }
}

export default LoginStore
