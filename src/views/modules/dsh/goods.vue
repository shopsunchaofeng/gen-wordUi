<template>
  <div class="mod-goods">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button v-if="isAuth('dsh:goods:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
       <!-- <el-button v-if="isAuth('dsh:goods:remove')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>

    <el-table
        :data="dataList"
        border
        @selection-change="selectionChangeHandle"
        style="width: 100%;">
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="商品id">
      </el-table-column>
            <el-table-column
        prop="type"
        header-align="center"
        align="center"
        label="商品类型">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.type === '1'">热销商品</el-tag>
                <el-tag v-if="scope.row.type === '2'">积分商品</el-tag>
                <el-tag v-if="scope.row.type === '3'">其他商品</el-tag>
              </template>
      </el-table-column>
      <el-table-column
        prop="categoryname"
        header-align="center"
        align="center"
        label="所属类目">
      </el-table-column>
      <el-table-column
        prop="name"
        header-align="center"
        align="center"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="introduction"
        header-align="center"
        align="center"
        label="商品简介">
      </el-table-column>
      <el-table-column
        prop="images"
        header-align="center"
        align="center"
        label="商品图片">
        <template slot-scope="scope">
          <el-button type="primary" @click="aommonShowImagesHandle(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="xiaoliang"
        header-align="center"
        align="center"
        label="商品销量">
      </el-table-column>
      <el-table-column
        prop="stock"
        header-align="center"
        align="center"
        label="库存">
      </el-table-column>
      <el-table-column
        prop="jifen"
        header-align="center"
        align="center"
        label="积分值">
      </el-table-column>
      <el-table-column
        prop="price"
        header-align="center"
        align="center"
        label="商品单价">
      </el-table-column>
      <el-table-column
        prop="content"
        header-align="center"
        align="center"
        label="商品详情">
        <template slot-scope="scope">
          <el-button type="primary" @click="aommonShowFucontentHandle(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="商品状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1">上架状态</el-tag>
          <el-tag v-if="scope.row.status === 2">下架状态</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="iszhiding"
        header-align="center"
        align="center"
        label="置顶状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.iszhiding === 0">未置顶</el-tag>
          <el-tag v-if="scope.row.iszhiding === 1">已置顶</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="creattime"
        header-align="center"
        align="center"
        label="创建时间">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('dsh:goods:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button v-if="isAuth('dsh:pinglun:list')" type="text" size="small" @click="plunHandle(scope.row.id)">查看评论</el-button>
          <el-button v-if="isAuth('dsh:goods:zhiding') && scope.row.iszhiding === 0" type="text" size="small" @click="zhidingHandle(scope.row.id, 1)">置顶</el-button>
          <el-button v-if="isAuth('dsh:goods:qxzhiding') && scope.row.iszhiding === 1" type="text" size="small" @click="zhidingHandle(scope.row.id, 0)">取消置顶</el-button>
          <el-button v-if="isAuth('dsh:goods:shangjia') && scope.row.status === 2" type="text" size="small" @click="shangjiaHandle(scope.row.id, 1)">上架</el-button>
          <el-button v-if="isAuth('dsh:goods:xiajia') && scope.row.status === 1" type="text" size="small" @click="shangjiaHandle(scope.row.id, 2)">下架</el-button>
          <el-button v-if="isAuth('dsh:goods:remove')" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
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
    <!-- 弹窗,-->
    <common-show-fucontent v-if="commonShowFucontentVisible" ref="commonShowFucontent" @refreshDataList="getDataList"></common-show-fucontent>
    <!-- 轮播图弹窗,-->
    <common-show-images v-if="commonShowImagesVisible" ref="commonShowImages" @refreshDataList="getDataList"></common-show-images>
    <!-- 商品评论弹窗,-->
    <goodspinglun v-if="goodspinglunVisible" ref="goodspinglun" @refreshDataList="getDataList"></goodspinglun>
  </div>
</template>

<script>
  import AddOrUpdate from './goods-add-or-update'
  import CommonShowFucontent from '../clb/common-show-fucontent'
  import CommonShowImages from '../clb/common-show-images'
  import Goodspinglun from './pinglun'

  export default {
    data () {
      return {
        searchForm: {
          page: 1,
          limit: 10,
          name: ''
        },
        dataList: [],
        totalPage: 0,
        dataListSelections: [],
        commonShowFucontentVisible: true,
        goodspinglunVisible: false,
        commonShowImagesVisible: true,
        addOrUpdateVisible: false
      }
    },
    components: {
      AddOrUpdate, CommonShowFucontent, CommonShowImages, Goodspinglun
    },
    activated () {
      this.getDataList()
    },
    methods: {
      // 获取数据列表
      getDataList () {
        this.$http({
          url: '/dsh/goods/list1',
          method: 'get',
          params: {
            'page': this.searchForm.page,
            'limit': this.searchForm.limit,
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
      // 弹框
      aommonShowFucontentHandle (id) {
        this.commonShowFucontentVisible = true
        this.$nextTick(() => {
          this.$refs.commonShowFucontent.init(id, '/dsh/goods/info', 0)
        })
      },
      // 评论列表弹框
      plunHandle (id) {
        this.goodspinglunVisible = true
        this.$nextTick(() => {
          this.$refs.goodspinglun.getDataList(id)
        })
      },
      // 轮播图弹框
      aommonShowImagesHandle (id) {
        this.commonShowImagesVisible = true
        this.$nextTick(() => {
          this.$refs.commonShowImages.init(id, '/dsh/goods/info', 0)
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
      // 上下架
      shangjiaHandle (id, status) {
        this.$http({
          url: `/dsh/goods/caozuo`,
          method: `post`,
          data: {
            id: id,
            status: status
          }
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
      },
      // 是否置顶
      zhidingHandle (id, iszhiding) {
        this.$http({
          url: `/dsh/goods/caozuo`,
          method: `post`,
          data: {
            id: id,
            iszhiding: iszhiding
          }
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
            url: `/dsh/goods/${ids}`,
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
