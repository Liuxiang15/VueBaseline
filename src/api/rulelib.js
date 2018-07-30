import axios from 'axios'
import {HOST} from '../utils/config'


const DATA_INDEX_API = HOST +'/data/index'
const GET_CONFIG_API = HOST+'/config/get_config'


export function findLibList(callback){
  return axios.get(DATA_INDEX_API).then(callback)
}
