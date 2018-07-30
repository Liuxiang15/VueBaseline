import axios from 'axios'
import {HOST} from '../utils/config'


const IMPORT_EXCEL_API = HOST +  '/excel/importExcel'


export function importExcel(file,metadata_id) {

  let formData = new FormData();
  formData.append('file', file)
  formData.append('metadata_id',metadata_id)

  return axios.post(IMPORT_EXCEL_API, formData)
}
