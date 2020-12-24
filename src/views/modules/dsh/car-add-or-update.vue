<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="商品id" prop="goodid">
        <el-input v-model="dataForm.goodid" placeholder="商品id"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goodnum">
        <el-input v-model="dataForm.goodnum" placeholder="商品数量"></el-input>
      </el-form-item>
      <el-form-item label="用户id" prop="memberid">
        <el-input v-model="dataForm.memberid" placeholder="用户id"></el-input>
      </el-form-item>
      <el-form-item label="类型（1，普通商品  2，积分商品）" prop="type">
        <el-input v-model="dataForm.type" placeholder="类型（1，普通商品  2，积分商品）"></el-input>
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
          goodid: '',
          goodnum: '',
          memberid: '',
          type: '',
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
              url: `/dsh/car/info/${this.dataForm.id}`,
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
                url: `/dsh/car`,
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
