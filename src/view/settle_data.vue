<template>
    <div v-loading="loading">
        <el-page-header @back="router_to('/main')" content="结算数据统计"></el-page-header>
        <el-form :inline="true" class="demo-form-inline" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择" @change="update_date()">
                    <el-option v-for="enumerate_year in enumerate_data_dict.year" :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名:">
                <el-input placeholder="姓名" v-model="search_form.name" clearable prefix-icon="el-icon-search"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:">
                <el-input placeholder="身份证号" v-model="search_form.id_number" clearable prefix-icon="el-icon-search"></el-input>
            </el-form-item>
            <el-form-item label="人员类别:">
                <el-select v-model="search_form.person_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_person_type in enumerate_data_dict.person_type" :key="enumerate_person_type" :value="enumerate_person_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医药机构地点:">
                <el-select v-model="search_form.hospital_place" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_hospital_place in enumerate_data_dict.hospital_place" :key="enumerate_hospital_place" :value="enumerate_hospital_place"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医院等级:">
                <el-select v-model="search_form.hospital_level" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_hospital_level in enumerate_data_dict.hospital_level" :key="enumerate_hospital_level" :value="enumerate_hospital_level"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="就诊凭证类型:">
                <el-select v-model="search_form.evidence_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_evidence_type in enumerate_data_dict.evidence_type" :key="enumerate_evidence_type" :value="enumerate_evidence_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医疗类别:">
                <el-select v-model="search_form.cure_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_cure_type in enumerate_data_dict.cure_type" :key="enumerate_cure_type" :value="enumerate_cure_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                  <el-checkbox-group v-model="search_form.cure_type_gather" @change="update_cure_type()">
                    <el-checkbox-button v-for="enumerate_cure_type_gather in enumerate_data_dict.cure_type_gather" :label="enumerate_cure_type_gather" :key="enumerate_cure_type_gather">{{enumerate_cure_type_gather}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
            <el-form-item label="中心报销:">
                <el-select v-model="search_form.is_centre" placeholder="请选择"  clearable>
                  <el-option label="是" value=1></el-option>
                  <el-option label="否" value=0></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员属性:">
                <el-select v-model="search_form.attribute" multiple placeholder="请选择" clearable collapse-tags>
                  <el-option v-for='enumerate_attribute in enumerate_data_dict.attribute' :key="enumerate_attribute" :label="enumerate_attribute" :value="enumerate_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                  <el-checkbox-group v-model="search_form.attribute_gather" @change="update_attribute()">
                    <el-checkbox-button v-for="enumerate_attribute_gather in enumerate_data_dict.attribute_gather" :label="enumerate_attribute_gather" :key="enumerate_attribute_gather">{{enumerate_attribute_gather}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
            <el-form-item label="结算日期开始:">
                <el-select v-model="search_form.date_start" placeholder="请选择" clearable>
                    <el-option v-for="enumerate_settle_date in enumerate_data_dict.settle_date" :key="enumerate_settle_date" :value="enumerate_settle_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算日期结束:">
                <el-select v-model="search_form.date_end" placeholder="请选择" clearable>
                    <el-option v-for="enumerate_settle_date in enumerate_data_dict.settle_date" :key="enumerate_settle_date" :value="enumerate_settle_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医共体:">
                  <el-checkbox-group v-model="search_form.hospital_community" @change="update_town()">
                    <el-checkbox-button v-for="enumerate_hospital_community in enumerate_data_dict.hospital_community" :label="enumerate_hospital_community" :key="enumerate_hospital_community">{{enumerate_hospital_community}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
            <el-form-item label="乡镇:">
                <el-select v-model="search_form.town" placeholder="请选择" clearable multiple @change="update_village()" collapse-tags>
                  <el-option v-for='enumerate_town in enumerate_data_dict.town' :key="enumerate_town" :label="enumerate_town" :value="enumerate_town"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="村:">
                <el-select v-model="search_form.village" placeholder="请选择" clearable multiple collapse-tags>
                  <el-option v-for='enumerate_village in enumerate_data_dict.village' :key="enumerate_village" :label="enumerate_village" :value="enumerate_village"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支出不为０:">
                <el-select v-model="search_form.pay_exists" multiple placeholder="请选择" clearable collapse-tags>
                  <el-option v-for='enumerate_pay_exists in enumerate_data_dict.pay_exists' :key="enumerate_pay_exists" :label="enumerate_pay_exists" :value="enumerate_pay_exists"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="list_search(1)" icon="el-icon-search">明细查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="statistic_search()" icon="el-icon-search">汇总查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" round icon="el-icon-refresh" @click='reset()'>重置</el-button>
            </el-form-item>
            <el-button type="warning" icon="el-icon-download" circle @click='download()'></el-button>
        </el-form>
        <div v-if='!is_list'>
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
        <div v-if='is_list'>
            <el-table :data="data.data">
                <el-table-column label="序号" width="75" prop="number" header-align="center" align="center"></el-table-column>
                <el-table-column label="姓名" width="150" prop="name" header-align="center" align="center"></el-table-column>
                <el-table-column label="身份证号" width="175" prop="id_number" header-align="center" align="center"></el-table-column>
                <el-table-column label="人员类别" width="50" prop="person_type" header-align="center" align="center"></el-table-column>
                <el-table-column label="人员属性" width="350" prop="attribute" header-align="center" align="center"></el-table-column>
                <el-table-column label="医药机构地点类别" width="125" prop="hospital_place" header-align="center" align="center"></el-table-column>
                <el-table-column label="定点医药机构编号" width="150" prop="hospital_id" header-align="center" align="center"></el-table-column>
                <el-table-column label="定点医药机构名称" width="500" prop="hospital_name" header-align="center" align="center"></el-table-column>
                <el-table-column label="医院等级" width="100" prop="hospital_level" header-align="center" align="center"></el-table-column>
                <el-table-column label="中心报销" width="125" prop="is_centre" header-align="center" align="center"></el-table-column>
                <el-table-column label="开始日期" width="175" prop="start_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="结束日期" width="175" prop="end_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="结算日期" width="175" prop="settle_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="就诊凭证类型" width="125" prop="evidence_type" header-align="center" align="center"></el-table-column>
                <el-table-column label="总费用" width="100" prop="all_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="全自费金额" width="100" prop="self_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="超限价自费费用" width="100" prop="over_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="先行自付金额" width="100" prop="first_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="范围内费用" width="100" prop="inner_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="起付线" width="100" prop="start_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="统筹基金支出" width="100" prop="overall_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="大额医疗支出金额" width="100" prop="large_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="大病保险支出" width="100" prop="big_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="医疗救助支出" width="100" prop="rescue_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="公务员医疗补助" width="100" prop="civil_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="其他基金支付" width="100" prop="other_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="基金支付总额" width="100" prop="all_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="个人现金支付" width="100" prop="cash_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="个人账户支付" width="100" prop="account_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="账户共济支付金额" width="100" prop="together_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="病种名称" width="350" prop="illness_name" header-align="center" align="center"></el-table-column>
                <el-table-column label="医疗类别" width="200" prop="cure_type" header-align="center" align="center"></el-table-column>
                <el-table-column label="乡镇" width="75" prop="town" header-align="center" align="center"></el-table-column>
                <el-table-column label="村" width="125" prop="village" header-align="center" align="center"></el-table-column>
            </el-table>
            <el-pagination
            background
            layout="total, prev, pager, next"
            :total='data.data_count'
            :current-page.sync='search_form.page'
            @current-change='list_search(search_form.page)'>
            </el-pagination>
        </div>
    </div>
</template>

<style scoped>
    .el-card {
        width: 14%;
        text-align: center;
        display: inline-block;
        margin: 1%;
    }
    .el-form {
        margin: 1% 0;
        }
    .el-table {
        margin: 0 1% 1% 1%;
        }
</style>
    
<script>
import {authentication, update_date, update_town, update_village, reset, search, download, update_attribute} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            "year": [], 
            'name': [], 
            'id_number': [], 
            "person_type": [], 
            "hospital_place": [], 
            "is_centre": [], 
            "hospital_level": [], 
            "evidence_type": [], 
            "cure_type": [], 
            "date_start": '', 
            "date_end": '', 
            "attribute": [], 
            "town": [], 
            "village": [], 
            'hospital_community': [], 
            'pay_exists': [], 
            'page': 1, 
            'cure_type_gather': [], 
            'attribute_gather': [],
          }, 
          data: {}, 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          is_list: true, 
          town_disabled: false, 
          default_town: [], 
          default_village: [], 
          authority: 'settle_data', 
          date_type: 'settle_date', 
        }
      }, 
      created () {
        authentication(this)
      }, 
      methods: {
        list_search: function(page) {
          this.is_list = true
          this.search_form.page = page
          search(this, 'settle_data/list')
        },
        statistic_search: function() {
          this.is_list = false
          search(this, 'settle_data/statistic')
        }, 
        download: function() {
          var router = 'settle_data/list'
          if (!this.is_list) {
            router = 'insured_data/statistic'
          }
          download(this, router)
        },  
        update_date: function() {
          update_date(this)
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
      }
}
</script>
