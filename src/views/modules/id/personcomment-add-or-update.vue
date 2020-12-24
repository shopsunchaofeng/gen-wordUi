<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="数据类型，1商品，2团购，3店铺，4文章" prop="type">
        <el-input v-model="dataForm.type" placeholder="数据类型，1商品，2团购，3店铺，4文章"></el-input>
      </el-form-item>
      <el-form-item label="第一个数据源ID" prop="firstSourceId">
        <el-input v-model="dataForm.firstSourceId" placeholder="第一个数据源ID"></el-input>
      </el-form-item>
      <el-form-item label="第二个数据源ID" prop="secondSourceId">
        <el-input v-model="dataForm.secondSourceId" placeholder="第二个数据源ID"></el-input>
      </el-form-item>
      <el-form-item label="第三个数据源ID" prop="thirdSourceId">
        <el-input v-model="dataForm.thirdSourceId" placeholder="第三个数据源ID"></el-input>
      </el-form-item>
      <el-form-item label="评论内容" prop="content">
        <el-input v-model="dataForm.content" placeholder="评论内容"></el-input>
      </el-form-item>
      <el-form-item label="评价星级1-5" prop="evaluateStar">
        <el-input v-model="dataForm.evaluateStar" placeholder="评价星级1-5"></el-input>
      </el-form-item>
      <el-form-item label="配送星级1-5" prop="deliveryStar">
        <el-input v-model="dataForm.deliveryStar" placeholder="配送星级1-5"></el-input>
      </el-form-item>
      <el-form-item label="质量星级" prop="qualityStar">
        <el-input v-model="dataForm.qualityStar" placeholder="质量星级"></el-input>
      </el-form-item>
      <el-form-item label="售后星级" prop="afterStar">
        <el-input v-model="dataForm.afterStar" placeholder="售后星级"></el-input>
      </el-form-item>
      <el-form-item label="服务星级" prop="serviceStar">
        <el-input v-model="dataForm.serviceStar" placeholder="服务星级"></el-input>
      </el-form-item>
      <el-form-item label="商店星级" prop="storeStar">
        <el-input v-model="dataForm.storeStar" placeholder="商店星级"></el-input>
      </el-form-item>
      <el-form-item label="数据来源，1小程序" prop="source">
        <el-input v-model="dataForm.source" placeholder="数据来源，1小程序"></el-input>
      </el-form-item>
      <el-form-item label="1已审核，0未审核" prop="isCheck">
        <el-input v-model="dataForm.isCheck" placeholder="1已审核，0未审核"></el-input>
      </el-form-item>
      <el-form-item label="系统编号" prop="systemId">
        <el-input v-model="dataForm.systemId" placeholder="系统编号"></el-input>
      </el-form-item>
      <el-form-item label="客户代码" prop="clentId">
        <el-input v-model="dataForm.clentId" placeholder="客户代码"></el-input>
      </el-form-item>
      <el-form-item label="小程序ID" prop="appId">
        <el-input v-model="dataForm.appId" placeholder="小程序ID"></el-input>
      </el-form-item>
      <el-form-item label="" prop="crtTime">
        <el-input v-model="dataForm.crtTime" placeholder=""></el-input>
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
          type: '',
          firstSourceId: '',
          secondSourceId: '',
          thirdSourceId: '',
          content: '',
          evaluateStar: '',
          deliveryStar: '',
          qualityStar: '',
          afterStar: '',
          serviceStar: '',
          storeStar: '',
          source: '',
          isCheck: '',
          systemId: '',
          clentId: '',
          appId: '',
          crtTime: ''},
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
              url: `/id/personcomment/info/${this.dataForm.id}`,
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
                url: `/id/personcomment`,
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
