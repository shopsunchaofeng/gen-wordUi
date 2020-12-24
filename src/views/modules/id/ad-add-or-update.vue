<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="名称" prop="name">
        <el-col :span="15">
          <el-input v-model="dataForm.name" placeholder="名称"></el-input>
        </el-col>
      </el-form-item>
      <el-form-item label="广告位置" prop="adPositionId">
        <el-select v-model="dataForm.adPositionId" placeholder="请选择">
          <el-option
            v-for="adPosition in adPositionList"
            :key="adPosition.id"
            :label="adPosition.name"
            :value="adPosition.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="媒体类型" prop="mediaType">
        <el-radio-group v-model="dataForm.mediaType">
          <el-radio v-for="(mediaType, index) in mediaTypeList" :label="index+1" :key="index+1">{{ mediaType }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="链接" prop="link">
        <el-col :span="15">
          <el-input v-model="dataForm.link" placeholder="链接"></el-input>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="文件" prop="imageUrl">
        <el-col :span="15">
          <el-input v-model="dataForm.imageUrl" placeholder="展示URL"></el-input>
        </el-col>
      </el-form-item> -->

      <el-form-item label="展示图片">
        <el-button type="primary" @click="selectOssHandle()">选择图片<i class="el-icon-upload el-icon--right"></i></el-button>
      </el-form-item>
      <el-form-item label="    " prop="imageUrl">
        <el-image style="width: 100px; height: 100px" v-if="dataForm.imageUrl" :src="dataForm.imageUrl" fit="scale-down">
        </el-image>
      </el-form-item>


      <el-form-item label="内容" prop="content">
          <el-col :span="15">
            <el-input type="textarea" v-model="dataForm.content" placeholder="内容"></el-input>
          <!-- <el-input v-model="dataForm.content" placeholder="内容"></el-input> -->
        </el-col>
      </el-form-item>
      <el-form-item label="广播结束时间" prop="endTime">
        <el-col :span="15">
          <el-date-picker
              v-model="dataForm.endTime"
              type="date"
              placeholder="广播结束时间" value-format="yyyy-MM-dd">
            </el-date-picker>
        </el-col>
      </el-form-item>
      <el-form-item label="状态" prop="enabled">
        <el-radio-group v-model="dataForm.enabled"  >
              <el-radio-button label="1">启用</el-radio-button>
              <el-radio-button label="0">禁用</el-radio-button>
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
          adPositionId: '',
          mediaType: 1,
          name: '',
          link: '',
          imageUrl: '',
          content: '',
          endTime: null,
          enabled: 1 },
        adPositionList: [],
        mediaTypeList: ['轮播', '滑动', '滚动'],
        dataRule: {
          name: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          enabled: [
            {required: true, message: '状态不能为空', trigger: 'blur'}
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
          this.getAdPositionList()
          if (this.dataForm.id) {
            this.$http({
              url: `/id/ad/info/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm = data.data
              }
            })
          }
        })
      },
      getAdPositionList () {
        this.$http({
          url: `/id/adposition/list`,
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.adPositionList = data.page.records
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
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/id/ad`,
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
