<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="昵称" prop="nicename">
        <el-input v-model="dataForm.nicename" placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="积分值" prop="jifen">
        <el-input v-model="dataForm.jifen" placeholder="积分值"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="image">
        <el-button type="primary" @click="selectOssHandle()">头像<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-form-item>
      <el-form-item label="" prop="image1">
        <el-image style="width: 100px; height: 100px" v-if="dataForm.image" :src="dataForm.image" fit="scale-down"></el-image>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 弹窗, 选择文件 -->
    <ossSelect v-show="selectOssVisible" ref="ossSelectRef" @selectData='callbackOss(arguments)' ></ossSelect>
  </el-dialog>
</template>

<script>
  import OssSelect from '../base/ossfile-oss-select'
  export default {
    data () {
      return {
        visible: false,
        selectOssVisible: false,
        dataForm: {
          id: 0,
          uid: '',
          phone: '',
          nicename: '',
          image: '',
          sid: '',
          ssid: '',
          identity: '',
          isfordden: '',
          account: '',
          jifen: '',
          zhifubao: '',
          times: '',
          creattime: ''},
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    components: {
      OssSelect
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: `/dsh/member/info/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm = data.data
              }
            })
          }
        })
      },
      // 选择文件
      selectOssHandle () {
        this.selectOssVisible = true
        this.$nextTick(() => {
          this.$refs.ossSelectRef.init(false)
        })
      },
      callbackOss (param) {
        // this.dataForm.imageId = param[0][0]
        this.dataForm.image = param[1][0]
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/dsh/member`,
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
