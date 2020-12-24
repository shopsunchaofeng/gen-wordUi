<template>
  <el-dialog
    title="评论列表"
    :close-on-click-modal="false"
    :visible.sync="visible">
  <div class="mod-pinglun">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="评论人昵称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
        :data="dataList"
        border
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
            <el-table-column
        prop="nicename"
        header-align="center"
        align="center"
        label="评论人昵称">
      </el-table-column>
      <el-table-column
        prop="images"
        header-align="center"
        align="center"
        label="评论图片">
        <template slot-scope="scope">
          <el-button type="primary" @click="aommonShowImagesHandle(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="评论内容">
      </el-table-column>
      <el-table-column
        prop="creattime"
        header-align="center"
        align="center"
        label="评论时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="searchForm.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="searchForm.limit"
        :total="totalPage"
        layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 轮播图弹窗,-->
    <common-show-images v-if="commonShowImagesVisible" ref="commonShowImages" @refreshDataList="getDataList"></common-show-images>
  </div>
  </el-dialog>
</template>

<script>
  import AddOrUpdate from './pinglun-add-or-update'
  import CommonShowImages from '../clb/common-show-images'
  export default {
    data () {
      return {
        visible: false,
        searchForm: {
          page: 1,
          limit: 10,
          name: ''
        },
        dataList: [],
        totalPage: 0,
        dataListSelections: [],
        goodsid: '',
        commonShowImagesVisible: true,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate, CommonShowImages
    },
    activated () {
      this.getDataList(this.goodsid)
    },
    methods: {
      // 获取数据列表
      getDataList (id) {
        if (id) {
          this.goodsid = id
        }
        this.visible = true
        this.$http({
          url: '/dsh/pinglun/list1',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
            'goodsid': this.goodsid,
            'name': this.searchForm.name
          }
        }).then(({data}) => {
          if (data && data.code === 200) {
            this.dataList = data.page.records
            this.totalPage = data.page.total
          } else {
            this.dataList = []
            this.totalPage = 0
          }
        })
      },
      // 轮播图弹框
      aommonShowImagesHandle (id) {
        this.commonShowImagesVisible = true
        this.$nextTick(() => {
          this.$refs.commonShowImages.init(id, '/dsh/pinglun/info', 0)
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.searchForm.limit = val
        this.searchForm.page = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.searchForm.page = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
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
            url: `/dsh/pinglun/${ids}`,
            method: 'DELETE'
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500
              })
              this.getDataList()
            }
          })
        }).catch(() => {
        })
      }
    }
  }
</script>
