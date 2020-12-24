<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    :fullscreen="true"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="tableForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="300px"
      label-position="left"
      size="medium"
    >
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="系统名称" prop="system">
              <el-input v-model="dataForm.system" placeholder="请填写系统名称"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="投入运行日期" prop="tourudate">
              <el-date-picker
                v-model="dataForm.tourudate"
                type="date"
                value-format="yyyy 年 M 月 d 日"
                placeholder="请选择投入运行日期"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="开发单位" prop="kaifadanwei">
              <el-input v-model="dataForm.kaifadanwei" placeholder="请填写开发单位"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="业务概述" prop="yewugaishu">
              <el-input
                type="textarea"
                v-model="dataForm.yewugaishu"
                :rows="2"
                placeholder="请填写业务概述（200字）"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="line"></div>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="上传网络拓扑图(最多上传一张)" prop="tuoputu">
              <el-upload
                :action="upPicUrl"
                list-type="picture-card"
                :limit="1"
                :file-list="tuputuList"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="upimgok"
                :auto-upload="true"
                ref="upload"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-dialog :visible.sync="imgdialogVisible" :modal="false">
                <img width="100%" :src="lookpic" alt />
              </el-dialog>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="拓扑结构描述" prop="tuoputumaioshu">
              <el-input
                type="textarea"
                v-model="dataForm.tuoputumaioshu"
                :rows="2"
                placeholder="请填写拓扑结构描述（200字）"
                maxlength="200"
                show-word-limit
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="业务信息描述（请按照提示词补充填写）" prop="yewuimaioshu">
              <el-input
                type="textarea"
                v-model="dataForm.yewuimaioshu"
                :rows="2"
                placeholder="该信息系统包含的业务信息有xxx条，其中信息量约2.5G（Mysql数据形式）；包含文件信息约20G；（请按照提示词补充填写）"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="系统服务描述（请按照提示词补充填写）" prop="xitongmiaoshu">
              <el-input
                type="textarea"
                v-model="dataForm.xitongmiaoshu"
                :rows="2"
                placeholder="该信息系统 提供的系统服务包含的 用户数据约为10万条（请按照提示词补充填写）"
              ></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="line"></div>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="03系统承载业务情况（此项单选）"></el-form-item>
            <el-form-item label="业务类型" prop="s03">
              <el-radio-group v-model="dataForm.s03">
                <el-radio label="50d">生产作业</el-radio>
                <el-radio label="51d">指挥调度</el-radio>
                <el-radio label="52d">管理控制</el-radio>
                <el-radio label="53d">内部办公</el-radio>
                <el-radio label="54d">公众服务</el-radio>
                <el-radio label="55d">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.s03=='55d'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="其他业务类型" prop="qita4">
              <el-input v-model="dataForm.qita4" placeholder="其他业务类型"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="line"></div>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="04系统服务情况（此项单选）"></el-form-item>
            <el-form-item label="服务范围" prop="s041">
              <el-radio-group v-model="dataForm.s041">
                <el-radio label="56d">全国</el-radio>
                <el-radio label="57d">跨省（区、市） 跨 个</el-radio>
                <el-radio label="58d">全省（区、市）</el-radio>
                <el-radio label="59d">跨地（市、区） 跨 个</el-radio>
                <el-radio label="60d">地（市、区）内</el-radio>
                <el-radio label="61d">其它</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.s041=='57d'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="跨省（区、市）" prop="kua1">
              <el-input v-model="dataForm.kua1" placeholder="请输入跨省（区、市） 跨的个数"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.s041=='59d'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="跨地（市、区）" prop="kua2">
              <el-input v-model="dataForm.kua2" placeholder="请输入跨地（市、区） 跨的个数"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.s041=='61d'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="其他服务范围" prop="qita5">
              <el-input v-model="dataForm.qita5" placeholder="其他服务范围"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="服务对象" prop="s042">
              <el-radio-group v-model="dataForm.s042">
                <el-radio label="62d">单位内部人员</el-radio>
                <el-radio label="63d">社会公众人员</el-radio>
                <el-radio label="64d">两者均包括</el-radio>
                <el-radio label="65d">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.s042=='65d'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="其他服务对象" prop="qita6">
              <el-input v-model="dataForm.qita6" placeholder="其他服务对象"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="line"></div>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="05系统网路平台（此项单选）"></el-form-item>
            <el-form-item label="覆盖范围" prop="s051">
              <el-radio-group v-model="dataForm.s051">
                <el-radio label="66d">局域网</el-radio>
                <el-radio label="67d">城域网</el-radio>
                <el-radio label="68d">广域网</el-radio>
                <el-radio label="69d">其它</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.s051=='69d'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="其他覆盖范围" prop="qita7">
              <el-input v-model="dataForm.qita7" placeholder="其他覆盖范围"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="网络性质" prop="s052">
              <el-radio-group v-model="dataForm.s052">
                <el-radio label="70d">业务专网</el-radio>
                <el-radio label="71d">互联网</el-radio>
                <el-radio label="72d">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.s052=='72d'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="其他网络性质" prop="qita8">
              <el-input v-model="dataForm.qita8" placeholder="其他网络性质"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="line"></div>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="06 系统互联情况（可多选）" prop="s06">
              <el-checkbox-group v-model="dataForm.s06" @change="s06">
                <el-checkbox label="73d">与其他行业系统连接</el-checkbox>
                <el-checkbox label="74d">与本行业其他单位系统连接</el-checkbox>
                <el-checkbox label="75d">与本单位其他系统连接</el-checkbox>
                <el-checkbox label="76d">其它</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="s06hav">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="其他系统互联情况" prop="qita9">
              <el-input v-model="dataForm.qita9" placeholder="其他系统互联情况"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="line"></div>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="07关键产品使用情况"></el-form-item>
            <el-table :data="dataForm.gjcpsyqkdata" style="width: 100%" :key="Math.random()">
              <el-table-column align="center" label="序号" type="index"></el-table-column>
              <el-table-column align="center" prop="type" label="产品类型" width="200px">
                <template slot-scope="scope">
                  <div v-if="scope.$index==dataForm.gjcpsyqkdata.length-1">
                    <el-form-item prop="qita10" label-width="1px">
                      <el-input v-model="dataForm.qita10" placeholder="其他产品类型" style="width:130px"></el-input>
                    </el-form-item>
                  </div>
                  <div v-else>{{scope.row.type}}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="num" label="数量" width="300px">
                <template slot-scope="scope" width="100px">
                  <el-form-item
                    :prop="'gjcpsyqkdata.'+scope.$index + '.num'"
                    :rules="dataRule.num"
                    label-width="1px"
                  >
                    <el-input v-model="scope.row.num" placeholder="请填写数量" style="width:100px"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="使用国产品率">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'gjcpsyqkdata.'+scope.$index + '.checkissy'"
                    :rules="dataRule.checkissy"
                    label-width="1px"
                  >
                    <el-radio-group v-model="scope.row.checkissy">
                      <el-radio :label="scope.row.issy[0]">全部使用</el-radio>
                      <el-radio :label="scope.row.issy[1]">全部未使用</el-radio>
                      <el-radio :label="scope.row.issy[2]">部分使用及使用率</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item
                    :prop="'gjcpsyqkdata.'+scope.$index + '.syl'"
                    :rules="dataRule.syl"
                    label-width="1px"
                    v-if="scope.row.checkissy==scope.row.issy[2]"
                  >
                    <el-input v-model="scope.row.syl" placeholder="使用率"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <div class="line" style="margin-top:22px"></div>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="08  系统采用服务情况"></el-form-item>
            <el-table :data="dataForm.fwqkdata" style="width: 100%" :key="Math.random()">
              <el-table-column align="center" label="序号" type="index"></el-table-column>
              <el-table-column align="center" label="服务名称" width="200px">
                <template slot-scope="scope">
                  <div>{{ scope.row.type }}</div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="服务类型" width="300px">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'fwqkdata.'+scope.$index + '.checkisok'"
                    :rules="dataRule.checkisok"
                    label-width="1px"
                    v-if="scope.$index!=dataForm.fwqkdata.length-1"
                  >
                    <el-radio-group v-model="scope.row.checkisok">
                      <el-radio :label="scope.row.isok[0]">有</el-radio>
                      <el-radio :label="scope.row.isok[1]">无</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item prop="qita11" label-width="1px" v-else>
                    <el-input v-model="dataForm.qita11" placeholder="其他"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column align="center" label="服务责任方类型">
                <template slot-scope="scope">
                  <el-form-item
                    :prop="'fwqkdata.'+scope.$index + '.checkzrftype'"
                    :rules="dataRule.checkzrftype"
                    label-width="1px"
                  >
                    <el-radio-group v-model="scope.row.checkzrftype">
                      <el-radio :label="scope.row.zrftype[0]">本行业（单位）</el-radio>
                      <el-radio :label="scope.row.zrftype[1]">国内其他服务商</el-radio>
                      <el-radio :label="scope.row.zrftype[2]">国外服务商</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <div class="line" style="margin-top:22px"></div>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="09 等级测评单位名称" prop="cepingdanwei">
              <el-input v-model="dataForm.cepingdanwei" placeholder="等级测评单位名称"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="11     系统是否是分系统" prop="isfxt">
              <el-radio-group v-model="dataForm.isfxt">
                <el-radio label="21c">是</el-radio>
                <el-radio label="22c">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-show="dataForm.isfxt=='21c'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="12  上级系统名称" prop="shangjisystem">
              <el-input v-model="dataForm.shangjisystem" placeholder="上级系统名称"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-show="dataForm.isfxt=='21c'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="13  上级系统所属单位名称" prop="shangjidanwei">
              <el-input v-model="dataForm.shangjidanwei" placeholder="上级系统所属单位名称"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="line" style="margin-top:22px"></div>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="信息系统类别" prop="msgType">
              <el-select v-model="dataForm.msgType" placeholder="请选择信息系统类别" size="medium">
                <el-option
                  :label="item.name"
                  :value="item.value"
                  v-for="(item, index) in msgTypeList"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="部门信息系统类型" prop="bmMsgType">
              <el-select
                v-model="dataForm.bmMsgType"
                placeholder="请选择信息系统类别"
                size="medium"
                style="width:400px;"
                @change="changeBmMsgType"
                filterable
              >
                <el-option
                  :label="item.name"
                  :value="item.name"
                  v-for="(item, index) in bmMsgTypeList[dataForm.msgType]"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="是否通过专家评审" prop="iszjps">
              <el-radio-group v-model="dataForm.iszjps">
                <el-radio label="53c">是</el-radio>
                <el-radio label="54c">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="定级时间" prop="dingjidate">
              <el-date-picker
                v-model="dataForm.dingjidate"
                type="date"
                value-format="yyyy 年 M 月 d 日"
                placeholder="请选择定级时间"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="填表日期" prop="tianbiaodate">
              <el-date-picker
                v-model="dataForm.tianbiaodate"
                type="date"
                value-format="yyyy 年 M 月 d 日"
                placeholder="请选择填表日期"
              ></el-date-picker>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="填表人" prop="tianbiaoname">
              <el-input v-model="dataForm.tianbiaoname" placeholder="请填写填表人"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="是否有主管部门" prop="iszgbm">
              <el-radio-group v-model="dataForm.iszgbm">
                <el-radio label="55c">是</el-radio>
                <el-radio label="56c">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.iszgbm=='55c'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="07     主管部门名称" prop="zhuguanbumen">
              <el-input v-model="dataForm.zhuguanbumen" placeholder="请填写主管部门名称"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="08     主管部门审批定级情况" prop="iszgbmsp">
              <el-radio-group v-model="dataForm.iszgbmsp">
                <el-radio label="57c">已审批</el-radio>
                <el-radio label="58c">未审批</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="24">
          <div class="grid-content">
            <el-form-item label="09  系统定级报告" prop="isxtdjbg">
              <el-radio-group v-model="dataForm.isxtdjbg">
                <el-radio label="59c">有</el-radio>
                <el-radio label="60c">无</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="40" v-if="dataForm.isxtdjbg=='59c'">
        <el-col :span="12">
          <div class="grid-content">
            <el-form-item label="附件名称" prop="fujian8">
              <el-input v-model="dataForm.fujian8" placeholder="请填写附件名称"></el-input>
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <div class="line" style="margin-top:22px"></div>
      <div v-if="dataForm.bmMsgType1=='50c'">
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="01 系统拓扑结构及说明" prop="f01">
                <el-radio-group v-model="dataForm.f01">
                  <el-radio label="61c">有</el-radio>
                  <el-radio label="62c">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40" v-if="dataForm.f01=='61c'">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="附件名称" prop="fujian1">
                <el-input v-model="dataForm.fujian1" placeholder="请填写附件名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div class="line"></div>
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="02     系统安全组织机构及管理制度" prop="f02">
                <el-radio-group v-model="dataForm.f02">
                  <el-radio label="63c">有</el-radio>
                  <el-radio label="64c">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40" v-if="dataForm.f02=='63c'">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="附件名称" prop="fujian2">
                <el-input v-model="dataForm.fujian2" placeholder="请填写附件名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div class="line"></div>
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="03     系统安全保护设施设计实施方案或改建实施方案" prop="f03">
                <el-radio-group v-model="dataForm.f03">
                  <el-radio label="65c">有</el-radio>
                  <el-radio label="66c">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40" v-if="dataForm.f03=='65c'">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="附件名称" prop="fujian3">
                <el-input v-model="dataForm.fujian3" placeholder="请填写附件名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div class="line"></div>
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="04     系统使用的安全产品清单及认证、销售许可证明" prop="f04">
                <el-radio-group v-model="dataForm.f04">
                  <el-radio label="67c">有</el-radio>
                  <el-radio label="68c">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40" v-if="dataForm.f04=='67c'">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="附件名称" prop="fujian4">
                <el-input v-model="dataForm.fujian4" placeholder="请填写附件名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div class="line"></div>
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="05     系统等级测评报告" prop="f05">
                <el-radio-group v-model="dataForm.f05">
                  <el-radio label="69c">有</el-radio>
                  <el-radio label="70c">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40" v-if="dataForm.f05=='69c'">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="附件名称" prop="fujian5">
                <el-input v-model="dataForm.fujian5" placeholder="请填写附件名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div class="line"></div>
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="06     专家评审情况" prop="f06">
                <el-radio-group v-model="dataForm.f06">
                  <el-radio label="71c">有</el-radio>
                  <el-radio label="72c">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40" v-if="dataForm.f06=='71c'">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="附件名称" prop="fujian6">
                <el-input v-model="dataForm.fujian6" placeholder="请填写附件名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <div class="line"></div>
        <el-row :gutter="40">
          <el-col :span="24">
            <div class="grid-content">
              <el-form-item label="07     上级主管部门审批意见" prop="f07">
                <el-radio-group v-model="dataForm.f07">
                  <el-radio label="73c">有</el-radio>
                  <el-radio label="74c">无</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="40" v-if="dataForm.f07=='73c'">
          <el-col :span="12">
            <div class="grid-content">
              <el-form-item label="附件名称" prop="fujian7">
                <el-input v-model="dataForm.fujian7" placeholder="请填写附件名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" round @click="dataFormSubmit()">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    var isqita4 = (rule, value, callback) => {
      if (this.dataForm.s03 == "55d") {
        if (value === "") {
          callback(new Error("请输入其他业务类型"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isqita5 = (rule, value, callback) => {
      if (this.dataForm.s041 == "61d") {
        if (value === "") {
          callback(new Error("请输入其他服务范围"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isqita6 = (rule, value, callback) => {
      if (this.dataForm.s042 == "65d") {
        if (value === "") {
          callback(new Error("请输入其他服务对象"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isqita7 = (rule, value, callback) => {
      if (this.dataForm.s051 == "69d") {
        if (value === "") {
          callback(new Error("请输入其他覆盖范围"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isqita8 = (rule, value, callback) => {
      if (this.dataForm.s052 == "72d") {
        if (value === "") {
          callback(new Error("请输入其他网络性质"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isqita9 = (rule, value, callback) => {
      if (this.s06hav) {
        if (value === "") {
          callback(new Error("请输入其他系统互联情况"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var syl = (rule, value, callback) => {
      console.log("rule", rule);
      var i = rule.field.split(".")[1];
      console.log("i", i);
      if (
        this.dataForm.gjcpsyqkdata[i].checkissy ==
        this.dataForm.gjcpsyqkdata[i].issy[2]
      ) {
        if (value === "") {
          callback(new Error("请输入使用率"));
        }
        setTimeout(() => {
          if (!Number.isInteger(+value)) {
            callback(new Error("请输入数字值"));
          } else {
            callback();
          }
        }, 100);
      } else {
        callback();
      }
    };
    var shangjisystem = (rule, value, callback) => {
      if (this.dataForm.isfxt == "21c") {
        if (value === "") {
          callback(new Error("请输入上级系统名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var shangjidanwei = (rule, value, callback) => {
      if (this.dataForm.isfxt == "21c") {
        if (value === "") {
          callback(new Error("请输入上级系统所属单位名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isfujian8 = (rule, value, callback) => {
      if (this.dataForm.isxtdjbg == "59c") {
        if (value === "") {
          callback(new Error("请输入系统定级报告附件名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var iszhuguanbumen = (rule, value, callback) => {
      if (this.dataForm.iszgbm == "55c") {
        if (value === "") {
          callback(new Error("请输入主管部门名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var kua1 = (rule, value, callback) => {
      if (this.dataForm.s041 == "57d") {
        if (value === "") {
          callback(new Error("请输入跨省（区、市）的个数"));
        }
        setTimeout(() => {
          if (!Number.isInteger(+value)) {
            callback(new Error("请输入数字值"));
          } else {
            callback();
          }
        }, 100);
      } else {
        callback();
      }
    };
    var kua2 = (rule, value, callback) => {
      if (this.dataForm.s041 == "59d") {
        if (value === "") {
          callback(new Error("请输入跨地（市、区）的个数"));
        }
        setTimeout(() => {
          if (!Number.isInteger(+value)) {
            callback(new Error("请输入数字值"));
          } else {
            callback();
          }
        }, 100);
      } else {
        callback();
      }
    };
    var isNumber = (rule, value, callback) => {
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error("请输入数字值"));
        } else {
          callback();
        }
      }, 100);
    };
    var isf01 = (rule, value, callback) => {
      if (this.dataForm.bmMsgType1 == "50c") {
        if (value === "") {
          callback(new Error("请选择相关选项"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isf02 = (rule, value, callback) => {
      if (this.dataForm.bmMsgType1 == "50c") {
        if (value === "") {
          callback(new Error("请选择相关选项"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isf03 = (rule, value, callback) => {
      if (this.dataForm.bmMsgType1 == "50c") {
        if (value === "") {
          callback(new Error("请选择相关选项"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isf04 = (rule, value, callback) => {
      if (this.dataForm.bmMsgType1 == "50c") {
        if (value === "") {
          callback(new Error("请选择相关选项"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isf05 = (rule, value, callback) => {
      if (this.dataForm.bmMsgType1 == "50c") {
        if (value === "") {
          callback(new Error("请选择相关选项"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isf06 = (rule, value, callback) => {
      if (this.dataForm.bmMsgType1 == "50c") {
        if (value === "") {
          callback(new Error("请选择相关选项"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isf07 = (rule, value, callback) => {
      if (this.dataForm.bmMsgType1 == "50c") {
        if (value === "") {
          callback(new Error("请选择相关选项"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isfujian1 = (rule, value, callback) => {
      if (this.dataForm.f01 == "61c") {
        if (value === "") {
          callback(new Error("请填写附件名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isfujian2 = (rule, value, callback) => {
      if (this.dataForm.f02 == "63c") {
        if (value === "") {
          callback(new Error("请填写附件名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isfujian3 = (rule, value, callback) => {
      if (this.dataForm.f03 == "65c") {
        if (value === "") {
          callback(new Error("请填写附件名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isfujian4 = (rule, value, callback) => {
      if (this.dataForm.f04 == "67c") {
        if (value === "") {
          callback(new Error("请填写附件名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isfujian5 = (rule, value, callback) => {
      if (this.dataForm.f05 == "69c") {
        if (value === "") {
          callback(new Error("请填写附件名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isfujian6 = (rule, value, callback) => {
      if (this.dataForm.f06 == "71c") {
        if (value === "") {
          callback(new Error("请填写附件名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var isfujian7 = (rule, value, callback) => {
      if (this.dataForm.f07 == "73c") {
        if (value === "") {
          callback(new Error("请填写附件名称"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      upPicUrl:
        "http://39.106.124.143/gen-word-api/api/FileController/huploadFile",
      // upPicUrl: "http://192.168.200.97:8082/api/FileController/huploadFile",
      visible: false,
      imgdialogVisible: false,
      // 48c第 一 级 49c 第 二 级 50c 第 三 级 51c第四级 52c第五级
      levelList: {
        "48c": ["23c", "24c", "36c", "37c"],
        "49c": ["25c", "27c", "26c", "38c", "89c", "39c"],
        "50c": ["28c", "29c", "30c", "40c", "41c", "42c"],
        "51c": ["31c", "32c", "33c", "43c", "44c", "45c"],
        "52c": ["34c", "35c", "46c", "47c"],
      },
      msgTypeList: [
        {
          name: "部门信息系统",
          value: "0",
        },
        {
          name: "学校信息系统",
          value: "1",
        },
      ],
      bmMsgTypeList: [
        [
          {
            name: "部级-政务管理类-办公与事务处理",
            value: "49c",
          },
          {
            name: "省级-政务管理类-办公与事务处理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-办公与事务处理",
            value: "49c",
          },
          {
            name: "部级-政务管理类-公文与信息交换",
            value: "50c",
          },
          {
            name: "省级-政务管理类-公文与信息交换",
            value: "50c",
          },
          {
            name: "地市-政务管理类-公文与信息交换",
            value: "49c",
          },
          {
            name: "部级-政务管理类-人事管理",
            value: "49c",
          },
          {
            name: "省级-政务管理类-人事管理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-人事管理",
            value: "49c",
          },
          {
            name: "部级-政务管理类-财务管理",
            value: "49c",
          },
          {
            name: "省级-政务管理类-财务管理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-财务管理",
            value: "49c",
          },
          {
            name: "部级-政务管理类-资产管理",
            value: "49c",
          },
          {
            name: "省级-政务管理类-资产管理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-资产管理",
            value: "49c",
          },
          {
            name: "部级-政务管理类-信访管理",
            value: "49c",
          },
          {
            name: "省级-政务管理类-信访管理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-信访管理",
            value: "49c",
          },
          {
            name: "部级-政务管理类-档案管理",
            value: "",
          },
          {
            name: "省级-政务管理类-档案管理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-档案管理",
            value: "49c",
          },
          {
            name: "部级-政务管理类-党务管理",
            value: "49c",
          },
          {
            name: "省级-政务管理类-党务管理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-党务管理",
            value: "49c",
          },
          {
            name: "部级-政务管理类-科研管理",
            value: "49c",
          },
          {
            name: "省级-政务管理类-科研管理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-科研管理",
            value: "49c",
          },
          {
            name: "部级-政务管理类-教育统计管理",
            value: "50c",
          },
          {
            name: "省级-政务管理类-教育统计管理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-教育统计管理",
            value: "49c",
          },
          {
            name: "部级-政务管理类-决策支持",
            value: "49c",
          },
          {
            name: "省级-政务管理类-决策支持",
            value: "49c",
          },
          {
            name: "地市-政务管理类-决策支持",
            value: "49c",
          },
          {
            name: "部级-政务管理类-应急指挥",
            value: "50c",
          },
          {
            name: "省级-政务管理类-应急指挥",
            value: "49c",
          },
          {
            name: "地市-政务管理类-应急指挥",
            value: "49c",
          },
          {
            name: "部级-政务管理类-舆情监测与管理",
            value: "50c",
          },
          {
            name: "省级-政务管理类-舆情监测与管理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-舆情监测与管理",
            value: "49c",
          },
          {
            name: "部级-政务管理类-高等教育招生计划管理",
            value: "50c",
          },
          {
            name: "省级-政务管理类-高等教育招生计划管理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-高等教育招生计划管理",
            value: "49c",
          },
          {
            name: "部级-政务管理类-普通高校招生网上录取管理",
            value: "50c",
          },
          {
            name: "省级-政务管理类-普通高校招生网上录取管理",
            value: "50c",
          },
          {
            name: "地市-政务管理类-普通高校招生网上录取管理",
            value: "50c",
          },
          {
            name: "部级-政务管理类-教育考试考务管理与服务",
            value: "50c",
          },
          {
            name: "省级-政务管理类-教育考试考务管理与服务",
            value: "50c",
          },
          {
            name: "地市-政务管理类-教育考试考务管理与服务",
            value: "49c",
          },
          {
            name: "部级-政务管理类-评审、表彰管理",
            value: "49c",
          },
          {
            name: "省级-政务管理类-评审、表彰管理",
            value: "49c",
          },
          {
            name: "地市-政务管理类-评审、表彰管理",
            value: "49c",
          },
          {
            name: "部级-学校管理类-学校管理",
            value: "50c",
          },
          {
            name: "省级-学校管理类-学校管理",
            value: "49c",
          },
          {
            name: "地市-学校管理类-学校管理",
            value: "49c",
          },
          {
            name: "部级-学校管理类-学科、专业管理",
            value: "50c",
          },
          {
            name: "省级-学校管理类-学科、专业管理",
            value: "49c",
          },
          {
            name: "地市-学校管理类-学科、专业管理",
            value: "49c",
          },
          {
            name: "部级-学校管理类-教学改革管理",
            value: "50c",
          },
          {
            name: "省级-学校管理类-教学改革管理",
            value: "49c",
          },
          {
            name: "地市-学校管理类-教学改革管理",
            value: "49c",
          },
          {
            name: "部级-学校管理类-教学质量评估",
            value: "50c",
          },
          {
            name: "省级-学校管理类-教学质量评估",
            value: "49c",
          },
          {
            name: "地市-学校管理类-教学质量评估",
            value: "49c",
          },
          {
            name: "部级-学校管理类-校园安全与稳定管理",
            value: "50c",
          },
          {
            name: "省级-学校管理类-校园安全与稳定管理",
            value: "49c",
          },
          {
            name: "地市-学校管理类-校园安全与稳定管理",
            value: "49c",
          },
          {
            name: "部级-学校管理类-教育经费监管",
            value: "50c",
          },
          {
            name: "省级-学校管理类-教育经费监管",
            value: "49c",
          },
          {
            name: "地市-学校管理类-教育经费监管",
            value: "49c",
          },
          {
            name: "部级-学生管理类-学生学籍管理",
            value: "50c",
          },
          {
            name: "省级-学生管理类-学生学籍管理",
            value: "50c",
          },
          {
            name: "地市-学生管理类-学生学籍管理",
            value: "49c",
          },
          {
            name: "部级-学生管理类-招生录取管理",
            value: "50c",
          },
          {
            name: "省级-学生管理类-招生录取管理",
            value: "50c",
          },
          {
            name: "地市-学生管理类-招生录取管理",
            value: "50c",
          },
          {
            name: "部级-学生管理类-学生资助管理",
            value: "50c",
          },
          {
            name: "省级-学生管理类-学生资助管理",
            value: "49c",
          },
          {
            name: "地市-学生管理类-学生资助管理",
            value: "49c",
          },
          {
            name: "部级-学生管理类-学位授予管理",
            value: "50c",
          },
          {
            name: "省级-学生管理类-学位授予管理",
            value: "50c",
          },
          {
            name: "地市-学生管理类-学位授予管理",
            value: "49c",
          },

          {
            name: "部级-教师管理类-教师基本信息管理",
            value: "50c",
          },
          {
            name: "省级-教师管理类-教师基本信息管理",
            value: "49c",
          },
          {
            name: "地市-教师管理类-教师基本信息管理",
            value: "49c",
          },
          {
            name: "部级-教师管理类-教师资格认定管理",
            value: "50c",
          },
          {
            name: "省级-教师管理类-教师资格认定管理",
            value: "49c",
          },
          {
            name: "地市-教师管理类-教师资格认定管理",
            value: "49c",
          },
          {
            name: "部级-教师管理类-教师培训管理",
            value: "50c",
          },
          {
            name: "省级-教师管理类-教师培训管理",
            value: "49c",
          },
          {
            name: "地市-教师管理类-教师培训管理",
            value: "49c",
          },
          {
            name: "部级-教师管理类-教师教育管理",
            value: "50c",
          },
          {
            name: "省级-教师管理类-教师教育管理",
            value: "49c",
          },
          {
            name: "地市-教师管理类-教师教育管理",
            value: "49c",
          },
          {
            name: "部级-教师管理类-教师职称管理",
            value: "50c",
          },
          {
            name: "省级-教师管理类-教师职称管理",
            value: "49c",
          },
          {
            name: "地市-教师管理类-教师职称管理",
            value: "49c",
          },
          {
            name: "部级-综合服务类-门户网站",
            value: "50c",
          },
          {
            name: "省级-综合服务类-门户网站",
            value: "50c",
          },
          {
            name: "地市-综合服务类-门户网站",
            value: "49c",
          },
          {
            name: "部级-综合服务类-论坛、社区类网站",
            value: "49c",
          },
          {
            name: "省级-综合服务类-论坛、社区类网站",
            value: "49c",
          },
          {
            name: "地市-综合服务类-论坛、社区类网站",
            value: "49c",
          },
          {
            name: "部级-综合服务类-教育教学资源",
            value: "50c",
          },
          {
            name: "省级-综合服务类-教育教学资源",
            value: "49c",
          },
          {
            name: "地市-综合服务类-教育教学资源",
            value: "49c",
          },
          {
            name: "部级-综合服务类-毕业、就业信息管理",
            value: "50c",
          },
          {
            name: "省级-综合服务类-毕业、就业信息管理",
            value: "49c",
          },
          {
            name: "地市-综合服务类-毕业、就业信息管理",
            value: "49c",
          },
          {
            name: "部级-综合服务类-电子邮件",
            value: "49c",
          },
          {
            name: "省级-综合服务类-电子邮件",
            value: "49c",
          },
          {
            name: "地市-综合服务类-电子邮件",
            value: "49c",
          },
          {
            name: "部级-综合服务类-视频服务",
            value: "50c",
          },
          {
            name: "省级-综合服务类-视频服务",
            value: "49c",
          },
          {
            name: "地市-综合服务类-视频服务",
            value: "49c",
          },
          {
            name: "部级-综合服务类-安防监控",
            value: "49c",
          },
          {
            name: "省级-综合服务类-安防监控",
            value: "49c",
          },
          {
            name: "地市-综合服务类-安防监控",
            value: "49c",
          },
          {
            name: "部级-综合服务类-内网门户与身份认证",
            value: "50c",
          },
          {
            name: "省级-综合服务类-内网门户与身份认证",
            value: "49c",
          },
          {
            name: "地市-综合服务类-内网门户与身份认证",
            value: "49c",
          },
          {
            name: "部级-综合服务类-公共数据库",
            value: "50c",
          },
          {
            name: "省级-综合服务类-公共数据库",
            value: "49c",
          },
          {
            name: "地市-综合服务类-公共数据库",
            value: "49c",
          },
          {
            name: "部级-综合服务类-运维管理",
            value: "50c",
          },
          {
            name: "省级-综合服务类-运维管理",
            value: "49c",
          },
          {
            name: "地市-综合服务类-运维管理",
            value: "49c",
          },
        ],
        [
          {
            name: "I类学校-校务管理类-办公与事务处理",
            value: "49c",
          },
          {
            name: "II类学校-校务管理类-办公与事务处理",
            value: "49c",
          },
          {
            name: "III类学校-校务管理类-办公与事务处理",
            value: "48c",
          },
          {
            name: "I类学校-校务管理类-公文与信息交换",
            value: "49c",
          },
          {
            name: "II类学校-校务管理类-公文与信息交换",
            value: "49c",
          },
          {
            name: "III类学校-校务管理类-公文与信息交换",
            value: "48c",
          },
          {
            name: "I类学校-校务管理类-人事管理",
            value: "49c",
          },
          {
            name: "II类学校-校务管理类-人事管理",
            value: "49c",
          },
          {
            name: "III类学校-校务管理类-人事管理",
            value: "48c",
          },
          {
            name: "I类学校-校务管理类-财务管理",
            value: "49c",
          },
          {
            name: "II类学校-校务管理类-财务管理",
            value: "49c",
          },
          {
            name: "III类学校-校务管理类-财务管理",
            value: "48c",
          },
          {
            name: "I类学校-校务管理类-资产管理",
            value: "49c",
          },
          {
            name: "II类学校-校务管理类-资产管理",
            value: "49c",
          },
          {
            name: "III类学校-校务管理类-资产管理",
            value: "48c",
          },
          {
            name: "I类学校-校务管理类-后勤管理",
            value: "49c",
          },
          {
            name: "II类学校-校务管理类-后勤管理",
            value: "49c",
          },
          {
            name: "III类学校-校务管理类-后勤管理",
            value: "48c",
          },
          {
            name: "I类学校-校务管理类-学生教育工作管理",
            value: "49c",
          },
          {
            name: "II类学校-校务管理类-学生教育工作管理",
            value: "49c",
          },
          {
            name: "III类学校-校务管理类-学生教育工作管理",
            value: "48c",
          },
          {
            name: "I类学校-校务管理类-学生体质健康数据管理",
            value: "49c",
          },
          {
            name: "II类学校-校务管理类-学生体质健康数据管理",
            value: "49c",
          },
          {
            name: "III类学校-校务管理类-学生体质健康数据管理",
            value: "48c",
          },
          {
            name: "I类学校-校务管理类-档案管理",
            value: "49c",
          },
          {
            name: "II类学校-校务管理类-档案管理",
            value: "49c",
          },
          {
            name: "III类学校-校务管理类-档案管理",
            value: "48c",
          },
          {
            name: "I类学校-校务管理类-党务管理",
            value: "49c",
          },
          {
            name: "II类学校-校务管理类-党务管理",
            value: "49c",
          },
          {
            name: "III类学校-校务管理类-党务管理",
            value: "48c",
          },
          {
            name: "I类学校-教学科研类-教学改革管理",
            value: "49c",
          },
          {
            name: "II类学校-教学科研类-教学改革管理",
            value: "49c",
          },
          {
            name: "III类学校-教学科研类-教学改革管理",
            value: "48c",
          },
          {
            name: "I类学校-教学科研类-学科、专业管理",
            value: "49c",
          },
          {
            name: "II类学校-教学科研类-学科、专业管理",
            value: "49c",
          },
          {
            name: "III类学校-教学科研类-学科、专业管理",
            value: "48c",
          },
          {
            name: "I类学校-教学科研类-教务教学管理",
            value: "49c",
          },
          {
            name: "II类学校-教学科研类-教务教学管理",
            value: "49c",
          },
          {
            name: "III类学校-教学科研类-教务教学管理",
            value: "48c",
          },
          {
            name: "I类学校-教学科研类-教学资源管理",
            value: "49c",
          },
          {
            name: "II类学校-教学科研类-教学资源管理",
            value: "49c",
          },
          {
            name: "III类学校-教学科研类-教学资源管理",
            value: "48c",
          },
          {
            name: "I类学校-教学科研类-教学质量评估与保障",
            value: "49c",
          },
          {
            name: "II类学校-教学科研类-教学质量评估与保障",
            value: "49c",
          },
          {
            name: "III类学校-教学科研类-教学质量评估与保障",
            value: "48c",
          },
          {
            name: "I类学校-教学科研类-科研管理",
            value: "50c",
          },
          {
            name: "II类学校-教学科研类-科研管理",
            value: "49c",
          },
          {
            name: "III类学校-教学科研类-科研管理",
            value: "48c",
          },
          {
            name: "I类学校-教学科研类-科研情报",
            value: "50c",
          },
          {
            name: "II类学校-教学科研类-科研情报",
            value: "49c",
          },
          {
            name: "III类学校-教学科研类-科研情报",
            value: "48c",
          },
          {
            name: "I类学校-招生就业类-招生录取管理",
            value: "50c",
          },
          {
            name: "II类学校-招生就业类-招生录取管理",
            value: "49c",
          },
          {
            name: "III类学校-招生就业类-招生录取管理",
            value: "48c",
          },
          {
            name: "I类学校-招生就业类-学生就业管理",
            value: "49c",
          },
          {
            name: "II类学校-招生就业类-学生就业管理",
            value: "49c",
          },
          {
            name: "III类学校-招生就业类-学生就业管理",
            value: "48c",
          },
          {
            name: "I类学校-综合服务类-门户网站",
            value: "50c",
          },
          {
            name: "II类学校-综合服务类-门户网站",
            value: "49c",
          },
          {
            name: "III类学校-综合服务类-门户网站",
            value: "48c",
          },
          {
            name: "I类学校-综合服务类-论坛、社区类网站",
            value: "50c",
          },
          {
            name: "II类学校-综合服务类-论坛、社区类网站",
            value: "49c",
          },
          {
            name: "III类学校-综合服务类-论坛、社区类网站",
            value: "48c",
          },
          {
            name: "I类学校-综合服务类-数字图书馆",
            value: "49c",
          },
          {
            name: "II类学校-综合服务类-数字图书馆",
            value: "49c",
          },
          {
            name: "III类学校-综合服务类-数字图书馆",
            value: "48c",
          },
          {
            name: "I类学校-综合服务类-电子邮件",
            value: "49c",
          },
          {
            name: "II类学校-综合服务类-电子邮件",
            value: "49c",
          },
          {
            name: "III类学校-综合服务类-电子邮件",
            value: "48c",
          },
          {
            name: "I类学校-综合服务类-视频服务",
            value: "49c",
          },
          {
            name: "II类学校-综合服务类-视频服务",
            value: "49c",
          },
          {
            name: "III类学校-综合服务类-视频服务",
            value: "48c",
          },
          {
            name: "I类学校-综合服务类-安防监控",
            value: "49c",
          },
          {
            name: "II类学校-综合服务类-安防监控",
            value: "49c",
          },
          {
            name: "III类学校-综合服务类-安防监控",
            value: "48c",
          },
          {
            name: "I类学校-综合服务类-校园一卡通",
            value: "50c",
          },
          {
            name: "II类学校-综合服务类-校园一卡通",
            value: "49c",
          },
          {
            name: "III类学校-综合服务类-校园一卡通",
            value: "48c",
          },
          {
            name: "I类学校-综合服务类-内网门户与身份认证",
            value: "49c",
          },
          {
            name: "II类学校-综合服务类-内网门户与身份认证",
            value: "49c",
          },
          {
            name: "III类学校-综合服务类-内网门户与身份认证",
            value: "48c",
          },
          {
            name: "I类学校-综合服务类-公共数据库",
            value: "49c",
          },
          {
            name: "II类学校-综合服务类-公共数据库",
            value: "49c",
          },
          {
            name: "III类学校-综合服务类-公共数据库",
            value: "48c",
          },
          {
            name: "I类学校-综合服务类-运维管理",
            value: "49c",
          },
          {
            name: "II类学校-综合服务类-运维管理",
            value: "49c",
          },
          {
            name: "III类学校-综合服务类-运维管理",
            value: "48c",
          },
        ],
      ],
      tuputuList: [],
      fwqkdata: [],
      gjcpsyqkdata: [],
      dataForm1: {
        id: "",
        danweiid: "",
        system: "",
        tourudate: "",
        kaifadanwei: "",
        yewugaishu: "",
        tuoputu: "",
        tuoputumaioshu: "",
        yewuimaioshu:
          "该信息系统包含的业务信息有xxx条，其中信息量约2.5G（Mysql数据形式）；包含文件信息约20G；",
        xitongmiaoshu: "该信息系统 提供的系统服务包含的 用户数据约为10万条",
        s03: "",
        qita4: "",
        s041: "",
        qita5: "",
        s042: "",
        qita6: "",
        s051: "",
        qita7: "",
        s052: "",
        qita8: "",
        s06: [],
        qita9: "",
        qita10: "",
        qita11: "",
        cepingdanwei: "",
        isfxt: "",
        shangjisystem: "",
        shangjidanwei: "",
        dingjidate: "",
        tianbiaodate: "",
        tianbiaoname: "",
        zhuguanbumen: "",
        fujian1: "",
        fujian2: "",
        fujian3: "",
        fujian4: "",
        fujian5: "",
        fujian6: "",
        fujian7: "",
        fujian8: "",
        iszjps: "",
        iszgbm: "",
        iszgbmsp: "",
        isxtdjbg: "",
        f01: "",
        f02: "",
        f03: "",
        f04: "",
        f05: "",
        f06: "",
        f07: "",
        f08: "",
        kua1: "",
        kua2: "",
        gjcpsyqkdata: [
          {
            type: "安全专用产品",
            num: "",
            issy: ["78d", "79d", "80d"],
            syl: "",
            checkissy: "",
          },
          {
            type: "网络产品",
            num: "",
            issy: ["81d", "82d", "83d"],
            syl: "",
            checkissy: "",
          },
          {
            type: "操作系统",
            num: "",
            issy: ["84d", "85d", "86d"],
            syl: "",
            checkissy: "",
          },
          {
            type: "数据库",
            num: "",
            issy: ["87d", "88d", "89d"],
            syl: "",
            checkissy: "",
          },
          {
            type: "服务器",
            num: "",
            issy: ["90d", "91d", "92d"],
            syl: "",
            checkissy: "",
          },
          {
            type: "其他",
            num: "",
            issy: ["93d", "94d", "95d"],
            syl: "",
            checkissy: "",
          },
        ],
        fwqkdata: [
          {
            type: "等级测评",
            isok: ["1f", "1g"],
            zrftype: ["96d", "97d", "98d"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "风险评估",
            isok: ["2f", "2g"],
            zrftype: ["99d", "01c", "02c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "灾难恢复",
            isok: ["3f", "3g"],
            zrftype: ["03c", "04c", "05c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "应急响应",
            isok: ["4f", "4g"],
            zrftype: ["06c", "07c", "08c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "系统集成",
            isok: ["5f", "5g"],
            zrftype: ["09c", "10c", "11c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "安全咨询",
            isok: ["6f", "6g"],
            zrftype: ["12c", "13c", "14c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "安全培训",
            isok: ["7f", "7g"],
            zrftype: ["15c", "16c", "17c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "其他",
            isok: [],
            zrftype: ["18c", "19c", "20c"],
            checkisok: "",
            checkzrftype: "",
            qita: "",
          },
        ],
        msgType: "",
        bmMsgType: "",
        bmMsgType1: "",
      },
      dataForm: {
        id: "",
        danweiid: "",
        system: "",
        tourudate: "",
        kaifadanwei: "",
        yewugaishu: "",
        tuoputu: "",
        tuoputumaioshu: "",
        yewuimaioshu:
          "该信息系统包含的业务信息有xxx条，其中信息量约2.5G（Mysql数据形式）；包含文件信息约20G；",
        xitongmiaoshu: "该信息系统 提供的系统服务包含的 用户数据约为10万条",
        s03: "",
        qita4: "",
        s041: "",
        qita5: "",
        s042: "",
        qita6: "",
        s051: "",
        qita7: "",
        s052: "",
        qita8: "",
        s06: [],
        qita9: "",
        qita10: "",
        qita11: "",
        cepingdanwei: "",
        isfxt: "",
        shangjisystem: "",
        shangjidanwei: "",
        dingjidate: "",
        tianbiaodate: "",
        tianbiaoname: "",
        zhuguanbumen: "",
        fujian1: "",
        fujian2: "",
        fujian3: "",
        fujian4: "",
        fujian5: "",
        fujian6: "",
        fujian7: "",
        fujian8: "",
        iszjps: "",
        iszgbm: "",
        iszgbmsp: "",
        isxtdjbg: "",
        f01: "",
        f02: "",
        f03: "",
        f04: "",
        f05: "",
        f06: "",
        f07: "",
        f08: "",
        kua1: "",
        kua2: "",
        gjcpsyqkdata: [
          {
            type: "安全专用产品",
            num: "",
            issy: ["78d", "79d", "80d"],
            syl: "",
            checkissy: "",
          },
          {
            type: "网络产品",
            num: "",
            issy: ["81d", "82d", "83d"],
            syl: "",
            checkissy: "",
          },
          {
            type: "操作系统",
            num: "",
            issy: ["84d", "85d", "86d"],
            syl: "",
            checkissy: "",
          },
          {
            type: "数据库",
            num: "",
            issy: ["87d", "88d", "89d"],
            syl: "",
            checkissy: "",
          },
          {
            type: "服务器",
            num: "",
            issy: ["90d", "91d", "92d"],
            syl: "",
            checkissy: "",
          },
          {
            type: "其他",
            num: "",
            issy: ["93d", "94d", "95d"],
            syl: "",
            checkissy: "",
          },
        ],
        fwqkdata: [
          {
            type: "等级测评",
            isok: ["1f", "1g"],
            zrftype: ["96d", "97d", "98d"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "风险评估",
            isok: ["2f", "2g"],
            zrftype: ["99d", "01c", "02c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "灾难恢复",
            isok: ["3f", "3g"],
            zrftype: ["03c", "04c", "05c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "应急响应",
            isok: ["4f", "4g"],
            zrftype: ["06c", "07c", "08c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "系统集成",
            isok: ["5f", "5g"],
            zrftype: ["09c", "10c", "11c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "安全咨询",
            isok: ["6f", "6g"],
            zrftype: ["12c", "13c", "14c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "安全培训",
            isok: ["7f", "7g"],
            zrftype: ["15c", "16c", "17c"],
            checkisok: "",
            checkzrftype: "",
          },
          {
            type: "其他",
            isok: [],
            zrftype: ["18c", "19c", "20c"],
            checkisok: "",
            checkzrftype: "",
            qita: "",
          },
        ],
        msgType: "",
        bmMsgType: "",
        bmMsgType1: "",
      },
      dataRule: {
        system: [
          { required: true, message: "请填写系统名称", trigger: "blur" },
        ],
        tourudate: [
          { required: true, message: "请选择投入运行日期", trigger: "blur" },
        ],
        kaifadanwei: [
          { required: true, message: "请填写开发单位", trigger: "blur" },
        ],
        yewugaishu: [
          { required: true, message: "请填写业务概述", trigger: "blur" },
        ],
        tuoputu: [
          { required: true, message: "请上传网络拓扑图", trigger: "blur" },
        ],
        tuoputumaioshu: [
          { required: true, message: "请填写拓扑结构描述", trigger: "blur" },
        ],
        yewuimaioshu: [
          { required: true, message: "请填写业务信息描述", trigger: "blur" },
        ],
        xitongmiaoshu: [
          { required: true, message: "请填写系统服务描述", trigger: "blur" },
        ],
        s03: [
          {
            required: true,
            message: "请选择系统承载业务情况",
            trigger: "blur",
          },
        ],
        s041: [{ required: true, message: "请选择服务范围", trigger: "blur" }],
        s042: [{ required: true, message: "请选择服务对象", trigger: "blur" }],
        s051: [{ required: true, message: "请选择覆盖范围", trigger: "blur" }],
        s052: [{ required: true, message: "请选择网络性质", trigger: "blur" }],
        s06: [
          { required: true, message: "请选择系统互联情况", trigger: "blur" },
        ],
        num: [
          {
            required: true,
            message: "请填写数量",
            trigger: "blur",
          },
          {
            type: "number",
            validator: isNumber,
            message: "请输入数字值",
            trigger: ["blur", "change"],
          },
        ],
        checkissy: [
          { required: true, message: "请选择使用国产品率", trigger: "blur" },
        ],
        checkisok: [
          { required: true, message: "请选择服务类型", trigger: "blur" },
        ],
        checkisokqita: [
          { required: true, message: "请填写其他服务类型", trigger: "blur" },
        ],
        checkzrftype: [
          { required: true, message: "请选择服务责任方类型", trigger: "blur" },
        ],
        syl: [{ validator: syl, trigger: "blur" }],
        qita4: [{ validator: isqita4, trigger: "blur" }],
        qita5: [{ validator: isqita5, trigger: "blur" }],
        qita6: [{ validator: isqita6, trigger: "blur" }],
        qita7: [{ validator: isqita7, trigger: "blur" }],
        qita8: [{ validator: isqita8, trigger: "blur" }],
        qita9: [{ validator: isqita9, trigger: "blur" }],

        cepingdanwei: [
          {
            required: true,
            message: "请填写等级测评单位名称",
            trigger: "blur",
          },
        ],
        isfxt: [
          {
            required: true,
            message: "请选择系统是否是分系统",
            trigger: "blur",
          },
        ],
        kua1: [{ validator: kua1, trigger: "blur" }],
        kua2: [{ validator: kua2, trigger: "blur" }],
        shangjisystem: [{ validator: shangjisystem, trigger: "blur" }],
        shangjidanwei: [{ validator: shangjidanwei, trigger: "blur" }],
        fujian8: [{ validator: isfujian8, trigger: "blur" }],
        zhuguanbumen: [{ validator: iszhuguanbumen, trigger: "blur" }],
        msgType: [
          { required: true, message: "请选择信息系统类别", trigger: "blur" },
        ],
        bmMsgType: [
          { required: true, message: "请选择信息系统类别", trigger: "blur" },
        ],
        iszjps: [
          {
            required: true,
            message: "请选择是否通过专家评审",
            trigger: "blur",
          },
        ],
        dingjidate: [
          { required: true, message: "请选择定级时间", trigger: "blur" },
        ],
        tianbiaodate: [
          { required: true, message: "请选择填表日期", trigger: "blur" },
        ],
        tianbiaoname: [
          { required: true, message: "请填写填表人", trigger: "blur" },
        ],
        iszgbm: [
          { required: true, message: "请选择是否有主管部门", trigger: "blur" },
        ],
        qita10: [
          { required: true, message: "请填写其他产品类型", trigger: "blur" },
        ],
        qita11: [
          { required: true, message: "请填写其他服务类型", trigger: "blur" },
        ],
        iszgbmsp: [
          {
            required: true,
            message: "请选择主管部门审批定级情况",
            trigger: "blur",
          },
        ],
        isxtdjbg: [
          {
            required: true,
            message: "请选择是否有系统定级报告",
            trigger: "blur",
          },
        ],
        dingjidate: [
          { required: true, message: "请选择定级时间", trigger: "blur" },
        ],
        f01: [{ validator: isf01, trigger: "blur" }],
        f02: [{ validator: isf02, trigger: "blur" }],
        f03: [{ validator: isf03, trigger: "blur" }],
        f04: [{ validator: isf04, trigger: "blur" }],
        f05: [{ validator: isf05, trigger: "blur" }],
        f06: [{ validator: isf06, trigger: "blur" }],
        f07: [{ validator: isf07, trigger: "blur" }],
        fujian1: [{ validator: isfujian1, trigger: "blur" }],
        fujian2: [{ validator: isfujian2, trigger: "blur" }],
        fujian3: [{ validator: isfujian3, trigger: "blur" }],
        fujian4: [{ validator: isfujian4, trigger: "blur" }],
        fujian5: [{ validator: isfujian5, trigger: "blur" }],
        fujian6: [{ validator: isfujian6, trigger: "blur" }],
        fujian7: [{ validator: isfujian7, trigger: "blur" }],
      },
      s06hav: false,
      lookpic: "",
    };
  },
  methods: {
    handleRemove(file, fileList) {
      var fl = "";
      for (var i = 0; i < fileList.length; i++) {
        fl += fileList[i].response.data.filePath + ",";
      }
      this.dataForm.tuoputu = fl.substring(0, fl.length - 1);
      console.log(this.dataForm.tuoputu);
    },
    upimgok(f, file, fileList) {
      var fl = "";
      for (var i = 0; i < fileList.length; i++) {
        fl += fileList[i].response.data.filePath + ",";
      }
      this.dataForm.tuoputu = fl.substring(0, fl.length - 1);
      console.log(this.dataForm.tuoputu);
    },
    handlePictureCardPreview(file) {
      this.lookpic = file.url;
      this.imgdialogVisible = true;
    },
    handleChange() {
      var locCode = "";
      var loc = "";
      for (let i = 0; i < this.dataForm.danweiaddress.length; i++) {
        loc += CodeToText[this.dataForm.danweiaddress[i]];
      }
      console.log(this.dataForm.danweiaddress);
      console.log(loc);
    },
    getAddText(add) {
      var loc = "";
      for (let i = 0; i < this.dataForm.danweiaddress.length; i++) {
        loc += CodeToText[this.dataForm.danweiaddress[i]];
      }
      return loc;
    },
    s06(e) {
      console.log(e);
      if (this.dataForm.s06.includes("76d")) {
        this.s06hav = true;
      } else {
        this.s06hav = false;
      }
    },

    init(danweiid, id) {
      console.log("init ", this.$data);

      Object.assign(this.$data, this.$options.data.call(this));
      var that = this;
      that.dataForm = that.dataForm1;
      this.tuputuList.length = 0;
      that.$forceUpdate();
      this.visible = true;
      if (id) {
        that
          .$http({
            url: `/gen/system/info/${id}`,
            method: "get",
          })
          .then(({ data }) => {
            if (data && data.code === 200) {
              this.$nextTick(() => {
                this.$refs.upload.clearFiles();
                this.$refs.tableForm.resetFields();
                that.dataForm.danweiid = danweiid;

                that.dataForm = JSON.parse(data.data.basejson);
                that.dataForm.id = id;
                that.tuputuList.push({
                  name: "1",
                  url: that.dataForm.tuoputu,
                });
                console.log("that.dataForm ", that.dataForm);
                that.$forceUpdate();
              });
            }
          });
      } else {
        this.$nextTick(() => {
          this.$refs.upload.clearFiles();
          this.$refs.tableForm.resetFields();
          that.dataForm.danweiid = danweiid;
          that.$forceUpdate();
        });
      }
    },
    changeBmMsgType(e) {
      var that = this;
      this.$nextTick(() => {
        for (
          var i = 0;
          i < that.bmMsgTypeList[that.dataForm.msgType].length;
          i++
        ) {
          if (that.bmMsgTypeList[that.dataForm.msgType][i].name == e) {
            that.dataForm.bmMsgType1 =
              that.bmMsgTypeList[that.dataForm.msgType][i].value;
          }
        }
      });
    },
    // 表单提交
    dataFormSubmit() {
      var that = this;
      console.log("that.dataForm", that.dataForm);
      this.$refs.tableForm.validate((valid) => {
        if (valid) {
          console.log("that.dataForm", that.dataForm);
          var formdata = new Object();
          formdata.danweiid = that.dataForm.danweiid;
          formdata.id = that.dataForm.id ? that.dataForm.id : "";
          formdata.system = that.dataForm.system;
          formdata.tuoputu = that.dataForm.tuoputu;

          var dagouparam = [];
          if (that.dataForm.s03 != "") {
            dagouparam.push(that.dataForm.s03);
          }
          if (that.dataForm.s041 != "") {
            dagouparam.push(that.dataForm.s041);
          }
          if (that.dataForm.s042 != "") {
            dagouparam.push(that.dataForm.s042);
          }
          if (that.dataForm.s051 != "") {
            dagouparam.push(that.dataForm.s051);
          }
          if (that.dataForm.s052 != "") {
            dagouparam.push(that.dataForm.s052);
          }
          if (that.dataForm.s06.length != 0) {
            dagouparam = dagouparam.concat(that.dataForm.s06);
          }
          for (var i = 0; i < that.dataForm.gjcpsyqkdata.length; i++) {
            if (that.dataForm.gjcpsyqkdata[i].checkissy != "") {
              dagouparam.push(that.dataForm.gjcpsyqkdata[i].checkissy);
            }
          }
          for (var i = 0; i < that.dataForm.fwqkdata.length; i++) {
            if (that.dataForm.fwqkdata[i].checkisok != "") {
              dagouparam.push(that.dataForm.fwqkdata[i].checkisok);
            }
            if (that.dataForm.fwqkdata[i].checkzrftype != "") {
              dagouparam.push(that.dataForm.fwqkdata[i].checkzrftype);
            }
          }
          if (that.dataForm.bmMsgType1 != "") {
            dagouparam.push(that.dataForm.bmMsgType1);
            dagouparam = dagouparam.concat(
              that.levelList[that.dataForm.bmMsgType1]
            );
          }
          if (that.dataForm.isfxt != "") {
            dagouparam.push(that.dataForm.isfxt);
          }
          if (that.dataForm.iszjps != "") {
            dagouparam.push(that.dataForm.iszjps);
          }
          if (that.dataForm.iszgbm != "") {
            dagouparam.push(that.dataForm.iszgbm);
          }
          if (that.dataForm.iszgbmsp != "") {
            dagouparam.push(that.dataForm.iszgbmsp);
          }
          if (that.dataForm.isxtdjbg != "") {
            dagouparam.push(that.dataForm.isxtdjbg);
          }
          if (that.dataForm.f01 != "") {
            dagouparam.push(that.dataForm.f01);
          }
          if (that.dataForm.f02 != "") {
            dagouparam.push(that.dataForm.f02);
          }
          if (that.dataForm.f03 != "") {
            dagouparam.push(that.dataForm.f03);
          }
          if (that.dataForm.f04 != "") {
            dagouparam.push(that.dataForm.f04);
          }
          if (that.dataForm.f05 != "") {
            dagouparam.push(that.dataForm.f05);
          }
          if (that.dataForm.f06 != "") {
            dagouparam.push(that.dataForm.f06);
          }
          if (that.dataForm.f07 != "") {
            dagouparam.push(that.dataForm.f07);
          }
          if (that.dataForm.f08 != "") {
            dagouparam.push(that.dataForm.f08);
          }
          console.log(dagouparam);
          if (that.dataForm.bmMsgType1 == "48c") {
            formdata.dengji = "1";
            formdata.jb1 = "一";
            formdata.jb2 = "一";
            formdata.jb3 = "一";
          } else if (that.dataForm.bmMsgType1 == "49c") {
            formdata.dengji = "2";
            formdata.jb1 = "二";
            formdata.jb2 = "二";
            formdata.jb3 = "二";
          } else if (that.dataForm.bmMsgType1 == "50c") {
            formdata.dengji = "3";
            formdata.jb1 = "三";
            formdata.jb2 = "三";
            formdata.jb3 = "三";
          } else if (that.dataForm.bmMsgType1 == "51c") {
            formdata.dengji = "4";
            formdata.jb1 = "四";
            formdata.jb2 = "四";
            formdata.jb3 = "四";
          } else if (that.dataForm.bmMsgType1 == "52c") {
            formdata.dengji = "5";
            formdata.jb1 = "五";
            formdata.jb2 = "五";
            formdata.jb3 = "五";
          }
          // 48c第 一 级 4949c 50c第 三 级 51c第四级 52c第五级
          var tihuanparam = {},
            tihuanparam1 = {};
          tihuanparam.system = that.dataForm.system;
          tihuanparam.yewugaishu = that.dataForm.yewugaishu;
          tihuanparam.tourudate = that.dataForm.tourudate;
          tihuanparam.system = that.dataForm.system;
          tihuanparam.qita4 = that.dataForm.qita4;
          tihuanparam.qita5 = that.dataForm.qita5;
          tihuanparam.qita6 = that.dataForm.qita6;
          tihuanparam.qita7 = that.dataForm.qita7;
          tihuanparam.qita8 = that.dataForm.qita8;
          tihuanparam.qita9 = that.dataForm.qita9;
          tihuanparam.qita10 = that.dataForm.qita10;
          tihuanparam.qita11 = that.dataForm.qita11;
          tihuanparam.kua1 = that.dataForm.kua1;
          tihuanparam.kua2 = that.dataForm.kua2;
          tihuanparam.cepingdanwei = that.dataForm.cepingdanwei;
          tihuanparam.shangjisystem =
            that.dataForm.isfxt == "21c" ? that.dataForm.shangjisystem : "";
          tihuanparam.shangjidanwei =
            that.dataForm.isfxt == "21c" ? that.dataForm.shangjidanwei : "";
          tihuanparam.dingjidate = that.dataForm.dingjidate;
          tihuanparam.tianbiaodate = that.dataForm.tianbiaodate;
          tihuanparam.tianbiaoname = that.dataForm.tianbiaoname;
          tihuanparam.zhuguanbumen =
            that.dataForm.iszgbm == "55c" ? that.dataForm.zhuguanbumen : "";
          tihuanparam.fujian1 =
            that.dataForm.f01 == "61c" ? that.dataForm.fujian1 : "";
          tihuanparam.fujian2 =
            that.dataForm.f02 == "63c" ? that.dataForm.fujian2 : "";
          tihuanparam.fujian3 =
            that.dataForm.f03 == "65c" ? that.dataForm.fujian3 : "";
          tihuanparam.fujian4 =
            that.dataForm.f04 == "67c" ? that.dataForm.fujian4 : "";
          tihuanparam.fujian5 =
            that.dataForm.f05 == "69c" ? that.dataForm.fujian5 : "";
          tihuanparam.fujian6 =
            that.dataForm.f06 == "71c" ? that.dataForm.fujian6 : "";
          tihuanparam.fujian7 =
            that.dataForm.f07 == "73c" ? that.dataForm.fujian7 : "";
          tihuanparam.fujian8 =
            that.dataForm.isxtdjbg == "59c" ? that.dataForm.fujian8 : "";
          tihuanparam.dengji = that.dataForm.dengji;
          for (var i = 0; i < that.dataForm.gjcpsyqkdata.length; i++) {
            var num = i + 1 + "n";
            var syl = i + 1 + "b";
            tihuanparam[num] = that.dataForm.gjcpsyqkdata[i].num;
            tihuanparam[syl] = that.dataForm.gjcpsyqkdata[i].syl;
          }

          if (that.dataForm.bmMsgType1 == "48c") {
            tihuanparam1.dengji = "1";
            tihuanparam1.jb1 = "一";
            tihuanparam1.jb2 = "一";
            tihuanparam1.jb3 = "一";
          } else if (that.dataForm.bmMsgType1 == "49c") {
            tihuanparam1.dengji = "2";
            tihuanparam1.jb1 = "二";
            tihuanparam1.jb2 = "二";
            tihuanparam1.jb3 = "二";
          } else if (that.dataForm.bmMsgType1 == "50c") {
            tihuanparam1.dengji = "3";
            tihuanparam1.jb1 = "三";
            tihuanparam1.jb2 = "三";
            tihuanparam1.jb3 = "三";
          } else if (that.dataForm.bmMsgType1 == "51c") {
            tihuanparam1.dengji = "4";
            tihuanparam1.jb1 = "四";
            tihuanparam1.jb2 = "四";
            tihuanparam1.jb3 = "四";
          } else if (that.dataForm.bmMsgType1 == "52c") {
            tihuanparam1.dengji = "5";
            tihuanparam1.jb1 = "五";
            tihuanparam1.jb2 = "五";
            tihuanparam1.jb3 = "五";
          }
          tihuanparam1.system = that.dataForm.system;
          tihuanparam1.tourudate = that.dataForm.tourudate;
          tihuanparam1.kaifadanwei = that.dataForm.kaifadanwei;
          tihuanparam1.yewugaishu = that.dataForm.yewugaishu;
          tihuanparam1.tuoputu = that.dataForm.tuoputu;
          tihuanparam1.tuoputumaioshu = that.dataForm.tuoputumaioshu;
          tihuanparam1.yewuimaioshu = that.dataForm.yewuimaioshu;
          tihuanparam1.xitongmiaoshu = that.dataForm.xitongmiaoshu;
          tihuanparam1.dengji = that.dataForm.dengji;
          formdata.dagouparam = JSON.stringify(dagouparam);
          formdata.tihuanparam = JSON.stringify(tihuanparam);
          formdata.tihuanparam1 = JSON.stringify(tihuanparam1);
          formdata.basejson = JSON.stringify(that.dataForm);
          console.log("formdata", formdata);
          console.log("that.dataForm.id", that.dataForm.id);
          that
            .$http({
              url: `/gen/system`,
              method: `${!that.dataForm.id || 0 ? "post" : "put"}`,
              data: formdata,
            })
            .then(({ data }) => {
              if (data && data.code === 200) {
                that.$message({
                  message: "操作成功",
                  type: "success",
                  duration: 1500,
                });
                that.visible = false;
                that.$emit("updateSystemList", this.dataForm.danweiid);
              }
            });
        }
      });
    },
  },
};
</script>
<style scope>
.line {
  width: 100%;
  height: 2px;
  background-color: #eee;
  margin-bottom: 22px;
}
.el-dialog__footer {
  text-align: center !important;
}
.el-dialog__footer button {
  width: 500px;
  height: 40px;
  font-size: 18px;
  font-weight: bold;
}
.el-form-item__label {
  font-weight: bold;
}
.el-select-dropdown__item.selected {
  font-weight: normal !important;
  color: #606266 !important;
}
</style>