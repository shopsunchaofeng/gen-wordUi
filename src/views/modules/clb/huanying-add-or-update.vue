<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label=" 显示时长" prop="timelength">
        <el-input v-model="dataForm.timelength" placeholder=" 显示时长"></el-input>
      </el-form-item>
      <el-form-item label="第一张图片">
        <el-button type="primary" @click="selectOssHandle()">第一张图片<i class="el-icon-upload el-icon--right"></i></el-button>
        <el-button type="primary" @click="deltupian(1)">删除</el-button>
      </el-form-item>
      <el-form-item label="" prop="image1">
        <el-image style="width: 100px; height: 100px" v-if="dataForm.image1" :src="dataForm.image1" fit="scale-down"></el-image>
      </el-form-item>
      <el-form-item label="第一张图文详情" prop="content1">
        <ueditor v-model="dataForm.content1"></ueditor>
      </el-form-item>
      <el-form-item label="第二张图片">
        <el-button type="primary" @click="selectOssHandle2()">第二张图片<i class="el-icon-upload el-icon--right"></i></el-button>
        <el-button type="primary" @click="deltupian(2)">删除</el-button>
      </el-form-item>
      <el-form-item label="" prop="image2">
        <el-image style="width: 100px; height: 100px" v-if="dataForm.image2" :src="dataForm.image2" fit="scale-down"></el-image>
      </el-form-item>
      <el-form-item label="第二张图文图文详情" prop="content2">
        <ueditor v-model="dataForm.content2"></ueditor>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 弹窗, 选择文件 -->
    <ossSelect v-if="selectOssVisible" ref="ossSelectRef" @selectData='callbackOss(arguments)' ></ossSelect>
    <!-- 弹窗, 选择文件 -->
    <ossSelect v-if="selectOssVisible2" ref="ossSelectRef2" @selectData='callbackOss2(arguments)' ></ossSelect>
  </el-dialog>
</template>

<script>
  import OssSelect from '../base/ossfile-oss-select'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: 0,
          timelength: '',
          image1: '',
          content1: '',
          image2: '',
          content2: '',
          updatetime: ''},
        selectOssVisible: false,
        selectOssVisible2: false,
        dataRule: {
          timelength: [
            {required: true, message: '显示时长不能为空', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                var reg = /^[1-9]\d*$/
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error('请输入大于零的正整数！'))
                }
              },
              trigger: 'blur'
            }
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
              url: `/clb/huanying/info/${this.dataForm.id}`,
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
        this.dataForm.image1 = param[1][0]
      },
      // 选择文件
      selectOssHandle2 () {
        this.selectOssVisible2 = true
        this.$nextTick(() => {
          this.$refs.ossSelectRef2.init(false)
        })
      },
      // 删除图片
      deltupian (i) {
        if (i === 1) {
          this.dataForm.image1 = ''
        }
        if (i === 2) {
          this.dataForm.image2 = ''
        }
      },
      callbackOss2 (param) {
        // this.dataForm.imageId = param[0][0]
        this.dataForm.image2 = param[1][0]
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/clb/huanying`,
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
