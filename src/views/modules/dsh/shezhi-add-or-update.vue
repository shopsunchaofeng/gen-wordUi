<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="购买热销商品累计获得积分达到一定数量" prop="leijijifen" label-width="280px">
        <el-input v-model="dataForm.leijijifen" placeholder="购买热销商品累计获得积分达到一定数量"></el-input>
      </el-form-item>
      <el-form-item label="返累计总积分千分比(‰)" prop="lejijifensale" label-width="280px">
        <el-input-number v-model="dataForm.lejijifensale" placeholder="返累计总积分百分比(%)"></el-input-number>
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
          leijijifen: '',
          lejijifensale: ''},
        dataRule: {
          lejijifensale: [
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          leijijifen: [
            {required: true, message: '不能为空', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                var reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error('请输入一个最多保留两位小数的值！'))
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
              url: `/dsh/shezhi/info/${this.dataForm.id}`,
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
                url: `/dsh/shezhi`,
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
