<template>
  <div class="mod-sqlgroup">
    <el-row :gutter="24">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>参数组</span>
            <el-button v-if="isAuth('id:sqlgroup:save')" style="padding-left: 20px" type="text" @click="addOrUpdateHandle(1)">新增</el-button>
            <el-button v-if="isAuth('id:sqlgroup:update')" style="padding: 3px" type="text" @click="addOrUpdateHandle(2)">编辑</el-button>
            <el-button v-if="isAuth('id:sqlgroup:remove')" style="padding: 3px" type="text" @click="deleteHandle()">删除</el-button>
          </div>
          <el-tree
            ref="sqlgroupTree"
            :data="sqlgroupTreeData"
            :props="sqlgroupTreeProps"
            :expand-on-click-node="false"
            default-expand-all
            class="filter-tree"
            node-key="paramgroupid"
            highlight-current
            @node-click="clickSqlgroup">
          </el-tree>
        </el-card>
        
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getTreeList"></add-or-update>
      </el-col>
      <el-col :span="18">
        <Sqldetail ref="sqldetail"></Sqldetail>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import AddOrUpdate from './sqlgroup-add-or-update'
  import Sqldetail from './sqldetail'

  export default {
    data () {
      return {
        searchForm: {
          page: 1,
          limit: 10
        },
        dataList: [],
        totalPage: 0,
        id: null,
        dataListSelections: [],
        sqlgroupTreeData: [],
        addOrUpdateVisible: false,
        sqlgroupTreeProps: {
          parent: 'parentId', // 父级唯一标识
          value: 'id', // 唯一标识
          label: 'groupName', // 标签显示
          children: 'children' // 子级
        }
      }
    },
    components: {
      AddOrUpdate, Sqldetail
    },
    activated () {
      this.getTreeList()
    },
    methods: {
      clickSqlgroup (data) {
        this.id = data.id
        this.$nextTick(() => {
          this.$refs.sqldetail.getDataList(data.id, null)
        })
      },
      // 获取数据列表
      getTreeList () {
        this.$http({
          url: '/id/sqlgroup/find',
          method: 'get',
          params: {
          }
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.sqlgroupTreeData = this.treeDataTranslate(data.list, 'id', 'parentId')
          } else {
            this.sqlgroupTreeData = []
          }
        })
      },
      // 新增 / 修改
      addOrUpdateHandle (flag) {
        if (flag === 2) {
          if (this.id === null) {
            this.$message({
              message: '请选择要编辑的组',
              type: 'warning',
              duration: 1500
            })
            return false
          }
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(this.id)
          })
        } else {
          this.addOrUpdateVisible = true
          this.$nextTick(() => {
            this.$refs.addOrUpdate.init(null)
          })
        }
      },
      // 删除
      deleteHandle (id) {
        let ids = id ? [id] : this.dataListSelections.map(item => {
          return item.id
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: `/id/sqlgroup/${ids}`,
            method: 'DELETE'
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getTreeList()
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
