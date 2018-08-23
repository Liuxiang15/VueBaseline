import axios from 'axios'
import {HOST} from '../utils/config'


const PUBLIC_LIB_API = HOST +'/data/index'
const PRIVATE_LIB_API = HOST + '/data/private_index'
const GET_CONFIG_API = HOST+'/config/get_config'
const CREATE_PUBLIC_LIB_API = HOST+'/data/create_metadata'
const CREATE_PRIVATE_LIB_API = HOST + '/data/create_private_metadata'
const LIB_DELETE_API = HOST+'/data/delete_metadata'
const LIBNAME_CHANGE_API = HOST+'/data/change_lib_name'
const GET_METADAtA_BYID_API = HOST + '/data/get_metadata'
const GET_EXCEL_HISTORY = HOST + '/excel/excel_history'
const CHECK_ALL_SNL = HOST + '/data/check_snl_all'


export function findPublicLibList(callback){
  console.log(PUBLIC_LIB_API)
  return axios.get(PUBLIC_LIB_API).then(callback);
}

export function findPrivateLibList(postdata, callback){
  return axios.post(PRIVATE_LIB_API, postdata).then(callback);
}

export function createRuleLib(postdata, callback){
  return axios.post(CREATE_PUBLIC_LIB_API, postdata).then(callback);
}

export function createPrivateRuleLib(postdata, callback){
  return axios.post(CREATE_PRIVATE_LIB_API, postdata,).then(callback);
}

export function _libDelete(post_data){
  return axios.post(LIB_DELETE_API, post_data);
}

export function changeLibName(post_data){
  return axios.post(LIBNAME_CHANGE_API, post_data);
}

export function getMetadataById(post_data, callback){
  return axios.post(GET_METADAtA_BYID_API, post_data).then(callback);
}

export function getExcelHistoryById(post_data, callback){
  return axios.post(GET_EXCEL_HISTORY, post_data).then(callback);
}

export function getConfigById(post_data, callback){
  return axios.post(GET_CONFIG_API, post_data).then(callback);
}

export  function checkAllSNL(post_data, callback){
  return axios.post(CHECK_ALL_SNL, post_data).then(callback);
}
