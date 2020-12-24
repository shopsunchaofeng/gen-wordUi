<template>
  <div class="mod-content">
    <el-form :inline="true" :model="searchForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="searchForm.name" placeholder="参数名" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button
          v-if="isAuth('gen:content:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增单位</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column prop="danwei" header-align="center" align="center" label="单位名称"></el-table-column>
      <el-table-column prop="fuze" header-align="center" align="center" label="单位负责人"></el-table-column>
      <el-table-column prop="danweiaddress" header-align="center" align="center" label="单位地址"></el-table-column>
      <el-table-column prop="bangongphone" header-align="center" align="center" label="办公电话"></el-table-column>
      <el-table-column prop="creattime" header-align="center" align="center" label="创建时间"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="bianji(scope.row.id,scope.row.systemnumber)">编辑系统</el-button>
          <el-button
            v-if="isAuth('gen:danwei:remove')"
            type="danger"
            size="mini"
            @click="deleteHandle(scope.row.id)"
          >删除</el-button>
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
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <add-update v-if="addUpdateVisible" ref="addUpdate" @refreshDataList="getDataList"></add-update>
    <systemList
      v-if="systemListVisible"
      ref="systemList"
      @openSystempath1="openSystempath1(arguments)"
      @openYLWord="openYLWord"
    ></systemList>
    <systempath1 v-if="systempath1Visible" ref="systempath1" @updateSystemList="updateSystemList"></systempath1>
     <!--定级word预览-->
    <el-dialog :visible.sync="dialogVisible">
      <!--<iframe :src="'https://view.officeapps.live.com/op/view.aspx?src='+'http://www.henanzhengwang.com/gen-word-api'+'/api/content/yulan?id='+id+'&type=1'" width='100%' height="700px"></iframe>-->
      <iframe
        :src="'https://view.officeapps.live.com/op/view.aspx?src='+filePath"
        width="100%"
        height="700px"
      ></iframe>
    </el-dialog>
    <!--备案word预览-->
    <el-dialog :visible.sync="dialogVisible2">
      <iframe
        :src="'https://view.officeapps.live.com/op/view.aspx?src='+filePath"
        width="100%"
        height="700px"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script>
import AddOrUpdate from "./content-add-or-update";
import AddUpdate from "./content-addUpdate";
import systemList from "./systemList";
import systempath1 from "./systempath1";

export default {
  data() {
    return {
      searchForm: {
        page: 1,
        limit: 10,
        name: "",
      },
      dataList: [],
      totalPage: 0,
      dataListSelections: [],
      dialogVisible: false,
      dialogVisible2: false,
      filePath: "",
      addOrUpdateVisible: false,
      addUpdateVisible: false,
      systemListVisible: false,
      systempath1Visible: false,
    };
  },
  components: {
    AddOrUpdate,
    AddUpdate,
    systemList,
    systempath1,
  },
  activated() {
    this.getDataList();
  },
  methods: {
    openYLWord(url) {
      this.filePath = url;
      this.dialogVisible2 = true;
    },
    updateSystemList(id) {
      console.log("updateSystemList", id);
      this.systemListVisible = true;
      this.$nextTick(() => {
        this.$refs.systemList.init(id);
      });
    },
    openSystempath1(id) {
      console.log("add", id);
      this.systempath1Visible = true;
      this.$nextTick(() => {
        this.$refs.systempath1.init(id[0], id[1]);
      });
    },
    bianji(id,num) {
      this.systemListVisible = true;
      this.$nextTick(() => {
        this.$refs.systemList.init(id,num);
      });
    },
    // 获取数据列表
    getDataList() {
      this.$http({
        url: "/gen/danwei/list1",
        method: "get",
        params: {
          page: this.searchForm.page,
          limit: this.searchForm.limit,
          name: this.searchForm.name,
        },
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.dataList = data.page.records;
          this.totalPage = data.page.total;
        } else {
          this.dataList = [];
          this.totalPage = 0;
        }
      });
    },
    // 每页数
    sizeChangeHandle(val) {
      this.searchForm.limit = val;
      this.searchForm.page = 1;
      this.getDataList();
    },
    // 当前页
    currentChangeHandle(val) {
      this.searchForm.page = val;
      this.getDataList();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addUpdate.init(id);
      });
    },
    // 导出定级报告
    exportdingji() {
      window.location.href =
        this.$http.BASE_URL +
        `/gen/content/exportdingji?token=${this.$cookie.get("token")}`;
    },
    // 导出备案表
    exportbeian() {
      window.location.href =
        this.$http.BASE_URL +
        `/gen/content/exportbeian?token=${this.$cookie.get("token")}`;
    },
    yulandingji(id, type) {
      this.$http({
        url: `/gen/content/getPath/${id}?type=${type}`,
        method: "GET",
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.filePath = data.msg;
          this.dialogVisible = true;
        }
      });
    },
    yulanbeian(id, type) {
      this.$http({
        url: `/gen/content/getPath/${id}?type=${type}`,
        method: "GET",
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.filePath = data.msg;
          this.dialogVisible2 = true;
        }
      });
    },
    // 删除
    deleteHandle(id) {
      let ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(`确定对[id=${ids.join(",")}]进行[删除]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$http({
            url: `/gen/danwei/${ids}`,
            method: "DELETE",
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 1500,
              });
              this.getDataList();
            }
          });
        })
        .catch(() => {});
    },
  },
};
</script>
<style>
.el-button {
  margin-bottom: 10px;
}
</style>