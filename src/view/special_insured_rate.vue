<template>
    <div v-loading="loading" class="body">
      <el-page-header @back="router_to('/main')" :content="header_content"></el-page-header>
        <el-form :inline="true" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员属性:">
                <el-select v-model="search_form.attribute" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_attribute in enumerate_data_dict.attribute' :key="enumerate_attribute" :value="enumerate_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员属性快速筛选:">
                  <el-checkbox-group v-model="search_form.attribute_gather" @change="update_attribute()">
                    <el-checkbox-button v-for="enumerate_attribute_gather in enumerate_data_dict.attribute_gather" :label="enumerate_attribute_gather" :key="enumerate_attribute_gather">{{enumerate_attribute_gather}}</el-checkbox-button>
                  </el-checkbox-group>
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
          <el-table-column label="序号" width="80" prop="number" header-align="center" align="center"></el-table-column>
          <el-table-column label="乡镇" width="100" prop="town" header-align="center" align="center"></el-table-column>
          <el-table-column label="任务数" width="100" prop="target" header-align="center" align="center"></el-table-column>
          <el-table-column label="本地居民" width="100" prop="本地居民" header-align="center" align="center"></el-table-column>
          <el-table-column label="本地职工(在职)" width="120" prop="本地职工(在职)" header-align="center" align="center"></el-table-column>
          <el-table-column label="本地职工(退休)" width="120" prop="本地职工(退休)" header-align="center" align="center"></el-table-column>
          <el-table-column label="异地居民" width="100" prop="异地居民" header-align="center" align="center"></el-table-column>
          <el-table-column label="异地职工" width="100" prop="异地职工" header-align="center" align="center"></el-table-column>
          <el-table-column label="参军" width="90" prop="参军" header-align="center" align="center"></el-table-column>
          <el-table-column label="服刑" width="90" prop="服刑" header-align="center" align="center"></el-table-column>
          <el-table-column label="死亡" width="90" prop="死亡" header-align="center" align="center"></el-table-column>
          <el-table-column label="失联" width="90" prop="失联" header-align="center" align="center"></el-table-column>
          <el-table-column label="动态新增" width="90" prop="动态新增" header-align="center" align="center"></el-table-column>
          <el-table-column label="自愿放弃" width="90" prop="自愿放弃" header-align="center" align="center"></el-table-column>
          <el-table-column label="其他原因" width="90" prop="其他" header-align="center" align="center"></el-table-column>
          <el-table-column label="完成数" width="90" header-align="center" align="center" prop="data_count"></el-table-column>
          <el-table-column label="完成率" width="90" header-align="center" align="center" prop="percent"></el-table-column>
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
import {authentication, search, reset, update_attribute, download} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            'attribute': ['农村特困', '城市特困', '农村低保', '城市低保', '监测户', '稳定脱贫人口', '致贫返贫人口', '孤儿', '事实无人抚养儿童', '肇事肇祸精神病人', '低保边缘家庭人员', '因病致贫家庭重病患者'], 
            'attribute_gather': ['应保尽保人群'],
            'town': '',  
            'insured_state': '其他', 
          }, 
          default_search_form: {}, 
          data: [], 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          authority: 'insured_data', 
          clean_request_field_list: ['attribute'], 
          'header_content': `特殊人群参保进度（更新至${JSON.parse(localStorage.getItem('notify_data'))['pay_date']}）`, 
        }
      }, 
      created () {
        authentication(this, 'attribute_dict|attribute_gather|default_year|year|attribute_gather_dict', false, ['attribute'])
      }, 
      methods: {
        search: function() {
          search(this, 'special_insured_rate')
        },
        download: function() {
          download(this, 'special_insured_rate/download')
        },  
        router_to: function(url) {
          this.$router.push(url)
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
