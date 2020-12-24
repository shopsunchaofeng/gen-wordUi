<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="积分提现百分比(%)" prop="jifentixian" label-width="20%">
        <el-input v-model="dataForm.jifentixian" placeholder="积分提现百分比(%)"></el-input>
      </el-form-item>
      <el-form-item label="余额提现最低额度（元）" prop="tixian"  label-width="20%">
        <el-input v-model="dataForm.tixian" placeholder="余额提现最低额度（元）"></el-input>
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
          jifentixian: '',
          tixian: ''},
        dataRule: {
          jifentixian: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                var reg = /^[1-9]\d*$/
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error('请输入大于零的正整数！'))
                }
              },
              trigger: 'blur'
            }
          ],
          tixian: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                var reg = /^[1-9]\d*$/
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error('请输入大于零的正整数！'))
                }
              },
              trigger: 'blur'
            }
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
              url: `/dsh/scale/info/${this.dataForm.id}`,
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
                url: `/dsh/scale`,
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
