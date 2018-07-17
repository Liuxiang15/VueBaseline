import axios from 'axios'
import {HOST} from '../utils/config'


export function importExcel(file) {

  let formData = new FormData();
  formData.append('file', file)

  console.log(HOST + '/excel/importExcel')

  return axios.post(HOST + '/excel/importExcel', formData)
}



