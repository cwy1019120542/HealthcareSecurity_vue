<template>
    <div v-loading="loading" class="body">
      <el-page-header @back="router_to('/main')" content="直接结算率"></el-page-header>
        <el-form :inline="true" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择" @change="update_compare_year()">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
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
            <el-form-item label="对比年份:">
                <el-select v-model="search_form.compare_year" placeholder="请选择">
                  <el-option v-for='enumerate_compare_year in enumerate_data_dict.compare_year' :key="enumerate_compare_year" :value="enumerate_compare_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="对比年份结算日期:">
                <el-date-picker
                  v-model="search_form.compare_settle_date"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
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
            <el-form-item label="医疗类别快速筛选:">
                  <el-checkbox-group v-model="search_form.cure_type_gather" @change="update_cure_type()">
                    <el-checkbox-button v-for="enumerate_cure_type_gather in enumerate_data_dict.cure_type_gather" :label="enumerate_cure_type_gather" :key="enumerate_cure_type_gather">{{enumerate_cure_type_gather}}</el-checkbox-button>
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
          <el-table :data="data.data" stripe border height="100%" style="width: 100%" :span-method="merge_column">
          <el-table-column label="医疗机构地点" width="230" prop="hospital_place" header-align="center" align="center"></el-table-column>
          <el-table-column label="年份" width="230" prop="year" header-align="center" align="center"></el-table-column>
          <el-table-column label="结算类别" width="230" prop="settle_type" header-align="center" align="center"></el-table-column>
          <el-table-column label="人次" width="230" header-align="center" align="center" prop="time_count"></el-table-column>
          <el-table-column label="人数" width="230" header-align="center" align="center" prop="number_count"></el-table-column>
          <el-table-column label="总费用（元）" width="240" header-align="center" align="center" prop="all_expense"></el-table-column>
          <el-table-column label="基金总支付（元）" width="240" header-align="center" align="center" prop="all_pay"></el-table-column>
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
            'settle_date': [], 
            "compare_settle_date": [], 
            "cure_type": [], 
            "cure_type_gather": [], 
            'is_refund': '否', 
            'is_valid': '是', 
          }, 
          default_search_form: {}, 
          data: [], 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          authority: 'settle_data', 
          clean_request_field_list: [], 
        }
      }, 
      created () {
        authentication(this, 'default_year|year|person_type|cure_type|cure_type_gather|cure_type_dict|compare_year')
      }, 
      methods: {
        search: function() {
          search(this, 'settle_rate')
        },
        router_to: function(url) {
          this.$router.push(url)
        }, 
        reset: function() {
          reset(this)
        }, 
        download: function() {
          download(this, 'settle_rate/download')
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
        merge_column: function({ row, column, rowIndex, columnIndex }) {
            if (columnIndex == 0) {
                if (rowIndex % 10 == 0) {
                    return {
                    rowspan: 10,
                    colspan: 1
                    }
                }
                else {
                    return {
                    rowspan: 0,
                    colspan: 0
                    }
                }
            }
            if (columnIndex == 1) {
                if (rowIndex % 5 == 0) {
                    return {
                    rowspan: 5,
                    colspan: 1
                    }
                }
                else {
                    return {
                    rowspan: 0,
                    colspan: 0
                    }
                }
            }
        }
      }
    }
</script>
