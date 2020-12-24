<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="位置名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="广告位名"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="displayType">
        <el-radio-group v-model="dataForm.displayType">
          <el-radio v-for="(displayType, index) in displayTypeList" :label="index+1" :key="index+1">{{ displayType }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="宽" prop="width">
        <el-input-number v-model="dataForm.width" controls-position="right" :min="1" :max="999999"></el-input-number>
      </el-form-item>
      <el-form-item label="高" prop="height">
        <el-input-number v-model="dataForm.height" controls-position="right" :min="1" :max="999999"></el-input-number>
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
          name: '',
          displayType: '',
          width: '',
          height: '',
          systemId: '',
          clentId: '',
          appId: '',
          crtTime: ''},
        displayTypeList: ['首页', '首页中部', '首页底部'],
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          displayType: [
            {required: true, message: '显示区域不能为空', trigger: 'blur'}
          ],
          width: [
            {required: true, message: '宽度不能为空', trigger: 'blur'}
          ],
          height: [
            {required: true, message: '宽度不能为空', trigger: 'blur'}
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
              url: `/id/adposition/info/${this.dataForm.id}`,
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
                url: `/id/adposition`,
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
