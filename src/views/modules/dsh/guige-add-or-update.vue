<template>
  <el-dialog
    :append-to-body="true"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="规格名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="规格名称"></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="kucun">
        <el-input-number v-model="dataForm.kucun" :min="1" :max="999999999"  placeholder="库存"></el-input-number>
      </el-form-item>
      <el-form-item label="序号" prop="xuhao">
        <el-input-number v-model="dataForm.xuhao" :min="0" :max="999999999"  placeholder="序号"></el-input-number>
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
          kucun: '',
          xuhao: '',
          goodsid: ''},
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
              url: `/dsh/guige/info/${this.dataForm.id}`,
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
        this.visible = false
        let data = this.dataForm
        this.$emit('refreshDataList', data)
      }
    }
  }
</script>
