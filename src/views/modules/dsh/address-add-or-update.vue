<template>
  <el-dialog
    :title="'收货地址详情'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="600px">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
     <!-- <el-form-item label="用户id" prop="memberid">
        <el-input v-model="dataForm.memberid" placeholder="用户id"></el-input>
      </el-form-item>-->
      <el-form-item label="收货人姓名" prop="shouname">
        <el-input v-model="dataForm.shouname" placeholder="收货人姓名" disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="联系电话" disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="收货地址" prop="address">
        <el-input v-model="dataForm.address" placeholder="收货地址" disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailaddress">
        <el-input v-model="dataForm.detailaddress" placeholder="详细地址" disabled="false"></el-input>
      </el-form-item>
     <!-- <el-form-item label="是否是默认地址（1，不是 2，是）" prop="ismoren">
        <el-input v-model="dataForm.ismoren" placeholder="是否是默认地址（1，不是 2，是）"></el-input>
      </el-form-item>-->
      <el-form-item label="创建时间" prop="creattime">
        <el-input v-model="dataForm.creattime" placeholder="创建时间" disabled="false"></el-input>
      </el-form-item>
      <!--<el-form-item label="是否被删除（1，正常状态 2，被删除状态）" prop="isdel">
        <el-input v-model="dataForm.isdel" placeholder="是否被删除（1，正常状态 2，被删除状态）"></el-input>
      </el-form-item>-->
    </el-form>
    <!--<span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>-->
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
          shouname: '',
          phone: '',
          address: '',
          detailaddress: '',
          ismoren: '',
          creattime: '',
          isdel: ''},
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
              url: `/dsh/address/info/${this.dataForm.id}`,
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
                url: `/dsh/address`,
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
