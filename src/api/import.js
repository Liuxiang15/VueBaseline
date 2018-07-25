import axios from 'axios'
import {HOST} from '../utils/config'


export function importExcel(file,metadata_id) {

  let formData = new FormData();
  formData.append('file', file)
  formData.append('metadata_id',metadata_id)

  console.log(HOST + '/excel/importExcel')

  return axios.post(HOST + '/excel/importExcel', formData)
}



