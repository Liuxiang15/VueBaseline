import axios from 'axios'
import {HOST} from '../utils/config'

const LOGIN_API = HOST + '/login/login_alpha'

export function loginByUsername(post_data, callback){
  return axios.post(LOGIN_API, post_data).then(callback);
}
