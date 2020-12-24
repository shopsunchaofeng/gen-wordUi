<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="快递公司名称" prop="kuaidi">
        <el-input v-model="dataForm.kuaidi" placeholder="快递公司名称"></el-input>
      </el-form-item>
      <el-form-item label="快递单号" prop="kuaidino">
        <el-input v-model="dataForm.kuaidino" placeholder="快递单号"></el-input>
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
          memberid: '',
          orderno: '',
          type: '',
          price: '',
          walletprice: '',
          totalprice: '',
          jifen: '',
          status: '',
          creattime: '',
          kuaidi: '',
          kuaidino: '',
          addressid: '',
          fukuantime: '',
          fahuotime: '',
          chengjiaotime: ''},
        dataRule: {
          kuaidi: [
            {required: true, message: '快递公司名称不能为空', trigger: 'blur'}
          ],
          kuaidino: [
            {required: true, message: '快递单号不能为空', trigger: 'blur'}
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
              url: `/dsh/order/info/${this.dataForm.id}`,
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
                url: `/dsh/order/fahuo`,
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
