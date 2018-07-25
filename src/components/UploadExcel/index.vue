<template>
  <div>
    <input id="excel-upload-input" ref="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div id="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      Drag excel file here or
      <el-button :loading="loading" style="margin-left:16px;" size="mini" type="primary" @click="handleUpload">Browse
      </el-button>

    </div>
  </div>
</template>

<script>
  import XLSX from 'xlsx'
  import {importExcel} from '../../api/import'

  // import { importExcel } from '@/api/article'

  export default {
    props: {
      beforeUpload: Function,
      onSuccess: Function
    },
    data() {
      return {
        loading: false,
        excelData: {
          header: null,
          results: null
        }
      }
    },
    methods: {
      generateDate({header, results}) {
        this.excelData.header = header
        this.excelData.results = results
        this.onSuccess && this.onSuccess(this.excelData)
      },
      handleDrop(e) {
        e.stopPropagation()
        e.preventDefault()
        if (this.loading) return
        const files = e.dataTransfer.files
        if (files.length !== 1) {
          this.$message.error('Only support uploading one file!')
          return
        }

        const rawFile = files[0] // only use files[0]


        let fname = rawFile.name
        let ext = fname.slice(fname.lastIndexOf(".") + 1).toLowerCase()
        let allow = $('#excel-upload-input').attr('accept')

        if (allow.indexOf(ext) === -1) {
          this.$message.error('Only support excel!')
          return
        }

        this.upload(rawFile)
        e.stopPropagation()
        e.preventDefault()
      },
      handleDragover(e) {
        e.stopPropagation()
        e.preventDefault()
        e.dataTransfer.dropEffect = 'copy'
      },
      handleUpload() {
        document.getElementById('excel-upload-input').click()
      },
      handleClick(e) {
        const files = e.target.files
        const rawFile = files[0] // only use files[0]
        if (!rawFile) return
        this.upload(rawFile)
      },

      upload(rawFile) {
        this.$refs['excel-upload-input'].value = null // fix can't select the same excel

        if (!this.beforeUpload) {
          this.readerData(rawFile)
          return
        }
        const before = this.beforeUpload(rawFile)
        if (before) {
          this.readerData(rawFile)
        }

        this.rawFile = rawFile
      },

      upload2Server() {
        // 使用then语法，或者新增callback参数

        if (this.rawFile == null) {
          this.$message.error('Please select excel file first')
          return
        }

        importExcel(this.rawFile, this.$route.params.metadata_id).then(result => {
          // console.log(result);
          // debugger;

          if (result.data.errmsg !== undefined) {
            this.$message.error(result.data.errmsg)
          } else {
            this.$router.push({
              path: '/data',
              name: "layout",
              props: true,
              params: {
                id: result.data.res._id
              },
              query: {
                meta_data: {metadata: result.data.res},
                //node_data: node_data
              }
            });

          }
        })
      },
      readerData(rawFile) {
        this.loading = true
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = e => {
            const data = e.target.result
            const fixedData = this.fixdata(data)
            const workbook = XLSX.read(btoa(fixedData), {type: 'base64'})
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            const header = this.get_header_row(worksheet)
            const results = XLSX.utils.sheet_to_json(worksheet)
            this.generateDate({header, results})
            this.loading = false
            resolve()
          }
          reader.readAsArrayBuffer(rawFile)
        })
      },
      fixdata(data) {
        let o = ''
        let l = 0
        const w = 10240
        for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
        o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
        return o
      },
      get_header_row(sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) { /* walk every column in the range */
          var cell = sheet[XLSX.utils.encode_cell({c: C, r: R})]
          /* find the cell in the first row */
          var hdr = 'UNKNOWN ' + C // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
        return headers
      }
    }
  }
</script>

<style scoped>
  #excel-upload-input {
    display: none;
    z-index: -9999;
  }

  #drop {
    border: 2px dashed #bbb;
    width: 600px;
    height: 160px;
    line-height: 160px;
    margin: 0 auto;
    font-size: 24px;
    border-radius: 5px;
    text-align: center;
    color: #bbb;
    position: relative;
  }
</style>
