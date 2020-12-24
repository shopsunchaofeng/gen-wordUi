<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="审核" prop="status">
        <el-radio-group v-model="dataForm.status">
          <el-radio :label=2>审核通过</el-radio>
          <el-radio :label=3>审核不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="驳回原因" prop="reason"  v-if="isshow" label-width="80px">
        <el-input v-model="dataForm.reason" placeholder="驳回原因"></el-input>
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
        isshow: false,
        dataForm: {
          id: 0,
          memberid: '',
          type: '',
          jifen: '',
          price: '',
          status: '',
          reason: '',
          zhifubao: '',
          creattime: '',
          shenhetime: ''},
        dataRule: {
          status: [
            {required: true, message: '请审核!', trigger: 'blur'}
          ],
          reason: [
            {
              validator (rule, value, callback) {
                var reg = /\S/
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error('请填写驳回原因！'))
                }
              },
              trigger: 'blur'
            }
          ]
        }
      }
    },
    watch: {
      'dataForm.status': function (newVal) {
        if (newVal === 3) {
          this.isshow = true
        } else {
          this.isshow = false
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
              url: `/dsh/tixian/info/${this.dataForm.id}`,
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
                url: `/dsh/tixian`,
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
