<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-row type="flex" class="row-bg">
        <el-col :span="8">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="dataForm.userName" placeholder="用户名"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="dataForm.realName" placeholder="真实姓名"></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="8">
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="dataForm.nickName" placeholder="昵称"></el-input>
        </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="密码" prop="password">
        <el-input v-model="dataForm.password" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item label="密码盐" prop="salt">
        <el-input v-model="dataForm.salt" placeholder="密码盐"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="dataForm.phone" placeholder="手机号"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-input v-model="dataForm.gender" placeholder="性别"></el-input>
      </el-form-item>
      <el-form-item label="出生年月日" prop="birthday">
        <el-input v-model="dataForm.birthday" placeholder="出生年月日"></el-input>
      </el-form-item>
      <el-form-item label="显示头像" prop="avatar">
        <el-input v-model="dataForm.avatar" placeholder="显示头像"></el-input>
      </el-form-item>
      <el-form-item label="微信头像URL" prop="wechatAvatar">
        <el-input v-model="dataForm.wechatAvatar" placeholder="微信头像URL"></el-input>
      </el-form-item>
      <el-form-item label="人脸识别照片" prop="discernPhoto">
        <el-input v-model="dataForm.discernPhoto" placeholder="人脸识别照片"></el-input>
      </el-form-item>
      <el-form-item label="所在省ID" prop="locationProvinceId">
        <el-input v-model="dataForm.locationProvinceId" placeholder="所在省ID"></el-input>
      </el-form-item>
      <el-form-item label="所在市ID" prop="locationCityId">
        <el-input v-model="dataForm.locationCityId" placeholder="所在市ID"></el-input>
      </el-form-item>
      <el-form-item label="所在区ID" prop="locationCountyId">
        <el-input v-model="dataForm.locationCountyId" placeholder="所在区ID"></el-input>
      </el-form-item>
      <el-form-item label="地址省市县" prop="address">
        <el-input v-model="dataForm.address" placeholder="地址省市县"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="detailedAddress">
        <el-input v-model="dataForm.detailedAddress" placeholder="详细地址"></el-input>
      </el-form-item>
      <el-form-item label="用户级别 对应id_person_level表ID" prop="personLevelId">
        <el-input v-model="dataForm.personLevelId" placeholder="用户级别 对应id_person_level表ID"></el-input>
      </el-form-item>
      <el-form-item label="账户加密金额" prop="encryptMoney">
        <el-input v-model="dataForm.encryptMoney" placeholder="账户加密金额"></el-input>
      </el-form-item>
      <el-form-item label="积分" prop="integral">
        <el-input v-model="dataForm.integral" placeholder="积分"></el-input>
      </el-form-item>
      <el-form-item label="用户状态 1 正常 2禁用 3注销" prop="status">
        <el-input v-model="dataForm.status" placeholder="用户状态 1 正常 2禁用 3注销"></el-input>
      </el-form-item>
      <el-form-item label="分享次数" prop="shareNum">
        <el-input v-model="dataForm.shareNum" placeholder="分享次数"></el-input>
      </el-form-item>
      <el-form-item label="邀请人ID，-1自主注册" prop="inviterPersonId">
        <el-input v-model="dataForm.inviterPersonId" placeholder="邀请人ID，-1自主注册"></el-input>
      </el-form-item>
      <el-form-item label="微信号" prop="wechatCode">
        <el-input v-model="dataForm.wechatCode" placeholder="微信号"></el-input>
      </el-form-item>
      <el-form-item label="QQ号" prop="qqCode">
        <el-input v-model="dataForm.qqCode" placeholder="QQ号"></el-input>
      </el-form-item>
      <el-form-item label="数据来源1小程序" prop="dataSource">
        <el-input v-model="dataForm.dataSource" placeholder="数据来源1小程序"></el-input>
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
      <el-form-item label="0删  1否" prop="isDelete">
        <el-input v-model="dataForm.isDelete" placeholder="0删  1否"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="crtTime">
        <el-input v-model="dataForm.crtTime" placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="" prop="crtHost">
        <el-input v-model="dataForm.crtHost" placeholder=""></el-input>
      </el-form-item>
      <el-form-item label="用户登录时间" prop="lastLoginTime">
        <el-input v-model="dataForm.lastLoginTime" placeholder="用户登录时间"></el-input>
      </el-form-item>
      <el-form-item label="用户登录IP" prop="lastLoginIp">
        <el-input v-model="dataForm.lastLoginIp" placeholder="用户登录IP"></el-input>
      </el-form-item>
      <el-form-item label="微信openid" prop="wxOpenid">
        <el-input v-model="dataForm.wxOpenid" placeholder="微信openid"></el-input>
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
          userName: '',
          realName: '',
          nickName: '',
          password: '',
          salt: '',
          phone: '',
          gender: '',
          birthday: '',
          avatar: '',
          wechatAvatar: '',
          discernPhoto: '',
          locationProvinceId: '',
          locationCityId: '',
          locationCountyId: '',
          address: '',
          detailedAddress: '',
          personLevelId: '',
          encryptMoney: '',
          integral: '',
          status: '',
          shareNum: '',
          inviterPersonId: '',
          wechatCode: '',
          qqCode: '',
          dataSource: '',
          systemId: '',
          clentId: '',
          appId: '',
          isDelete: '',
          crtTime: '',
          crtHost: '',
          lastLoginTime: '',
          lastLoginIp: '',
          wxOpenid: ''},
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
              url: `/id/person/info/${this.dataForm.id}`,
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
                url: `/id/person`,
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
