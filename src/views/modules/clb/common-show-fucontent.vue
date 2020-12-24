<template>
  <el-dialog
    title="查看内容"
    customClass="customWidth"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <div v-html="dataForm.content"></div>
  </el-dialog>
</template>
<style>
  .customWidth{
    width:80%;
  }
</style>
<script>
  import OssSelect from '../base/ossfile-oss-select'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          content: ''}
      }
    },
    components: {
      OssSelect
    },
    methods: {
      init (id, url, i) {
        this.dataForm.id = id
        this.visible = true
        if (this.dataForm.id) {
          this.$http({
            url: url + `/${this.dataForm.id}?type=` + i,
            method: 'get'
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.dataForm.content = data.data.content
            }
          })
        }
      }
    }
  }
</script>

