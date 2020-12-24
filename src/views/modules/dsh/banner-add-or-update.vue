<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="广告图片" prop="imageurl">
        <el-button type="primary" @click="selectOssHandle()">广告图片<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-form-item>
      <el-form-item label="" prop="image1">
        <el-image style="width: 100px; height: 100px" v-if="dataForm.imageurl" :src="dataForm.imageurl" fit="scale-down"></el-image>
      </el-form-item>
      <el-form-item label="跳转类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="1">不跳转</el-radio>
          <el-radio :label="2">跳转到图文详情</el-radio>
          <el-radio :label="3">跳转到指定商品</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="跳转商品对应的商品id" prop="goodsid">
        <el-input v-model="dataForm.goodsid" placeholder="跳转商品对应的商品id"></el-input>
      </el-form-item>
      <el-form-item label="图片对应的富文本内容" prop="content">
        <ueditor v-model="dataForm.content"></ueditor>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 弹窗, 选择文件 -->
    <ossSelect v-if="selectOssVisible" ref="ossSelectRef" @selectData='callbackOss(arguments)' ></ossSelect>
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
          imageurl: '',
          type: '',
          goodsid: '',
          content: '',
          creattime: '',
          updatetime: ''},
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
              url: `/dsh/banner/info/${this.dataForm.id}`,
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
        this.dataForm.imageurl = param[1][0]
      },
      // 选择文件
      selectOssHandle2 () {
        this.selectOssVisible2 = true
        this.$nextTick(() => {
          this.$refs.ossSelectRef2.init(false)
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/dsh/banner`,
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
