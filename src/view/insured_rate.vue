<template>
    <div v-loading="loading">
      <el-page-header @back="router_to('/main')" content="本地居民参保进度"></el-page-header>
        <el-form :inline="true" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
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
            <el-form-item>
                <el-button type="primary" @click="search()" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="reset()" round icon="el-icon-refresh">重置</el-button>
            </el-form-item>
        </el-form>
        <div>
          <el-table :data="data.data" border stripe>
          <el-table-column label="序号" width="150" prop="number" header-align="center" align="center"></el-table-column>
          <el-table-column label="乡镇" width="325" prop="town" header-align="center" align="center"></el-table-column>
          <el-table-column label="任务数" width="325" prop="target" header-align="center" align="center"></el-table-column>
          <el-table-column label="完成数" width="325" header-align="center" align="center" prop="data_count"></el-table-column>
          <el-table-column label="完成率" width="345" header-align="center" align="center" prop="percent"></el-table-column>
        </el-table>
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
  width: 90%;
  margin: 0 5%;
}
</style>

<script>
import {authentication, search, reset} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            'pay_date': [], 
          }, 
          default_search_form: {}, 
          data: [], 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          authority: 'insured_data', 
          clean_request_field_list: [], 
        }
      }, 
      created () {
        authentication(this, 'default_year|year')
      }, 
      methods: {
        search: function() {
          search(this, 'insured_rate')
        },
        router_to: function(url) {
          this.$router.push(url)
        }, 
        reset: function() {
          reset(this)
        }, 
      }
    }
</script>
