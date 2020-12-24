<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-tabs tab-position="left" >
        <el-tab-pane label="基本信息">
            <el-form-item label="商品类型" prop="type">
              <el-radio-group v-model="dataForm.type" disabled="false">
                <el-radio label='1'>热销商品</el-radio>
                <el-radio label='2'>积分商品</el-radio>
                <el-radio label='3'>其他商品</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="所属类目" prop="categoryid" v-show="qtisshow || rxisshow" disabled="false">
              <el-input
                v-for="item in cateList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                 v-if="item.id===dataForm.categoryid"
                v-model="item.name" placeholder="商品名称" disabled="false"></el-input>
            </el-form-item>
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="商品名称" disabled="false"></el-input>
            </el-form-item>
            <el-form-item label="商品简介" prop="introduction">
              <el-input v-model="dataForm.introduction" placeholder="商品简介" disabled="false"></el-input>
            </el-form-item>
            <el-form-item label="商品图片" prop="商品图片">
              <el-image v-for="(item, i) in imagesArray" style="width: 100px; height: 100px" v-show="item" :src="item" fit="scale-down"></el-image>
            </el-form-item>
            <el-form-item label="积分值" prop="jifen" v-show="jfisshow">
              <el-input-number v-model="dataForm.jifen" :min="0" :max="999999999"  placeholder="积分值" disabled="false"></el-input-number>
            </el-form-item>
            <el-form-item label="商品单价(元)" prop="price" v-show="rxisshow || qtisshow">
              <el-input v-model="dataForm.price" placeholder="商品单价(元)" disabled="false"></el-input>
            </el-form-item>
            <el-form-item label="商品详情" prop="content">
              <ueditor v-model="dataForm.content" disabled="false"></ueditor>
            </el-form-item>
          <el-form-item label="购买人上级获得佣金" prop="gsyongjin" v-show="rxisshow">
            <el-input v-model="dataForm.gsyongjin" placeholder="购买人上级获得佣金" disabled="false"></el-input>
          </el-form-item>
          <el-form-item label="购买人获得总积分" prop="gjifen" v-show="rxisshow">
            <el-input-number v-model="dataForm.gjifen" :min="0" :max="999999999"  placeholder="购买人获得总积分" disabled="false"></el-input-number>
          </el-form-item>
          <el-form-item label="购买人每天返还积分" prop="gmjifen" v-show="rxisshow">
            <el-input-number v-model="dataForm.gmjifen" :min="0" :max="999999999"  placeholder="购买人每天返还积分" disabled="false"></el-input-number>
          </el-form-item>
          <el-form-item label="购买人上级获得积分" prop="gsjifen" v-show="rxisshow">
            <el-input-number v-model="dataForm.gsjifen" :min="0" :max="999999999"  placeholder="购买人上级获得积分" disabled="false"></el-input-number>
          </el-form-item>
          <el-form-item label="购买人上上级获得积分" prop="gssjifen" v-show="rxisshow">
            <el-input-number v-model="dataForm.gssjifen" :min="0" :max="999999999"  placeholder="购买人上上级获得积分" disabled="false"></el-input-number>
          </el-form-item>
          <el-form-item label="分享人获得积分" prop="fxjifen" v-show="rxisshow">
            <el-input-number v-model="dataForm.fxjifen" :min="0" :max="999999999"  placeholder="分享人获得积分" disabled="false"></el-input-number>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="规格">
          <!-- 规格页面列表-->
          <gui-ge ref="guiGe" v-model="guigeList"></gui-ge>
        </el-tab-pane>
      </el-tabs>
    </el-form>
    <!-- 弹窗, 选择文件 -->
    <ossSelect v-show="selectOssVisible" ref="ossSelectRef" @selectData='callbackOss(arguments)' ></ossSelect>

  </el-dialog>
</template>

<script>
  import OssSelect from '../base/ossfile-oss-select'
  import GuiGe from './guige1'

  export default {
    data () {
      return {
        visible: false,
        cateList: [],
        jfisshow: false,
        rxisshow: false,
        qtisshow: false,
        dataForm: {
          id: 0,
          type: '',
          categoryid: '',
          name: '',
          introduction: '',
          images: '',
          xiaoliang: '',
          stock: 0,
          jifen: 0,
          price: 0.00,
          content: '',
          gjifen: 0,
          gmjifen: 0,
          gsjifen: 0,
          gssjifen: 0,
          gsyongjin: 0,
          fxjifen: 0.00,
          creattime: ''},
        dataList: [],
        guigeList: [],
        ggAddOrUpdateVisible: false,
        dataListSelections: [],
        imagesArray: [],
        selectOssVisible: false,
        dataRule: {
          type: [
            {required: true, message: '类型必选!', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '商品名称必填!', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '单价不能为空', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                var reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error('请输入一个最多保留两位小数的商品价格！'))
                }
              },
              trigger: 'blur'
            }
          ],
          gsyongjin: [
            {required: true, message: '购买人上级获得佣金不能为空', trigger: 'blur'},
            {
              validator (rule, value, callback) {
                var reg = /((^[1-9]\d*)|^0)(\.\d{0,2}){0,1}$/
                if (reg.test(value)) {
                  callback()
                } else {
                  callback(new Error('请输入一个最多保留两位小数的商品价格！'))
                }
              },
              trigger: 'blur'
            }
          ]
        }
      }
    },
    components: {
      OssSelect, GuiGe
    },
    watch: {
      'dataForm.type': function (newVal) {
        if (newVal === '1') {
          this.rxisshow = true
          this.qtisshow = false
          this.jfisshow = false
        }
        if (newVal === '2') {
          this.jfisshow = true
          this.rxisshow = false
          this.qtisshow = false
        }
        if (newVal === '3') {
          this.qtisshow = true
          this.rxisshow = false
          this.jfisshow = false
        }
      }
    },
    methods: {
      init (id, guigeid) {
        this.$http({
          url: `/dsh/goods/cates`,
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.cateList = data.cateList
          }
        })
        this.dataForm.id = id || ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs.guiGe.dataList = []
          if (this.dataForm.id) {
            this.$http({
              url: `/dsh/guige/list1/${guigeid}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                this.guigeList = data.guigeList
                this.$refs.guiGe.dataList = this.guigeList
              }
            })
            this.$http({
              url: `/dsh/goods/info/${this.dataForm.id}`,
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
          this.$refs.ossSelectRef.init(true)
        })
      },
      callbackOss (param) {
        // this.dataForm.imageId = param[0][0]
        this.imagesArray = param[1]
        this.dataForm.images = param[1].join(',')
      },
      // 表单提交
      dataFormSubmit () {
        this.dataForm.guigeList = this.$refs.guiGe.dataList
        if (this.dataForm.guigeList.length < 1) {
          this.$message({
            message: '必须添加商品规格!',
            type: 'error',
            duration: 1500
          })
          return
        }
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: `/dsh/goods/saveOrUpdate`,
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
