<template>
  <div class="mod-businessrule">
  <el-form ref="form" :model="form" :rules="dataRule" @keyup.enter.native="onSubmit" label-width="100px" >
    <el-form-item label="金额" prop="price">
      <el-col :span="8">
        <el-input v-model="form.price" placeholder="消费多少金额得1积分" type="number" :min="0"></el-input>
        <el-tag >消费多少金额得1积分</el-tag>
      </el-col>
    </el-form-item>
    <el-form-item label="积分有效期">
      <el-switch v-model="validDateSwitchStatus" @change="validDateSwitch" inactive-text="非永久" active-text="永久"></el-switch>
    </el-form-item>
    <el-form-item label="有效天数" v-show="dayShowStatus" prop="expireDay">
      <el-col :span="8">
        <el-input type="number" @blur="expireDayBlureToZero" v-model="form.expireDay" placeholder="请输入积分有效天数"></el-input>
      </el-col>
    </el-form-item>
    <el-form-item label="积分抵现">
      <el-switch v-model="pointCreditSwitchStatus" @change="pointCreditSwitch" inactive-text="不开启" active-text="开启"></el-switch>
    </el-form-item>
    <el-form-item label="积分设置" v-show="numShowStatus" prop="pointNum">
      <el-col :span="8">
        <el-input type="number" @blur="pointNumBlureToZero" v-model="form.pointNum" placeholder="多少积分抵1元"></el-input>
        <el-tag >多少积分抵1元</el-tag>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
    </el-form-item>
  </el-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        form: {
          id: '',
          price: '',
          expireType: 1,
          expireDay: 1,
          pointCredit: 0,
          pointNum: 1
        },
        pointCreditSwitchStatus: false,
        validDateSwitchStatus: false,
        dayShowStatus: false,
        numShowStatus: false,
        dataRule: {
          price: [
            {required: true, message: '金额不能为空', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                var reg = /^-?\d{1,9}(?:\.\d{1,2})?$/
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error('请输入正确的价格！'))
                }
              },
              trigger: 'blur'
            }
          ],
          expireDay: [
            {required: true, message: '天数不能为空', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                if (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) < 999999999) {
                  callback()
                } else {
                  callback(new Error('请输入1-9位的正整数'))
                }
              },
              trigger: 'blur'
            }
          ],
          pointNum: [
            {required: true, message: '积分不能为空', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                if (Number.isInteger(Number(value)) && Number(value) >= 0 && Number(value) < 999999999) {
                  callback()
                } else {
                  callback(new Error('请输入1-9位的正整数'))
                }
              },
              trigger: 'blur'
            }
          ]
        }
      }
    },
    activated () {
      this.getData()
    },
    methods: {
      // 获取数据列表
      getData () {
        let that = this
        this.$http({
          url: '/id/businessrule/getDataByShop',
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 200) {
            if (data.data !== undefined) {
              that.form.id = data.data.id
              that.form.price = data.data.price
              that.form.expireType = data.data.expireType
              that.form.expireDay = data.data.expireDay
              that.form.pointCredit = data.data.pointCredit
              that.form.pointNum = data.data.pointNum
              if (that.form.expireType === 1) {
                that.dayShowStatus = false
                that.validDateSwitchStatus = true
              } else {
                that.dayShowStatus = true
              }
              if (that.form.pointCredit === 1) {
                that.numShowStatus = true
                that.pointCreditSwitchStatus = true
              } else {
                that.numShowStatus = false
              }
            }
          } else {
          }
        })
      },
      onSubmit () {
        let that = this
        this.$refs['form']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/id/businessrule`,
                method: `post`,
                data: that.form
              }).then(({data}) => {
                if (data && data.code === 200) {
                  this.$message({
                    message: '操作成功',
                    type: 'success',
                    duration: 1500
                  })
                } else {
                }
              })
            }
          })
      },
      validDateSwitch () {
        if (this.validDateSwitchStatus) {
          this.form.expireType = 1
          this.dayShowStatus = false
        } else {
          this.form.expireType = 0
          this.dayShowStatus = true
        }
      },
      pointCreditSwitch () {
        if (this.pointCreditSwitchStatus) {
          this.form.pointCredit = 1
          this.numShowStatus = true
        } else {
          this.form.pointCredit = 0
          this.numShowStatus = false
        }
      },
      pointNumBlureToZero () {
        if (this.form.pointNum === '') {
          this.form.pointNum = 1
        }
      },
      expireDayBlureToZero () {
        if (this.form.expireDay === '') {
          this.form.expireDay = 1
        }
      }
    }
  }
</script>
