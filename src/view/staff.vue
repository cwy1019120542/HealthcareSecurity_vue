<template>
    <div v-loading="loading" class="body">
      <el-page-header @back="router_to('/main')" content="考核数据查询"></el-page-header>
        <el-form :inline="true" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名:">
                <el-input placeholder="请输入（支持模糊查询）" v-model="search_form.name" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:">
                <el-input placeholder="请输入" v-model="search_form.id_number" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-form-item label="工号:">
                <el-input placeholder="请输入" v-model="search_form.work_number" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-form-item label="部门:">
                <el-select v-model="search_form.department" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_department in enumerate_data_dict.department' :key="enumerate_department" :value="enumerate_department"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="岗位:">
                <el-select v-model="search_form.position" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_position in enumerate_data_dict.position' :key="enumerate_position" :value="enumerate_position"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="学历:">
                <el-select v-model="search_form.education" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_education in enumerate_data_dict.education' :key="enumerate_education" :value="enumerate_education"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search('list', 1)" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="reset()" round icon="el-icon-refresh">重置</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" icon="el-icon-download" circle @click='download()'></el-button>
            </el-form-item>
        </el-form>
        <div class="table">
          <el-table :data="data.data"  stripe border height="100%" style="width: 100%">
          <el-table-column label="序号" width="100" prop="number" header-align="center" align="center"></el-table-column>
          <el-table-column label="姓名" width="100" prop="name" header-align="center" align="center"></el-table-column>
          <el-table-column label="身份证号" width="200" prop="id_number" header-align="center" align="center"></el-table-column>
          <el-table-column label="分数" width="100" header-align="center" align="center">
            <template slot-scope="scope">
                   <el-link type="primary" icon="el-icon-view" @click="router_to('/check_data', {'id_number': scope.row.id_number, 'name': scope.row.name})">{{scope.row.point}}</el-link>
            </template>         
          </el-table-column>
          <el-table-column label="加分" width="100" header-align="center" align="center">
            <template slot-scope="scope">
                   <el-link type="success" :disabled='scope.row.get_point==0' icon='el-icon-zoom-in' @click="router_to('/check_data', {'id_number': scope.row.id_number, 'name': scope.row.name, 'operate_type': '加分'})">{{scope.row.get_point}}</el-link>
            </template>  
            </el-table-column>
          <el-table-column label="扣分" width="100" header-align="center" align="center">
            <template slot-scope="scope">
                   <el-link type="danger" :disabled='scope.row.lost_point==0' icon='el-icon-zoom-out' @click="router_to('/check_data', {'id_number': scope.row.id_number, 'name': scope.row.name, 'operate_type': '扣分'})">{{scope.row.lost_point}}</el-link>
            </template>  
            </el-table-column>
          <el-table-column label="事项数" width="100" prop="data_count" header-align="center" align="center"></el-table-column>
          <el-table-column label="工号" width="125" header-align="center" align="center" prop="work_number"></el-table-column>
          <el-table-column label="部门" width="100" header-align="center" align="center" prop="department"></el-table-column>
          <el-table-column label="岗位" width="100" prop="position" header-align="center" align="center"></el-table-column>
          <el-table-column label="学历" width="100" prop="education" header-align="center" align="center"></el-table-column>
        　<el-table-column label="手机号" width="200" prop="phone_number" header-align="center" align="center"></el-table-column>
        　<el-table-column label="调入时间" width="205" prop="enter_date" header-align="center" align="center"></el-table-column>
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
.el-form {
  margin: 1% 0;
}
.body {
  height: 100%;
}
.table {
  width: 100%;
  height: 70%;
}
.el-pagination {
  margin-top: 1%;
}
</style>

<script>
import {authentication, reset, search, download} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            'name': '', 
            "id_number": '',
            'work_number': '',  
            "department": [], 
            "position": [], 
            'education': [], 
            'page': 0, 
            'limit': 20, 
          }, 
          default_search_form: {}, 
          data: {}, 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          authority: 'check_data', 
          clean_request_field_list: [], 
          limit_list: [10, 20, 50, 100], 
        }
      }, 
      created () {
        authentication(this, 'default_year|year|department|position|education', true)
      }, 
      methods: {
        search: function(show_type, page=0) {
          this.search_form.page = page
          search(this, `staff/${show_type}`, show_type)
        }, 
        download: function() {
          download(this, 'staff/list/download')
        }, 
        router_to: function(path, query={}) {
          this.$router.push({
            path: path,
            query: query,
        })
        }, 
        reset: function() {
          reset(this)
        }, 
      }
    }
</script>
