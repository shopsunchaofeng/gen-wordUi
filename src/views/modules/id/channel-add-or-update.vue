<template>
  <el-dialog customClass="customWidth"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
        <el-form-item label="名称" prop="name">
          <el-input v-model="dataForm.name" placeholder="名称"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="显示区域" prop="displayType">
            <el-radio-group v-model="dataForm.displayType">
              <el-radio-button label="1">首页</el-radio-button>
              <el-radio-button label="2">其他</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="轮播类型" prop="channelType">
        <el-radio-group v-model="dataForm.channelType">
          <el-radio-button label="1">图片</el-radio-button>
          <el-radio-button label="2">视频</el-radio-button>
          <el-radio-button label="3">文字</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item label="跳转地址" prop="url">
         <el-col :span="15">
        <el-input v-model="dataForm.url" placeholder="跳转地址"></el-input>
         </el-col>
      </el-form-item>
      <el-form-item label="" prop="imageUrl">
        <el-button type="primary" @click="selectOssHandle()">选择图片<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-form-item>
       <el-form-item label="    " prop="logoUrl">
        <el-image style="width: 100px; height: 100px" v-if="dataForm.imageUrl" :src="dataForm.imageUrl" fit="scale-down">
        </el-image>
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-radio-group v-model="dataForm.isShow">
          <el-radio-button label="1">显示</el-radio-button>
          <el-radio-button label="0">隐藏</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 弹窗, 选择文件 -->
    <ossSelect v-if="selectOssVisible" ref="ossSelect" @selectData='callbackOss(arguments)' ></ossSelect>
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
          displayType: '1',
          channelType: '1',
          name: '',
          url: '',
          imageUrl: '',
          isShow: '1',
          systemId: '',
          clentId: '',
          appId: '',
          crtTime: ''},
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ]
        },
        selectOssVisible: false
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
              url: `/id/channel/info/${this.dataForm.id}`,
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
                url: `/id/channel`,
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
      },
      // 选择文件
      selectOssHandle () {
        this.selectOssVisible = true
        this.$nextTick(() => {
          this.$refs.ossSelect.init(false)
        })
      },
      callbackOss (param) {
        this.dataForm.imageUrl = param[1][0]
      }
    }
  }
</script>
<style>
    .customWidth{
        width:60%;
    }
</style>