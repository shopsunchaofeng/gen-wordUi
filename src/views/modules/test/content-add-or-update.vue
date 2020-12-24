<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="系统名称" prop="gensystem">
        <el-input v-model="dataForm.gensystem" placeholder="系统名称"></el-input>
      </el-form-item>
      <el-form-item label="定级单位" prop="gencompany">
        <el-input v-model="dataForm.gencompany" placeholder="定级单位"></el-input>
      </el-form-item>
      <el-form-item label="打钩（索引 多个用逗号隔开）" prop="dagou">
        <el-input v-model="dataForm.dagou" placeholder="打钩（索引 多个用逗号隔开）"></el-input>
      </el-form-item>
      <el-form-item label="涂色索引（多个用逗号隔开）" prop="tuse">
        <el-input v-model="dataForm.tuse" placeholder="涂色索引（多个用逗号隔开）"></el-input>
      </el-form-item>
      <el-form-item label="修改时间" prop="updatetime">
        <el-input v-model="dataForm.updatetime" placeholder="修改时间"></el-input>
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
          gensystem: '',
          gencompany: '',
          dagou: '',
          tuse: '',
          updatetime: '',
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
              url: `/gen/content/info/${this.dataForm.id}`,
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
                url: `/gen/content`,
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
