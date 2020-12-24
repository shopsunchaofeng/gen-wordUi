<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="版本号" prop="versionno">
        <el-input v-model="dataForm.versionno" placeholder="版本号"></el-input>
      </el-form-item>
      <el-form-item label="版本" prop="version">
        <el-input v-model="dataForm.version" placeholder="版本"></el-input>
      </el-form-item>
      <el-form-item label="下载链接" prop="downurl">
        <el-input v-model="dataForm.downurl" placeholder="下载链接"></el-input>
      </el-form-item>
      <el-form-item label="版本说明" prop="content">
        <ueditor v-model="dataForm.content"></ueditor>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio-button label="1">ios</el-radio-button>
          <el-radio-button label="2">android</el-radio-button>
        </el-radio-group>
       <!-- <el-input v-model="dataForm.type" placeholder="类型 1，ios 2，android"></el-input>-->
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          versionno: '',
          version: '',
          downurl: '',
          type: '',
          content: '',
          creattime: '',
          updatetime: ''},
        dataRule: {
          versionno: [
            {required: true, message: '版本号不能为空', trigger: 'blur'}
          ],
          version: [
            {required: true, message: '版本不能为空', trigger: 'blur'}
          ],
          downurl: [
            {required: true, message: '下载链接不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '类型不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: `/clb/version/info/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm = data.data
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/clb/version`,
                method: `${!this.dataForm.id || 0 ? 'post' : 'put'}`,
                data: this.dataForm
              }).then(({data}) => {
                if (data && data.code === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500
                  })
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            }
          })
      }
    }
  }
</script>
