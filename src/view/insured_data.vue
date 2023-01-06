<template>
    <div v-loading="loading">
      <el-page-header @back="router_to('/main')" content="参保数据明细"></el-page-header>
        <el-form :inline="true" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择"  @change="update_enumerate_data()">
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
            <el-form-item label="人员属性:">
                <el-select v-model="search_form.attribute" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_attribute in enumerate_data_dict.attribute' :key="enumerate_attribute" :value="enumerate_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="其他属性:">
                <el-select v-model="search_form.second_attribute" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_second_attribute in enumerate_data_dict.second_attribute' :key="enumerate_second_attribute" :value="enumerate_second_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="贫困状态:">
                <el-select v-model="search_form.poverty_state" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_poverty_state in enumerate_data_dict.poverty_state' :key="enumerate_poverty_state" :value="enumerate_poverty_state"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支付日期开始:">
                <el-select v-model="search_form.pay_date_start" placeholder="请选择"  clearable>
                    <el-option v-for="enumerate_pay_date in enumerate_data_dict.pay_date" :key="enumerate_pay_date" :value="enumerate_pay_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支付日期结束:">
                <el-select v-model="search_form.pay_date_end" placeholder="请选择"  clearable>
                    <el-option v-for="enumerate_pay_date in enumerate_data_dict.pay_date" :key="enumerate_pay_date" :value="enumerate_pay_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="乡镇:" :disabled='town_disabled'>
                <el-select v-model="search_form.town" placeholder="请选择" clearable multiple @change="update_village()" collapse-tags>
                  <el-option v-for='enumerate_town in enumerate_data_dict.town' :key="enumerate_town" :value="enumerate_town"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="村:">
                <el-select v-model="search_form.village" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_village in enumerate_data_dict.village' :key="enumerate_village" :value="enumerate_village"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医共体:" v-if='!town_disabled'>
                  <el-checkbox-group v-model="search_form.hospital_community" size="medium" @change="update_town">
                    <el-checkbox-button v-for="enumerate_hospital_community in enumerate_data_dict.hospital_community" :label="enumerate_hospital_community" :key="enumerate_hospital_community">{{enumerate_hospital_community}}</el-checkbox-button>
                  </el-checkbox-group>
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
                <span>{{insured_data_statistic.all_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>参加居民医保（人）</span>
            </div>
                <span>{{insured_data_statistic.insured_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>未参加居民医保（人）</span>
            </div>
                <span>{{insured_data_statistic.not_insured_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>享受参保资助（人）</span>
            </div>
                <span>{{insured_data_statistic.perk_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>自付金额（元）</span>
            </div>
                <span>{{insured_data_statistic.own_expense}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>资助金额（元）</span>
            </div>
                <span>{{insured_data_statistic.perk}}</span>
            </el-card>
        </div>
        <div v-if='is_list'>
          <el-table :data="insured_data_list">
          <el-table-column label="序号" width="100" prop="number" header-align="center" align="center"></el-table-column>
          <el-table-column label="姓名" width="100" prop="name" header-align="center" align="center"></el-table-column>
          <el-table-column label="身份证号" width="200" prop="id_number" header-align="center" align="center"></el-table-column>
          <el-table-column label="参保情况" width="125" header-align="center" align="center" prop="insured_state"></el-table-column>
          <el-table-column label="人员属性" width="125" header-align="center" align="center" prop="attribute"></el-table-column>
          <el-table-column label="其他属性" width="150" header-align="center" align="center" prop="second_attribute"></el-table-column>
          <el-table-column label="贫困状态" width="125" header-align="center" align="center" prop="poverty_state"></el-table-column>
          <el-table-column label="乡镇" width="75" prop="town" header-align="center" align="center"></el-table-column>
          <el-table-column label="村" width="125" prop="village" header-align="center" align="center"></el-table-column>
          <el-table-column label="手机号" width="125" header-align="center" align="center" prop="phone_number"></el-table-column>
          <el-table-column label="自付金额" width="100" prop="own_expense" header-align="center" align="center"></el-table-column>
          <el-table-column label="支付日期" width="175" prop="pay_date" header-align="center" align="center"></el-table-column>
        </el-table>
        </div>
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total='data_count'
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
import fileDownload from 'js-file-download';
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            'name': '', 
            "id_number": '', 
            "insured_state": [], 
            "attribute": [], 
            "second_attribute": [], 
            "poverty_state": [], 
            'pay_date_start': '', 
            'pay_date_end': '', 
            "town": [], 
            "village": [], 
            'page': 1, 
            'hospital_community': [], 
          }, 
          data_count: 0, 
          insured_data_list: [], 
          insured_data_statistic: [], 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          town_disabled: false, 
          is_list: true, 
        }
      }, 
      created () {
        this.user_data = JSON.parse(localStorage.getItem('user_data'))
        if (this.user_data['authority'].indexOf('*')==-1 && this.user_data['authority'].indexOf('insured_data')==-1) {
          this.$router.push('/login')
        }
        this.$axios.get('/enumerate_data').then((res)=>{
            const data = res['data']['data'];
            this.enumerate_data_dict = data
            if (this.user_data.town) {
                this.enumerate_data_dict.town = [this.user_data.town]
                this.search_form.town = [this.user_data.town]
                this.enumerate_data_dict.village = this.town_village_dict[town]
                this.enumerate_data_dict.default_village = this.town_village_dict[town]
                this.town_disabled = true
                this.enumerate_data_dict.default_town = [this.user_data['town']]
            } 
            else {
                this.enumerate_data_dict.town = Object.keys(this.enumerate_data_dict.town_village_dict)
                this.enumerate_data_dict.village = []
                this.enumerate_data_dict.default_village = []
                this.enumerate_data_dict.default_town = []
            }
            this.set_default()
            this.list_search(1)
        })
        
      }, 
      methods: {
        update_enumerate_data: function() {
            this.enumerate_data_dict.pay_date = []
            for (let i=1;i<=12;i++) {
                if (i < 10) {
                    i = `0${i}`
                }
                this.enumerate_data_dict.pay_date.push(`${parseInt(this.search_form.year)-1}-${i}`)
            }
            for (let i=1;i<=12;i++) {
                if (i < 10) {
                    i = `0${i}`
                }
                this.enumerate_data_dict.pay_date.push(`${this.search_form.year}-${i}`)
            }
        }, 
        set_default: function() {
          this.search_form.year = this.enumerate_data_dict.default_year
          this.search_form.town = this.enumerate_data_dict.default_town
          this.enumerate_data_dict.village = this.enumerate_data_dict.default_village
          this.search_form.id_number = ''
          this.search_form.name = ''
          this.search_form.pay_date_start = ''
          this.search_form.pay_date_end = ''
          this.update_enumerate_data()
        }, 
        get_params: function() {
          const params_dict = {'params': {}}
            if (this.search_form.pay_date_start && this.search_form.pay_date_end) {
              params_dict.params['pay_date'] = `${this.search_form.pay_date_start}_${this.search_form.pay_date_end}`
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
          return params_dict
        }, 
        list_search: function(page) {
            this.loading = true
            this.is_list = true
            this.search_form.page = page
            const params_dict = this.get_params()
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
        statistic_search: function() {
              this.loading = true
              this.is_list = false
              const params_dict = this.get_params()
              this.$axios.get(`/user/${this.user_data['id']}/insured_data/statistic`, params_dict).then((res)=>{
                this.loading = false
                this.insured_data_statistic = res.data['data']
              }).catch(error=>{
                  this.loading = false
                  this.$message({
                    showClose: true, 
                    message: '查询出错', 
                    type: 'error'
                })
              })
          }, 
        download: function() {
            this.loading = true
            const params_dict = this.get_params()
            var download_type = 'list'
            if (!this.is_list) {
                download_type = 'statistic'
            }
            params_dict['responseType'] = 'blob'
            this.$axios.get(`/user/${this.user_data['id']}/insured_data/${download_type}/download`, params_dict).then((res)=>{
                this.loading = false
                fileDownload(res.data, res.headers.file_name);
              }).catch(error=>{
                  this.loading = false
                  this.$message({
                    showClose: true, 
                    message: '无法下载，数据量需小于5万', 
                    type: 'error'
                })
              })
        }, 
        router_to: function(url) {
          this.$router.push(url)
        }, 
        update_town: function() {
          const hospital_community = this.search_form.hospital_community.toString()
          if (hospital_community == '市立医院') {
            this.search_form.town = ['黄柏镇', '槎水镇', '源潭镇', '余井镇', '梅城镇', '官庄镇', '塔畈乡', '龙潭乡']
          }
          else if (hospital_community == '中医院') {
            this.search_form.town = ['水吼镇', '黄铺镇', '王河镇', '油坝乡', '黄泥镇', '五庙乡', '痘姆乡', '天柱山镇', '开发区']
          }
          else {
            this.search_form.town = []
          }
        }, 
        update_village: function() {
          if (this.search_form.town.length) {
            this.enumerate_data_dict.village = []
            for (let town of this.search_form.town) {
                for (let village of this.enumerate_data_dict.town_village_dict[town]) {
                    this.enumerate_data_dict.village.push(village)
                }
            }
          }
          else {
            this.enumerate_data_dict.village = this.enumerate_data_dict.default_village
          }
          this.search_form.village = []
        }, 
        reset: function() {
          for (let key in this.search_form) {
                this.search_form[key] = []
              }
              this.set_default()
        }, 
      }
    }
</script>
