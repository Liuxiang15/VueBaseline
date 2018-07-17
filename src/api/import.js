import request from 'request'
import axios from 'axios'

export function importExcel(file) {
  debugger;

  let formData = new FormData();
  formData.append('file', file)

  // return request({
  //   url: 'http://127.0.0.1:8099/excel/importExcel',
  //   method: 'post',
  //   data: formData
  // })


  $.post('http://127.0.0.1:8099/excel/importExcel', formData, {
    // progress(event) {
    //   //传递给父组件的progress方法
    //   self.$emit('progress', parseFloat(event.loaded / event.total * 100), flag)
    // }
  }).then(response => {
    const result = response.body
    if (result.hash && result.key) {
      //传递给父组件的complete方法
      self.$emit('complete', 200, result, flag)
      //让当前target可以重新选择
      event.target.value = null
    } else {
      self.$emit('complete', 500, result, flag)
    }
  }, error => self.$emit('complete', 500, error.message), flag)


}



