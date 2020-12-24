<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="订单id" prop="orderid">
        <el-input v-model="dataForm.orderid" placeholder="订单id"></el-input>
      </el-form-item>
      <el-form-item label="产生收益人的id" prop="smemberid">
        <el-input v-model="dataForm.smemberid" placeholder="产生收益人的id"></el-input>
      </el-form-item>
      <el-form-item label="消费者id" prop="memberid">
        <el-input v-model="dataForm.memberid" placeholder="消费者id"></el-input>
      </el-form-item>
      <el-form-item label="产生收益的上级id" prop="sid">
        <el-input v-model="dataForm.sid" placeholder="产生收益的上级id"></el-input>
      </el-form-item>
      <el-form-item label="产生收益的上上级id" prop="ssid">
        <el-input v-model="dataForm.ssid" placeholder="产生收益的上上级id"></el-input>
      </el-form-item>
      <el-form-item label="分享人的id" prop="fenxiangid">
        <el-input v-model="dataForm.fenxiangid" placeholder="分享人的id"></el-input>
      </el-form-item>
      <el-form-item label="收益类型(1,积分收益  2，佣金收益)" prop="type">
        <el-input v-model="dataForm.type" placeholder="收益类型(1,积分收益  2，佣金收益)"></el-input>
      </el-form-item>
      <el-form-item label="积分值" prop="jifen">
        <el-input v-model="dataForm.jifen" placeholder="积分值"></el-input>
      </el-form-item>
      <el-form-item label="佣金" prop="price">
        <el-input v-model="dataForm.price" placeholder="佣金"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="creattime">
        <el-input v-model="dataForm.creattime" placeholder="创建时间"></el-input>
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
          orderid: '',
          smemberid: '',
          memberid: '',
          sid: '',
          ssid: '',
          fenxiangid: '',
          type: '',
          jifen: '',
          price: '',
          creattime: ''},
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
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
              url: `/dsh/shouyi/info/${this.dataForm.id}`,
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
                url: `/dsh/shouyi`,
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
