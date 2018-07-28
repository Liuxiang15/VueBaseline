import axios from 'axios'
import {HOST} from '../utils/config'


const IMPORT_EXCEL_API = HOST +  '/excel/importExcel'
const DATA_INDEX_API = HOST +'/data/index'
const GET_CONFIG_API = HOST+'/config/get_config'


export function importExcel(file,metadata_id) {

  let formData = new FormData();
  formData.append('file', file)
  formData.append('metadata_id',metadata_id)

  return axios.post(IMPORT_EXCEL_API, formData)
}


export function requestData(method, data, api){
  //先只考虑method为POST的情况
  // console.log("进入requestData函数！！！");
  // axios.post({
  // //7 向站点请求{"_id":"5b470ba5fc6a38858a673ec8","lib_name":"Component Check"}的数组
  //   // method:'POST',
  //   url:api,
  //   data: data,
  // }).then(response=>{
  //   console.log("in requestData ");
  //   console.log(response.data);
  //   return response.data;
  //   // var config = response.data.config;
  //   // this.$router.push({
  //   //   path: '/config',
  //   //   name: "config" ,
  //   //   props: true,
  //   //   params:{
  //   //     config: config,
  //   //   }
  //   // });
  // }).catch(function(err){
  //   console.log(err);
  //   return "requestData 出错：err";
  // });
}
