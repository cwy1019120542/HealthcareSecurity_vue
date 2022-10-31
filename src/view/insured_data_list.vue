<template>
    <div v-loading="loading">
      <el-page-header @back="router_to('/main')" content="参保数据明细"></el-page-header>
        <el-form :inline="true" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择" size="mini">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="身份证号:" class='id_number_form'>
                <el-input placeholder="身份证号" v-model="search_form.id_number" clearable prefix-icon="el-icon-search" size="mini" class='id_number_input'></el-input>
            </el-form-item>
            <el-form-item label="参保情况:">
                <el-select v-model="search_form.insured_state" placeholder="请选择" clearable size="mini" multiple>
                  <el-option v-for='enumerate_insured_state in enumerate_data_dict.insured_state' :key="enumerate_insured_state" :value="enumerate_insured_state"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="参保地区:">
                <el-select v-model="search_form.insured_area" placeholder="请选择" clearable size="mini" multiple>
                  <el-option v-for='enumerate_insured_area in enumerate_data_dict.insured_area' :key="enumerate_insured_area" :value="enumerate_insured_area"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员属性:">
                <el-select v-model="search_form.attribute" placeholder="请选择" clearable size="mini" multiple>
                  <el-option v-for='enumerate_attribute in enumerate_data_dict.attribute' :key="enumerate_attribute" :value="enumerate_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="其他属性:">
                <el-select v-model="search_form.second_attribute" placeholder="请选择" clearable size="mini" multiple>
                  <el-option v-for='enumerate_second_attribute in enumerate_data_dict.second_attribute' :key="enumerate_second_attribute" :value="enumerate_second_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="贫困状态:">
                <el-select v-model="search_form.poverty_state" placeholder="请选择" clearable size="mini" multiple>
                  <el-option v-for='enumerate_poverty_state in enumerate_data_dict.poverty_state' :key="enumerate_poverty_state" :value="enumerate_poverty_state"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="乡镇:">
                <el-select v-model="search_form.town" placeholder="请选择" clearable size="mini" multiple>
                  <el-option v-for='enumerate_town in enumerate_data_dict.town' :key="enumerate_town" :value="enumerate_town"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="村:">
                <el-select v-model="search_form.village" placeholder="请选择" clearable size="mini">
                  <el-option v-for='enumerate_village in enumerate_data_dict.village' :key="enumerate_village" :value="enumerate_village"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="search(1)" icon="el-icon-search">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="search(1, true)" round icon="el-icon-refresh">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="insured_data_list">
          <el-table-column label="序号" width="100" prop="number" header-align="center" align="center"></el-table-column>
          <el-table-column label="姓名" width="100" prop="name" header-align="center" align="center"></el-table-column>
          <el-table-column label="身份证号" width="200" prop="id_number" header-align="center" align="center"></el-table-column>
          <el-table-column label="参保情况" width="125" header-align="center" align="center" prop="insured_state"></el-table-column>
          <el-table-column label="参保地区" width="125" header-align="center" align="center" prop="insured_area"></el-table-column>
          <el-table-column label="人员属性" width="125" header-align="center" align="center" prop="attribute"></el-table-column>
          <el-table-column label="其他属性" width="150" header-align="center" align="center" prop="second_attribute"></el-table-column>
          <el-table-column label="贫困状态" width="125" header-align="center" align="center" prop="poverty_state"></el-table-column>
          <el-table-column label="乡镇" width="100" prop="town" header-align="center" align="center"></el-table-column>
          <el-table-column label="村" width="125" prop="village" header-align="center" align="center"></el-table-column>
          <el-table-column label="手机号" width="125" header-align="center" align="center" prop="phone_number"></el-table-column>
          <el-table-column label="自付金额" width="100" prop="own_expense" header-align="center" align="center"></el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total='data_count'
          :current-page.sync='search_form.page'
          @current-change='search(search_form.page)'>
        </el-pagination>
        <el-tag type="warning">共 {{data_count}} 条</el-tag>
    </div>
</template>

<style scoped>
.el-form {
  margin: 1% 0;
}
.el-pagination {
  margin: 1% 0;
  width: 28%;
  display: inline-block;
}
.el-table {
  margin: 1% 1%;
}
.el-tag {
  display: inline-block;
}
</style>

<script>
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            "id_number": '', 
            "insured_state": '', 
            "insured_area": '', 
            "attribute": '', 
            "second_attribute": '', 
            "poverty_state": '', 
            "town": '', 
            "village": '', 
            'page': '', 
          }, 
          data_count: 0, 
          insured_data_list: [], 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
        }
      }, 
      created () {
        this.user_data = JSON.parse(localStorage.getItem('user_data'))
        if (this.user_data['authority'].indexOf('*')==-1 && this.user_data['authority'].indexOf('insured_data_list')==-1) {
          this.$router.push('/login')
        }
        this.search(1)
        this.$axios.get('/enumerate_data').then((res)=>{
            const data = res['data']['data'];
            this.enumerate_data_dict = data
            this.set_default()
            const town_list = Object.keys(this.enumerate_data_dict.town_village_dict)
            let village_list = new Set()
            for (let village_group of Object.values(this.enumerate_data_dict.town_village_dict)) {
                for (let village of village_group) {
                    village_list.add(village)
                }
            }
            village_list = Array.from(village_list)
            if (this.user_data.town) {
                this.enumerate_data_dict.town = [this.user_data.town]
                if (this.user_data.village) {
                    this.enumerate_data_dict.village = [this.user_data.village]
                }
                else {
                    this.enumerate_data_dict.village = this.town_village_dict[town]
                }
            } 
            else {
                this.enumerate_data_dict.town = town_list
                this.enumerate_data_dict.village = village_list
            }
        })
      }, 
      methods: {
        set_default: function() {
          this.search_form.year = this.enumerate_data_dict.year.slice(-1)
        }, 
        search: function(page, is_reset=false) {
            this.loading = true
            this.search_form.page = page
            const params_dict = {'params': {}}
            if (is_reset) {
              for (let key in this.search_form) {
                this.search_form[key] = ''
              }
              this.search_form.page = 1
              this.set_default()
            }
            for (let key in this.search_form) {
                const value = this.search_form[key]
                if (value instanceof Array) {
                    if (value.length) {
                        params_dict.params[key] = value.join('_')
                    }
                    
                } 
                else {
                    if (value) {
                        params_dict.params[key] = value
                    }
                }
              }
            this.$axios.get(`/user/${this.user_data['id']}/insured_data/list`, params_dict).then(res=>{
              this.loading = false
              this.insured_data_list = res.data['data'];
              this.data_count = res.data['data_count'];
          }).catch(error=>{
            this.loading = false
            this.$message({
              showClose: true, 
              message: '查询出错', 
              type: 'error'
            })
          })
        }, 
        router_to: function(url) {
          this.$router.push(url)
        }, 
      }
    }
</script>
