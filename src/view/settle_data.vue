<template>
    <div v-loading="loading" class="body">
        <el-page-header @back="router_to('/main')" :content="header_content"></el-page-header>
        <el-form :inline="true" class="demo-form-inline" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择">
                    <el-option v-for="enumerate_year in enumerate_data_dict.year" :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名:">
                <el-input placeholder="请输入（支持模糊查询）" v-model="search_form.name" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:">
                <el-input placeholder="请输入" v-model="search_form.id_number" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-form-item label="人员类别:">
                <el-select v-model="search_form.person_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_person_type in enumerate_data_dict.person_type" :key="enumerate_person_type" :value="enumerate_person_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员属性:">
                <el-select v-model="search_form.attribute" multiple placeholder="请选择" clearable collapse-tags>
                  <el-option v-for='enumerate_attribute in enumerate_data_dict.attribute' :key="enumerate_attribute" :label="enumerate_attribute" :value="enumerate_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-collapse accordion>
            <el-collapse-item>
              <template slot="title">
                更多查询
              </template>
              <el-form-item label="乡镇:">
                <el-select v-model="search_form.town" placeholder="请选择" :disabled='town_disabled' :clearable='!town_disabled' :multiple='!town_disabled' :collapse-tags='!town_disabled' @change="update_village()">
                  <el-option v-for='enumerate_town in enumerate_data_dict.town' :key="enumerate_town" :label="enumerate_town" :value="enumerate_town"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="村居:">
                <el-select v-model="search_form.village" placeholder="请选择" clearable multiple collapse-tags>
                  <el-option v-for='enumerate_village in enumerate_data_dict.village' :key="enumerate_village" :label="enumerate_village" :value="enumerate_village"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="病种名称:">
                <el-input placeholder="请输入（支持模糊查询）" v-model="search_form.illness_name" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-form-item label="医疗类别:">
                <el-select v-model="search_form.cure_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_cure_type in enumerate_data_dict.cure_type" :key="enumerate_cure_type" :value="enumerate_cure_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="中心报销:">
                <el-select v-model="search_form.is_centre" placeholder="请选择"  clearable>
                  <el-option value="是"></el-option>
                  <el-option value="否"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医药机构地点:" style="width: 22%">
                <el-select v-model="search_form.hospital_place" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_hospital_place in enumerate_data_dict.hospital_place" :key="enumerate_hospital_place" :value="enumerate_hospital_place"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医药机构名称:" style="width: 22%">
                <el-input placeholder="请输入（支持模糊查询）" v-model="search_form.hospital_name" clearable @keyup.enter.native="search('list', 1)"  @change="update_local_hospital_id()"></el-input>
            </el-form-item>
            <el-form-item label="就诊凭证类型:" style="width: 22%">
                <el-select v-model="search_form.evidence_type" placeholder="请选择" clearable>
                    <el-option v-for="enumerate_evidence_type in enumerate_data_dict.evidence_type" :key="enumerate_evidence_type" :value="enumerate_evidence_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否冲销:" style="width: 22%">
                <el-select v-model="search_form.is_refund" placeholder="请选择"  clearable>
                  <el-option value="是"></el-option>
                  <el-option value="否"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="本地医疗机构:" style="width: 22%">
                <el-cascader
                 v-model="search_form.local_hospital_id"
                :options="local_hospital_list"
                :props="props"
                collapse-tags
                 @change="update_hospital_name()"
                clearable></el-cascader>
            </el-form-item>
            <el-form-item label="结算日期:" style="width: 28%">
                <el-date-picker
                  v-model="search_form.settle_date"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="金额筛选:" style="margin-right: 0">
                <el-select v-model="search_form.pay_type" placeholder="请选择" clearable>
                    <el-option v-for='enumerate_pay_type_label in enumerate_data_dict.pay_type_label' :key="enumerate_pay_type_label" :label="enumerate_pay_type_label" :value="enumerate_data_dict.pay_type_dict[enumerate_pay_type_label]"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="width: 7%;margin-right: 0">
                <el-select v-model="search_form.pay_type_operator" placeholder="请选择" clearable>
                    <el-option v-for='enumerate_pay_type_operator_label in enumerate_data_dict.pay_type_operator_label' :key="enumerate_pay_type_operator_label" :label="enumerate_pay_type_operator_label" :value="enumerate_data_dict.pay_type_operator_dict[enumerate_pay_type_operator_label]"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入内容" v-model="search_form.pay_type_value" clearable @keyup.enter.native="search('list', 1)"><template slot="append">元</template></el-input>
            </el-form-item>
            <el-form-item label="医疗类别快速筛选:">
                  <el-checkbox-group v-model="search_form.cure_type_gather" @change="update_cure_type()">
                    <el-checkbox-button v-for="enumerate_cure_type_gather in enumerate_data_dict.cure_type_gather" :label="enumerate_cure_type_gather" :key="enumerate_cure_type_gather">{{enumerate_cure_type_gather}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
            <el-form-item label="人员属性快速筛选:">
                  <el-checkbox-group v-model="search_form.attribute_gather" @change="update_attribute()">
                    <el-checkbox-button v-for="enumerate_attribute_gather in enumerate_data_dict.attribute_gather" :label="enumerate_attribute_gather" :key="enumerate_attribute_gather">{{enumerate_attribute_gather}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
            <el-form-item label="医共体:">
                  <el-checkbox-group v-model="search_form.hospital_community" @change="update_town()">
                    <el-checkbox-button v-for="enumerate_hospital_community in enumerate_data_dict.hospital_community" :label="enumerate_hospital_community" :key="enumerate_hospital_community">{{enumerate_hospital_community}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
                </el-collapse-item>
          </el-collapse>
          <div class="button">
            <el-form-item>
                <el-button type="primary" @click="search('list', 1)" icon="el-icon-search">明细查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="search('statistic')" icon="el-icon-search">统计查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" @click="search('merge')" icon="el-icon-search">人员账目合并查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" round icon="el-icon-refresh" @click='reset()'>重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" icon="el-icon-download" circle @click='download()'></el-button>
            </el-form-item>
          </div>
        </el-form>
        <div v-if='show_type=="statistic"'>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>人次</span>
            </div>
                <span>{{data.data.time_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>人数</span>
            </div>
                <span>{{data.data.number_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>总费用（元）</span>
            </div>
                <span>{{data.data.all_expense}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>范围内费用（元）</span>
            </div>
                <span>{{data.data.inner_expense}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>统筹基金支出（元）</span>
            </div>
                <span>{{data.data.overall_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>大额医疗支出（元）</span>
            </div>
                <span>{{data.data.large_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>大病保险支出（元）</span>
            </div>
                <span>{{data.data.big_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>医疗救助支出（元）</span>
            </div>
                <span>{{data.data.rescue_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>公务员医疗补助（元）</span>
            </div>
                <span>{{data.data.civil_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>其他基金支付（元）</span>
            </div>
                <span>{{data.data.other_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>基金支付总额（元）</span>
            </div>
                <span>{{data.data.all_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>个人现金支付（元）</span>
            </div>
                <span>{{data.data.cash_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>个人账户支付（元）</span>
            </div>
                <span>{{data.data.account_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>账户共济支付金额（元）</span>
            </div>
                <span>{{data.data.together_pay}}</span>
            </el-card>
        </div>
        <div v-if='show_type=="list"||show_type=="merge"' class="table">
            <el-table :data="data.data" stripe border height="100%" style="width: 100%">
                <el-table-column label="序号" width="75" prop="number" header-align="center" align="center"></el-table-column>
                <el-table-column label="姓名" width="150" prop="name" header-align="center" align="center"></el-table-column>
                <el-table-column label="身份证号" width="175" prop="id_number" header-align="center" align="center"></el-table-column>
                <el-table-column label="笔数" width="75" prop="data_count" header-align="center" align="center" v-if="show_type=='merge'"></el-table-column>
                <el-table-column label="人员类别" width="100" prop="person_type" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="医药机构地点类别" width="150" prop="hospital_place" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="定点医药机构编号" width="150" prop="hospital_id" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="定点医药机构名称" width="500" prop="hospital_name" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="医院等级" width="100" prop="hospital_level" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="开始日期" width="175" prop="start_date" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="结束日期" width="175" prop="end_date" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="结算日期" width="175" prop="settle_date" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="就诊凭证类型" width="125" prop="evidence_type" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="总费用" width="100" prop="all_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="全自费金额" width="100" prop="self_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="超限价自费费用" width="150" prop="over_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="先行自付金额" width="150" prop="first_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="范围内费用" width="100" prop="inner_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="起付线" width="100" prop="start_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="统筹基金支出" width="150" prop="overall_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="大额医疗支出金额" width="150" prop="large_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="大病保险支出" width="150" prop="big_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="医疗救助支出" width="150" prop="rescue_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="公务员医疗补助" width="150" prop="civil_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="其他基金支付" width="150" prop="other_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="基金支付总额" width="150" prop="all_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="个人现金支付" width="150" prop="cash_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="个人账户支付" width="150" prop="account_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="账户共济支付金额" width="150" prop="together_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="病种编号" width="125" prop="illness_number" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="病种名称" width="350" prop="illness_name" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>                
                <el-table-column label="医疗类别" width="200" prop="cure_type" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="统筹基金支付比例" width="150" prop="overall_percent" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="中心报销" width="125" prop="is_centre" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="经办人员" width="200" prop="operator" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="入院科室" width="250" prop="in_department" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="出院科室" width="250" prop="out_department" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="入院床位" width="125" prop="in_bed" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="病区床位" width="125" prop="illness_bed" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="出院床位" width="125" prop="out_bed" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="入院诊断" width="200" prop="in_diagnose" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="主诊医师代码" width="150" prop="doctor_id" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="主诊医师" width="150" prop="doctor_name" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="住院主诊断代码" width="125" prop="out_diagnose_id" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="住院主诊断" width="200" prop="out_diagnose" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="住院号" width="200" prop="in_id" header-align="center" align="center" v-if="show_type=='list'"></el-table-column>
                <el-table-column label="人员属性" width="400" prop="attribute" header-align="center" align="center"></el-table-column>
                <el-table-column label="乡镇" width="100" prop="town" header-align="center" align="center"></el-table-column>
                <el-table-column label="村居" width="125" prop="village" header-align="center" align="center"></el-table-column>
                <el-table-column label="备注" width="350" prop="remark" header-align="center" align="center"></el-table-column>
                <el-table-column label="手机号" width="350" header-align="center" align="center" prop="phone_number"></el-table-column>
                <el-table-column label="是否使用账户" width="125" prop="is_use_account" header-align="center" align="center"></el-table-column>
                <el-table-column label="是否中途结算" width="125" prop="is_mid_settle" header-align="center" align="center"></el-table-column>
                <el-table-column label="是否有效" width="100" prop="is_valid" header-align="center" align="center"></el-table-column>
                <el-table-column label="是否冲销" width="100" prop="is_refund" header-align="center" align="center"></el-table-column>
                <el-table-column label="跨年冲销" width="100" prop="overyear_refund" header-align="center" align="center"></el-table-column>
            </el-table>
            <el-pagination
            background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="limit_list"
          :page-size.sync="search_form.limit"
          :total='data.data_count'
          :current-page.sync='search_form.page'
          @size-change="search('list', search_form.page)"
          @current-change="search('list', search_form.page)">
            </el-pagination>
        </div>
    </div>
</template>

<style scoped>
.el-form-item {
  margin-right: 2%;
}
.button {
  margin-top: 1%;
}
.el-card {
        width: 14%;
        text-align: center;
        display: inline-block;
        margin: 1%;
    }
.el-form {
  margin: 1% 0;
}
.body {
  height: 100%;
}
.table {
  width: 100%;
  height: 62%;
}
.el-pagination {
  margin-top: 1%;
}
</style>
    
<script>
import {authentication, update_town, update_village, reset, search, download, update_attribute, update_cure_type} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            'name': '', 
            'id_number': '', 
            "person_type": [], 
            "hospital_place": [], 
            "is_centre": '', 
            "illness_name": '', 
            "evidence_type": [], 
            "cure_type": [], 
            "settle_date": [], 
            "attribute": [], 
            "town": [], 
            "village": [], 
            'hospital_community': [], 
            'pay_type': '', 
            'pay_type_operator': '', 
            'pay_type_value': '', 
            'page': 0, 
            'cure_type_gather': [], 
            'attribute_gather': [],
            'hospital_name': '',
            'hospital_id': [],
            'local_hospital_id': [],  
            'is_refund': '否', 
            'overyear_refund': '', 
            'is_use_account': '', 
            'is_mid_settle': '', 
            'is_valid': '是', 
            'limit': 10, 
          }, 
          default_search_form: {}, 
          data: {}, 
          enumerate_data_dict: {}, 
          user_data: {}, 
          props: { multiple: true },
          local_hospital_list: [], 
          loading: false, 
          show_type: 'list', 
          authority: 'settle_data', 
          clean_request_field_list: ['attribute', 'local_hospital'], 
          limit_list: [10, 20, 50, 100], 
          town_disabled: false, 
          'header_content': `结算数据查询（更新至${JSON.parse(localStorage.getItem('notify_data'))['settle_date']}）`, 
        }
      }, 
      created () {
        authentication(this, 'attribute_dict|default_year|town_village_dict|year|town|village|attribute_gather|hospital_community|hospital_community_dict|attribute_gather_dict|person_type|cure_type|hospital_place|cure_type_gather|pay_type_label|pay_type_operator_label|pay_type_dict|pay_type_operator_dict|cure_type_dict|overyear_refund|hospital_name_id_dict|local_hospital_dict|evidence_type', false, ['town', 'attribute', 'local_hospital'])
      }, 
      methods: {
        update_hospital_name: function(){
            this.search_form.hospital_name = ''
        }, 
        update_local_hospital_id: function() {
            this.search_form.local_hospital_id = []
        }, 
        search: function(show_type, page=0) {
          this.search_form.page = page
          search(this, `settle_data/${show_type}`, show_type)
        }, 
        download: function() {
          download(this, `settle_data/${this.show_type}/download`)
        },  
        router_to: function(url) {
          this.$router.push(url)
        }, 
        update_town: function() {
          update_town(this)
        }, 
        update_village: function() {
          update_village(this)
        }, 
        reset: function() {
          reset(this)
        }, 
        update_cure_type: function() {
            update_cure_type(this)
        }, 
        update_attribute: function() {
          update_attribute(this)
        }, 
        update_refund: function() {
            if (this.search_form.overyear_refund) {
                this.search_form.is_refund = '是'
            }
            else {
                this.search_form.is_refund = '否'
            }
        }, 
      }
}
</script>
