<template>
    <div v-loading="loading" class="body">
      <el-page-header @back="router_to('/main')" :content="header_content"></el-page-header>
        <el-form :inline="true" :model="search_form" ref="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员类别:">
                <el-select v-model="search_form.person_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_person_type in enumerate_data_dict.person_type" :key="enumerate_person_type" :value="enumerate_person_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算日期:">
                <el-date-picker
                  v-model="search_form.settle_date"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="表名:">
                <el-select v-model="search_form.open_data_type" placeholder="请选择"  clearable>
                    <el-option v-for="enumerate_open_data_type in enumerate_data_dict.open_data_type" :key="enumerate_open_data_type" :value="enumerate_open_data_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" @click="download()" icon="el-icon-download">下载表格</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="reset()" round icon="el-icon-refresh">重置</el-button>
            </el-form-item>
        </el-form>
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
</style>

<script>
import {authentication, reset, download} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            "person_type": [],
            'settle_date': [], 
            'open_data_type': '', 
            'is_valid': '是', 
            'is_refund': '否', 
          }, 
          default_search_form: {}, 
          data: [], 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          authority: 'settle_data', 
          clean_request_field_list: [], 
          'header_content': `政务公开数据（更新至${JSON.parse(localStorage.getItem('notify_data'))['settle_date']}）`, 
        }
      }, 
      created () {
        authentication(this, 'default_year|year|person_type|open_data_type_dict|open_data_type', false)
      }, 
      methods: {
        download: function() {
            if (this.search_form.open_data_type) {
                download(this, `open_data/${this.enumerate_data_dict.open_data_type_dict[this.search_form.open_data_type]}/list/download`)
            }
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
