<template>
    <div v-loading="loading" class="body">
      <el-page-header @back="router_to('/main')" content="参保数据查询"></el-page-header>
        <el-form :inline="true" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名:">
                <el-input placeholder="请输入（支持模糊查询）" v-model="search_form.name" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:" class='id_number_form'>
                <el-input placeholder="请输入" v-model="search_form.id_number" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-form-item label="参保情况:">
                <el-select v-model="search_form.insured_state" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_insured_state in enumerate_data_dict.insured_state' :key="enumerate_insured_state" :value="enumerate_insured_state"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员属性:">
                <el-select v-model="search_form.attribute" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_attribute in enumerate_data_dict.attribute' :key="enumerate_attribute" :value="enumerate_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-collapse accordion>
            <el-collapse-item>
              <template slot="title">
                更多查询
              </template>
            <el-form-item label="乡镇:">
                <el-select v-model="search_form.town" placeholder="请选择" :disabled='town_disabled' :clearable='!town_disabled' :multiple='!town_disabled' :collapse-tags='!town_disabled' @change="update_village()">
                  <el-option v-for='enumerate_town in enumerate_data_dict.town' :key="enumerate_town" :value="enumerate_town"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="村居:">
                <el-select v-model="search_form.village" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_village in enumerate_data_dict.village' :key="enumerate_village" :value="enumerate_village"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="家庭户号:">
                <el-input placeholder="请输入" v-model="search_form.family_number" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-form-item label="个人自付:" style="margin-right: 0">
            </el-form-item>
            <el-form-item style="width: 7%;margin-right: 0">
                <el-select v-model="search_form.pay_type_operator" placeholder="请选择" clearable>
                    <el-option v-for='enumerate_pay_type_operator_label in enumerate_data_dict.pay_type_operator_label' :key="enumerate_pay_type_operator_label" :label="enumerate_pay_type_operator_label" :value="enumerate_data_dict.pay_type_operator_dict[enumerate_pay_type_operator_label]"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input placeholder="请输入" v-model="search_form.own_expense" clearable @keyup.enter.native="search('list', 1)"><template slot="append">元</template></el-input>
            </el-form-item>
            <el-form-item label="缴费日期:">
                <el-date-picker
                  v-model="search_form.pay_date"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="出生日期:">
              <el-date-picker
                    v-model="search_form.birthday"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="参加公务员医疗补助:">
                <el-select v-model="search_form.is_civil" placeholder="请选择"  clearable>
                  <el-option value="是"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="共济账户支付:">
                <el-select v-model="search_form.is_account_pay" placeholder="请选择"  clearable>
                  <el-option value="是"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="性别:">
                <el-select v-model="search_form.sex" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_sex in enumerate_data_dict.sex' :key="enumerate_sex" :value="enumerate_sex"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员属性快速筛选:">
                  <el-checkbox-group v-model="search_form.attribute_gather" @change="update_attribute()">
                    <el-checkbox-button v-for="enumerate_attribute_gather in enumerate_data_dict.attribute_gather" :label="enumerate_attribute_gather" :key="enumerate_attribute_gather">{{enumerate_attribute_gather}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
            <el-form-item label="医共体:" v-if='!town_disabled'>
                  <el-checkbox-group v-model="search_form.hospital_community" size="medium" @change="update_town()">
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
                <el-button type="info" @click="reset()" round icon="el-icon-refresh">重置</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" icon="el-icon-download" circle @click='download()'></el-button>
            </el-form-item>
          </div>

        </el-form>
        <div v-if='show_type=="statistic"'>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>总（人）</span>
            </div>
                <span>{{data.data.all_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>参加居民医保（人）</span>
            </div>
                <span>{{data.data.insured_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>未参加居民医保（人）</span>
            </div>
                <span>{{data.data.not_insured_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>享受参保资助（人）</span>
            </div>
                <span>{{data.data.perk_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>自付金额（元）</span>
            </div>
                <span>{{data.data.own_expense}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>资助金额（元）</span>
            </div>
                <span>{{data.data.perk}}</span>
            </el-card>
        </div>
        <div v-if='show_type=="list"' class="table">
          <el-table :data="data.data" stripe border height="100%" style="width: 100%">
          <el-table-column label="序号" width="100" prop="number" header-align="center" align="center"></el-table-column>
          <el-table-column label="姓名" width="100" prop="name" header-align="center" align="center"></el-table-column>
          <el-table-column label="身份证号" width="200" prop="id_number" header-align="center" align="center"></el-table-column>
          <el-table-column label="性别" width="125" prop="sex" header-align="center" align="center"></el-table-column>
          <el-table-column label="家庭户号" width="200" prop="family_number" header-align="center" align="center"></el-table-column>
          <el-table-column label="参保情况" width="125" header-align="center" align="center" prop="insured_state"></el-table-column>
          <el-table-column label="人员属性" width="350" header-align="center" align="center" prop="attribute"></el-table-column>
          <el-table-column label="乡镇" width="100" prop="town" header-align="center" align="center"></el-table-column>
          <el-table-column label="村居" width="125" prop="village" header-align="center" align="center"></el-table-column>
          <el-table-column label="自付金额" width="100" prop="own_expense" header-align="center" align="center"></el-table-column>
          <el-table-column label="支付日期" width="175" prop="pay_date" header-align="center" align="center"></el-table-column>
          <el-table-column label="参加公务员医疗补助" width="175" prop="is_civil" header-align="center" align="center"></el-table-column>
          <el-table-column label="共济账户支付" width="150" prop="is_account_pay" header-align="center" align="center"></el-table-column>
          <el-table-column label="备注" width="350" prop="remark" header-align="center" align="center"></el-table-column>
          <el-table-column label="手机号" width="200" header-align="center" align="center" prop="phone_number"></el-table-column>
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
import {authentication, update_town, update_village, reset, search, download, update_attribute} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            'name': '', 
            "id_number": '',
            'own_expense': '',  
            "insured_state": [], 
            "attribute": [], 
            'pay_date': [], 
            "town": [], 
            "village": [], 
            "is_civil": '', 
            "is_account_pay": '', 
            'sex': [], 
            'page': 0, 
            'hospital_community': [], 
            'attribute_gather': [], 
            'family_number': '', 
            'pay_type_operator': '', 
            'birthday': [], 
            'limit': 10, 
          }, 
          default_search_form: {}, 
          data: {}, 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          town_disabled: false, 
          show_type: 'list', 
          authority: 'insured_data', 
          clean_request_field_list: ['attribute'], 
          limit_list: [10, 20, 50, 100],  
        }
      }, 
      created () {
        authentication(this, 'attribute_dict|insured_state|default_year|town_village_dict|year|town|village|attribute_gather|hospital_community|hospital_community_dict|attribute_gather_dict|pay_type_operator_dict|pay_type_operator_label|sex', false, ['town', 'attribute'])
      }, 
      methods: {
        search: function(show_type, page=0) {
          this.search_form.page = page
          search(this, `insured_data/${show_type}`, show_type)
        }, 
        download: function() {
          download(this, `insured_data/${this.show_type}/download`)
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
        update_attribute: function() {
          update_attribute(this)
        }, 
      }
    }
</script>
