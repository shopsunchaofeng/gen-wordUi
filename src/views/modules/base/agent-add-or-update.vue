<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-card class="box-card" style="margin-bottom: 10px;">
        <div slot="header" class="clearfix">
          <span>代理商信息</span>
        </div>
        <div class="text item">
          <el-form-item label="代理商名称" prop="agentName">
            <el-input v-model="dataForm.agentName" placeholder="代理商名称"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="dataForm.contactName" placeholder="联系人"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="contactPhone">
            <el-input v-model="dataForm.contactPhone" placeholder="联系人电话"></el-input>
          </el-form-item>
          <el-form-item label="有效期限" prop="validTime">
            <el-date-picker
              v-model="dataForm.validTime"
              type="date"
              placeholder="有效期限">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="合同编号" prop="annexId">
            <el-input v-model="dataForm.annexId" placeholder="合同编号"></el-input>
          </el-form-item>
          <el-form-item label="所在地" prop="location">
            <el-cascader v-model="dataForm.location" :options="locationData" :props="locationProps" placeholder="省/市/区" style="width:100%"/>
          </el-form-item>
          <el-form-item label="详细地址" prop="locationDetail">
            <el-input v-model="dataForm.locationDetail" placeholder="详细地址"></el-input>
          </el-form-item>
          <el-form-item label="简介" prop="introduction">
            <el-input v-model="dataForm.introduction" placeholder="简介"></el-input>
          </el-form-item>
        </div>
      </el-card>
      <el-card class="box-card" style="margin-bottom: 10px;">
        <div slot="header" class="clearfix">
          <span>签约信息</span>
        </div>
        <div class="text item">
          <el-form-item label="支付金额" prop="paymentAmount">
            <el-input v-model="dataForm.paymentAmount" placeholder="支付金额"></el-input>
          </el-form-item>
          <el-form-item label="签约人" prop="signUserId">
            <el-select
              v-model="dataForm.signUserId"
              filterable
              remote
              reserve-keyword
              placeholder="请输入签约人"
              :remote-method="remoteUserList"
              :loading="loading">
              <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="签约日期" prop="signTime">
            <el-date-picker
              v-model="dataForm.signTime"
              type="datetime"
              placeholder="签约日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="签约地点" prop="signPlace">
            <el-input v-model="dataForm.signPlace" placeholder="签约地点"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
          </el-form-item>
        </div>
      </el-card>
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
          paymentAmount: '',
          agentName: '',
          signUserId: '',
          signTime: '',
          signPlace: '',
          introduction: '',
          remark: '',
          annexId: '',
          location: [],
          locationProvinceId: '',
          locationCityId: '',
          locationCountyId: '',
          locationDetail: '',
          validTime: '',
          contactPhone: '',
          contactName: '',
          crtTime: '',
          crtUser: '',
          crtName: '',
          crtHost: '',
          updTime: '',
          updUser: '',
          updName: '',
          updHost: ''},
        dataRule: {
          agentName: [
            {required: true, message: '名称不能为空', trigger: 'blur'}
          ],
          contactName: [
            {required: true, message: '联系人不能为空', trigger: 'blur'}
          ],
          contactPhone: [
            {required: true, message: '电话不能为空', trigger: 'blur'}
          ],
          validTime: [
            {required: true, message: '有效期限不能为空', trigger: 'blur'}
          ],
          paymentAmount: [
            {required: true, message: '支付金额不能为空', trigger: 'blur'}
          ],
          signUserId: [
            {required: true, message: '签约人不能为空', trigger: 'blur'}
          ],
          signTime: [
            {required: true, message: '签约日期不能为空', trigger: 'blur'}
          ]
        },
        userList: [],
        loading: false,
        locationData: [],
        locationProps: {
          children: 'children',
          label: 'name',
          value: 'id'
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.getAreaTree(0)
          if (this.dataForm.id) {
            this.$http({
              url: `/base/agent/info/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.dataForm = data.data
                this.userList = []
                this.userList.push({ id: this.dataForm.signUserId, realName: this.transUser(this.dataForm.signUserId) })
              }
            })
          }
        })
      },
      // 动态加载树
      getAreaTree (val) {
        let that = this
        that.$http({
          url: '/id/region/getTree',
          method: 'get',
          params: {
          }
        }).then(({data}) => {
          if (data && data.code === 200) {
            that.locationData = data.data
          }
        })
      },
      // 搜索签约人
      remoteUserList (realName) {
        if (realName) {
          this.loading = true
          this.$http({
            url: '/base/user/list',
            method: 'get',
            params: {
              'page': 1,
              'limit': 10,
              'realName': realName
            }
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.loading = false
              this.userList = data.page.records
              this.userList.forEach(item => {
                item.realName = item.realName + ' || ' + item.userName
              })
            } else {
              this.userList = []
            }
          })
        } else {
          this.userList = []
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/base/agent`,
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
