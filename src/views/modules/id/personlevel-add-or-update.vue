<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="星级名称" prop="levelName">
        <el-input v-model="dataForm.levelName" placeholder="星级名称"></el-input>
      </el-form-item>
      <el-form-item label="升级金额" prop="expendMoney">
        <el-input v-model="dataForm.expendMoney" placeholder="升级金额"></el-input>
      </el-form-item>
      <el-form-item label="折扣率" prop="discount">
        <el-input v-model="dataForm.discount" placeholder="0表示不折扣"></el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-switch v-model="statusSwitchStatus" @change="statusSwitch" inactive-text="禁用" active-text="启用"></el-switch>
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
          levelName: '',
          weight: 1,
          expendMoney: '',
          discount: 0,
          status: 1,
          isDelete: 1,
          systemId: '',
          clentId: '',
          appId: '',
          crtTime: '',
          crtHost: ''},
        dataRule: {
          levelName: [
            {required: true, message: '名称不能为空', trigger: 'blur'},
            {min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur'}
          ],
          expendMoney: [
            {required: true, message: '升级所需金额不能为空', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                var reg = /^-?\d{1,9}(?:\.\d{1,2})?$/
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error('请输入正确的金额(小数点后两位)！'))
                }
              },
              trigger: 'blur'
            }
          ],
          discount: [
            {required: true, message: '折扣率不能为空', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                var reg = /^-?\d{1,9}(?:\.\d{1,2})?$/
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error('请输入正确的折扣率(小数点后两位)！'))
                }
              },
              trigger: 'blur'
            }
          ]
        },
        statusSwitchStatus: true
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
              url: `/id/personlevel/info/${this.dataForm.id}`,
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
                url: `/id/personlevel`,
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
      },
      statusSwitch () {
        console.info('statusSwitch')
        if (this.dataForm.status === 1) {
          this.dataForm.status = 0
          this.statusSwitchStatus = false
        } else {
          this.dataForm.status = 1
          this.statusSwitchStatus = true
        }
        console.info(this.dataForm.status)
      }
    }
  }
</script>
