<template>
    <div v-loading="loading">
      <el-page-header @back="router_to('/main')" content="参保数据明细"></el-page-header>
        <el-form :inline="true" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择"  @change="update_date()">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名:">
                <el-input placeholder="姓名" v-model="search_form.name" clearable prefix-icon="el-icon-search" ></el-input>
            </el-form-item>
            <el-form-item label="身份证号:" class='id_number_form'>
                <el-input placeholder="身份证号" v-model="search_form.id_number" clearable prefix-icon="el-icon-search" ></el-input>
            </el-form-item>
            <el-form-item label="参保情况:">
                <el-select v-model="search_form.insured_state" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_insured_state in enumerate_data_dict.insured_state' :key="enumerate_insured_state" :value="enumerate_insured_state"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参加公务员医疗补助:">
                <el-select v-model="search_form.is_civil" placeholder="请选择"  clearable>
                  <el-option label="是" value=1></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员属性:">
                <el-select v-model="search_form.attribute" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_attribute in enumerate_data_dict.attribute' :key="enumerate_attribute" :value="enumerate_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                  <el-checkbox-group v-model="search_form.attribute_gather" @change="update_attribute()">
                    <el-checkbox-button v-for="enumerate_attribute_gather in enumerate_data_dict.attribute_gather" :label="enumerate_attribute_gather" :key="enumerate_attribute_gather">{{enumerate_attribute_gather}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
            <el-form-item label="支付日期开始:">
                <el-select v-model="search_form.date_start" placeholder="请选择"  clearable>
                    <el-option v-for="enumerate_pay_date in enumerate_data_dict.pay_date" :key="enumerate_pay_date" :value="enumerate_pay_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支付日期结束:">
                <el-select v-model="search_form.date_end" placeholder="请选择"  clearable>
                    <el-option v-for="enumerate_pay_date in enumerate_data_dict.pay_date" :key="enumerate_pay_date" :value="enumerate_pay_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医共体:" v-if='!town_disabled'>
                  <el-checkbox-group v-model="search_form.hospital_community" size="medium" @change="update_town()">
                    <el-checkbox-button v-for="enumerate_hospital_community in enumerate_data_dict.hospital_community" :label="enumerate_hospital_community" :key="enumerate_hospital_community">{{enumerate_hospital_community}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
            <el-form-item label="乡镇:">
                <el-select v-model="search_form.town" placeholder="请选择" :disabled='town_disabled' :clearable='!town_disabled' :multiple='!town_disabled' :collapse-tags='!town_disabled' @change="update_village()">
                  <el-option v-for='enumerate_town in enumerate_data_dict.town' :key="enumerate_town" :value="enumerate_town"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="村:">
                <el-select v-model="search_form.village" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_village in enumerate_data_dict.village' :key="enumerate_village" :value="enumerate_village"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="list_search(1)" icon="el-icon-search">明细查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="statistic_search()" icon="el-icon-search">汇总查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="reset()" round icon="el-icon-refresh">重置</el-button>
            </el-form-item>
            <el-button type="warning" icon="el-icon-download" circle @click='download()'></el-button>
        </el-form>
        <div v-if='!is_list'>
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
        <div v-if='is_list'>
          <el-table :data="data.data">
          <el-table-column label="序号" width="100" prop="number" header-align="center" align="center"></el-table-column>
          <el-table-column label="姓名" width="100" prop="name" header-align="center" align="center"></el-table-column>
          <el-table-column label="身份证号" width="200" prop="id_number" header-align="center" align="center"></el-table-column>
          <el-table-column label="参保情况" width="125" header-align="center" align="center" prop="insured_state"></el-table-column>
          <el-table-column label="人员属性" width="350" header-align="center" align="center" prop="attribute"></el-table-column>
          <el-table-column label="乡镇" width="75" prop="town" header-align="center" align="center"></el-table-column>
          <el-table-column label="村" width="125" prop="village" header-align="center" align="center"></el-table-column>
          <el-table-column label="手机号" width="125" header-align="center" align="center" prop="phone_number"></el-table-column>
          <el-table-column label="自付金额" width="100" prop="own_expense" header-align="center" align="center"></el-table-column>
          <el-table-column label="支付日期" width="175" prop="pay_date" header-align="center" align="center"></el-table-column>
          <el-table-column label="是否参加公务员医疗补助" width="175" prop="is_civil" header-align="center" align="center"></el-table-column>
          <el-table-column label="备注" width="300" prop="remark" header-align="center" align="center"></el-table-column>
        </el-table>
        </div>
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total='data.data_count'
          :current-page.sync='search_form.page'
          @current-change='list_search(search_form.page)'>
        </el-pagination>
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
            "year": '', 
            'name': [], 
            "id_number": [], 
            "insured_state": [], 
            "attribute": [], 
            'date_start': '', 
            'date_end': '', 
            "town": [], 
            "village": [], 
            "is_civil": [], 
            'page': 1, 
            'hospital_community': [], 
            'attribute_gather': [], 
          }, 
          data: {}, 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          town_disabled: false, 
          is_list: true, 
          default_town: [], 
          default_village: [], 
          authority: 'insured_data', 
          date_type: 'pay_date', 
        }
      }, 
      created () {
        authentication(this)
      }, 
      methods: {
        list_search: function(page) {
          this.is_list = true
          this.search_form.page = page
          search(this, 'insured_data/list')
        },
        statistic_search: function() {
          this.is_list = false
          search(this, 'insured_data/statistic')
        }, 
        download: function() {
          var router = 'insured_data/list'
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
        update_attribute: function() {
          update_attribute(this)
        }, 
      }
    }
</script>
