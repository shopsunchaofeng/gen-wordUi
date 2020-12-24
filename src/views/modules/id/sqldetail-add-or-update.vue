<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="所属分组" prop="groupName">
        <el-popover
          ref="groupListPopover"
          placement="top-start"
          trigger="click">
          <el-tree
            :data="groupList"
            :props="groupListTreeProps"
            node-key="id"
            ref="groupTree"
            @current-change="groupTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.groupName" v-popover:groupListPopover :readonly="true" placeholder="点击选择分组"
                  class="paramgroup-list__input"></el-input>
      </el-form-item>
      <el-form-item label="SQLCODE" prop="sqlCode">
        <el-input v-model="dataForm.sqlCode" placeholder="SQLcode"></el-input>
      </el-form-item>
      <el-form-item label="SQLNAME" prop="sqlName">
        <el-input v-model="dataForm.sqlName" placeholder="SQL名称"></el-input>
      </el-form-item>
      <el-form-item label="sql文" prop="sqls">
        <el-input  type="textarea" v-model="dataForm.sqls" placeholder="SQL文"></el-input>
      </el-form-item>
      <el-form-item label="所属系统" prop="systemId">
        <el-select
          v-model="dataForm.systemId"
          filterable
          remote
          reserve-keyword
          placeholder="请输入所属系统名称"
          :remote-method="remoteSystemList"
          :loading="loading">
          <el-option v-for="item in systemList" :key="item.systemId" :label="item.systemName" :value="item.systemId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" :min="0" :max="999999999"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="备注"></el-input>
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
          groupId: '',
          groupName: '',
          sqlName: '',
          sqlCode: '',
          remarks: '',
          sqls: '',
          isInternal: '',
          isShow: '',
          orderNum: '',
          systemId: '',
          crtTime: ''},
        systemList: [],
        groupList: [],
        loading: false,
        groupListTreeProps: {
          label: 'groupName',
          children: 'children'
        },
        dataRule: {
          groupId: [
            {required: true, message: '所属分组不能为空', trigger: 'blur'}
          ],
          sqlCode: [
            {required: true, message: 'SQLcode不能为空', trigger: 'blur'}
          ],
          sqlName: [
            {required: true, message: 'SQL名称不能为空', trigger: 'blur'}
          ],
          sqls: [
            {required: true, message: 'SQL文不能为空', trigger: 'blur'}
          ],
          orderNum: [
            {required: true, message: '排序不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id, groupId) {
        this.dataForm.id = id || ''
        this.dataForm.groupId = groupId
        this.$http({
          url: '/id/sqlgroup/find',
          method: 'get',
          loading: false
        }).then(({data}) => {
          this.groupList = this.treeDataTranslate(data.list, 'id')
        }).then(() => {
          this.visible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].resetFields()
          })
        }).then(() => {
          if (this.dataForm.id) {
            this.$http({
              url: `/id/sqldetail/info/${this.dataForm.id}`,
              method: 'get'
            }).then(({data}) => {
              if (data && data.code === 200) {
                data.data.groupName = ''
                this.dataForm = data.data
                this.systemList = []
                this.systemList.push({ systemId: this.dataForm.systemId, systemName: this.transSystem(this.dataForm.systemId) })
                this.groupTreeSetCurrentNode()
              }
            })
          } else {
            this.groupTreeSetCurrentNode()
          }
        })
      },
      // 参数组树选中
      groupTreeCurrentChangeHandle (data, node) {
        this.dataForm.groupId = data.id
        this.dataForm.groupName = data.groupName
      },
      // 菜单树设置当前选中节点
      groupTreeSetCurrentNode () {
        if (this.dataForm.groupId) {
          this.$refs.groupTree.setCurrentKey(this.dataForm.groupId)
          this.dataForm.groupName = (this.$refs.groupTree.getCurrentNode() || {})['groupName']
        }
      },
      // 搜索系统
      remoteSystemList (systemName) {
        if (systemName) {
          this.loading = true
          this.$http({
            url: '/id/system/list',
            method: 'get',
            params: {
              'page': 1,
              'limit': 10,
              'systemName': systemName
            }
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.loading = false
              this.systemList = data.page.records
            } else {
              this.systemList = []
            }
          })
        } else {
          this.systemList = []
        }
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm']
          .validate((valid) => {
            if (valid) {
              this.$http({
                url: `/id/sqldetail`,
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
