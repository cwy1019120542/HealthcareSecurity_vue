<template>
    <div v-loading="loading" class="body">
      <el-page-header @back="router_to('/main')" :content="header_content"></el-page-header>
        <el-form :inline="true" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择" @change="update_compare_year()">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算日期:">
                <el-date-picker
                  v-model="search_form.year_settle_date"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="对比年份:">
                <el-select v-model="search_form.compare_year" placeholder="请选择">
                  <el-option v-for='enumerate_compare_year in enumerate_data_dict.compare_year' :key="enumerate_compare_year" :value="enumerate_compare_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="对比年份结算日期:">
                <el-date-picker
                  v-model="search_form.compare_year_settle_date"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-collapse accordion>
            <el-collapse-item>
              <template slot="title">
                更多查询
              </template>
            <el-form-item label="人员类别:">
                <el-select v-model="search_form.person_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_person_type in enumerate_data_dict.person_type" :key="enumerate_person_type" :value="enumerate_person_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医疗类别:">
                <el-select v-model="search_form.cure_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_cure_type in enumerate_data_dict.cure_type" :key="enumerate_cure_type" :value="enumerate_cure_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医药机构地点:">
                <el-select v-model="search_form.hospital_place" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_hospital_place in enumerate_data_dict.hospital_place" :key="enumerate_hospital_place" :value="enumerate_hospital_place"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医药机构名称:">
                <el-input placeholder="请输入（支持模糊查询）" v-model="search_form.hospital_name" clearable @keyup.enter.native="search('list', 1)"  @change="update_local_hospital_id()"></el-input>
            </el-form-item>
            <el-form-item label="本地医疗机构:">
                <el-cascader
                 v-model="search_form.local_hospital_id"
                :options="local_hospital_list"
                :props="props"
                collapse-tags
                 @change="update_hospital_name()"
                clearable></el-cascader>
            </el-form-item>
            <el-form-item label="医疗类别快速筛选:">
                  <el-checkbox-group v-model="search_form.cure_type_gather" @change="update_cure_type()">
                    <el-checkbox-button v-for="enumerate_cure_type_gather in enumerate_data_dict.cure_type_gather" :label="enumerate_cure_type_gather" :key="enumerate_cure_type_gather">{{enumerate_cure_type_gather}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
            </el-collapse-item>
          </el-collapse>
          <div class="button">
            <el-form-item>
                <el-button type="primary" @click="search()" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="reset()" round icon="el-icon-refresh">重置</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" icon="el-icon-download" circle @click='download()'></el-button>
            </el-form-item>
          </div>            
        </el-form>
        <div class="table">
          <el-table :data="data.data" stripe border height="100%" style="width: 100%">
          <el-table-column label="序号" width="150" prop="number" header-align="center" align="center"></el-table-column>
          <el-table-column label="定点医药机构名称" width="400" prop="hospital_name" header-align="center" align="center"></el-table-column>
          <el-table-column :label="search_form.compare_year" header-align="center" align="center">
          <el-table-column label="总结算人次" width="150" prop="compare_year_sum_count" header-align="center" align="center"></el-table-column>
          <el-table-column label="医保码结算人次" width="150" header-align="center" align="center" prop="compare_year_evidence_count"></el-table-column>
          <el-table-column label="医保码结算率" width="150" header-align="center" align="center" prop="compare_year_evidence_rate"></el-table-column>
          </el-table-column>
          <el-table-column :label="search_form.year" header-align="center" align="center">
          <el-table-column label="总结算人次" width="150" header-align="center" align="center" prop="year_sum_count"></el-table-column>
          <el-table-column label="医保码结算人次" width="150" header-align="center" align="center" prop="year_evidence_count"></el-table-column>
          <el-table-column label="医保码结算率" width="150" header-align="center" align="center" prop="year_evidence_rate"></el-table-column>
          </el-table-column>
          <el-table-column label="增长率" width="180" header-align="center" align="center" prop="increase_evidence_rate"></el-table-column>
        </el-table>
        </div>
    </div>
</template>

<style scoped>
.el-form-item {
  margin-right: 2%;
}
.el-form {
  margin: 1% 0;
}
.body {
  height: 100%;
}
.table {
  width: 100%;
  height: 75%;
}
.button {
  margin-top: 1%;
}
</style>

<script>
import {authentication, search, reset, download, update_cure_type} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            "compare_year": '', 
            "person_type": [], 
            "hospital_place": [], 
            'year_settle_date': [], 
            "compare_year_settle_date": [], 
            "cure_type": [], 
            "cure_type_gather": [], 
            'hospital_name': '',
            'hospital_id': [],
            'local_hospital_id': [],  
            'is_refund': '否', 
            'is_valid': '是', 
          }, 
          default_search_form: {}, 
          data: [], 
          enumerate_data_dict: {}, 
          user_data: {}, 
          local_hospital_list: [], 
          props: { multiple: true },
          loading: false, 
          authority: 'settle_data', 
          clean_request_field_list: ['local_hospital'], 
          header_content: `医保码结算率（更新至${JSON.parse(localStorage.getItem('notify_data'))['settle_date']}）`, 
        }
      }, 
      created () {
        authentication(this, 'default_year|year|person_type|cure_type|cure_type_gather|cure_type_dict|compare_year|hospital_place|hospital_name_id_dict|local_hospital_dict', false, ['local_hospital'])
      }, 
      methods: {
        search: function() {
          search(this, 'evidence_rate')
        },
        update_hospital_name: function(){
            this.search_form.hospital_name = ''
        }, 
        router_to: function(url) {
          this.$router.push(url)
        }, 
        reset: function() {
          reset(this)
        }, 
        download: function() {
          download(this, 'evidence_rate/download')
        },  
        update_cure_type: function() {
            update_cure_type(this)
        }, 
        update_compare_year: function() {
            this.search_form.compare_year = (this.search_form.year - 1).toString()
            if (!this.enumerate_data_dict.year.includes(this.search_form.compare_year)) {
                this.search_form.compare_year = this.enumerate_data_dict.year[0]
            }
        }, 
      }
    }
</script>
