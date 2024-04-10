<template>
    <div v-loading="loading" class="body">
      <el-page-header @back="router_to('/main')" :content="header_content"></el-page-header>
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
            <el-form-item>
              <el-button type="warning" icon="el-icon-download" circle @click='download()'></el-button>
            </el-form-item>
        </el-form>
        <div class="table">
          <el-table :data="data.data" stripe border height="100%" style="width: 100%">
          <el-table-column label="序号" width="200" prop="number" header-align="center" align="center"></el-table-column>
          <el-table-column label="乡镇" width="350" prop="town" header-align="center" align="center"></el-table-column>
          <el-table-column label="任务数" width="350" prop="target" header-align="center" align="center"></el-table-column>
          <el-table-column label="完成数" width="350" header-align="center" align="center" prop="data_count"></el-table-column>
          <el-table-column label="完成率" width="380" header-align="center" align="center" prop="percent"></el-table-column>
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
  height: 85%;
}
</style>

<script>
import {authentication, search, reset, download} from '../functools';
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
          'header_content': `本地居民参保进度（更新至${JSON.parse(localStorage.getItem('notify_data'))['pay_date']}）`,
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
        download: function() {
          download(this, 'insured_rate/download')
        },  
      }
    }
</script>
