import axios from 'axios'
import {HOST} from '../utils/config'


const DATA_INDEX_API = HOST +'/data/index'
const GET_CONFIG_API = HOST+'/config/get_config'
const CREATE_LIB_API = HOST+'/data/create_metadata'
const LIB_DELETE_API = HOST+'/data/delete_metadata'
const LIBNAME_CHANGE_API = HOST+'/data/change_lib_name'
const GET_METADAtA_BYID_API = HOST + '/data/get_metadata'
const GET_EXCEL_HISTORY = HOST + '/excel/excel_history'

export function findLibList(callback){
  console.log(DATA_INDEX_API)
  return axios.get(DATA_INDEX_API).then(callback);
}

export function createRuleLib(callback){
  return axios.post(CREATE_LIB_API).then(callback);
}

export function _libDelete(post_data){
  return axios.post(LIB_DELETE_API, post_data);
}

export function changeLibName(post_data){
  return axios.post(LIBNAME_CHANGE_API, post_data);
}

export function getMetadataById(post_data, callback){
  return axios.post(GET_METADAtA_BYID_API, post).then(callback);
}

export function getExcelHistoryById(post_data, callback){
  return axios.post(GET_EXCEL_HISTORY, post).then(callback);
}
