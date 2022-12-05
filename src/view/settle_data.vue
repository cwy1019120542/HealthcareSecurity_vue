<template>
    <div v-loading="loading">
        <el-page-header @back="router_to('/main')" content="结算数据统计"></el-page-header>
        <el-form :inline="true" class="demo-form-inline" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择" @change="update_enumerate_data()">
                    <el-option v-for="enumerate_year in enumerate_data_dict.year" :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名:">
                <el-input placeholder="姓名" v-model="search_form.name" clearable prefix-icon="el-icon-search"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:">
                <el-input placeholder="身份证号" v-model="search_form.id_number" clearable prefix-icon="el-icon-search"></el-input>
            </el-form-item>
            <el-form-item label="人员类别:">
                <el-select v-model="search_form.person_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_person_type in enumerate_data_dict.person_type" :key="enumerate_person_type" :value="enumerate_person_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支付地点类别:">
                <el-select v-model="search_form.pay_place" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_pay_place in enumerate_data_dict.pay_place" :key="enumerate_pay_place" :value="enumerate_pay_place"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医院等级:">
                <el-select v-model="search_form.hospital_level" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_hospital_level in enumerate_data_dict.hospital_level" :key="enumerate_hospital_level" :value="enumerate_hospital_level"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="就诊凭证类型:">
                <el-select v-model="search_form.evidence_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_evidence_type in enumerate_data_dict.evidence_type" :key="enumerate_evidence_type" :value="enumerate_evidence_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医疗类别:">
                <el-select v-model="search_form.cure_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_cure_type in enumerate_data_dict.cure_type" :key="enumerate_cure_type" :value="enumerate_cure_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算日期开始:">
                <el-select v-model="search_form.settle_date_start" placeholder="请选择" clearable>
                    <el-option v-for="enumerate_settle_date in enumerate_data_dict.settle_date" :key="enumerate_settle_date" :value="enumerate_settle_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算日期结束:">
                <el-select v-model="search_form.settle_date_end" placeholder="请选择" clearable>
                    <el-option v-for="enumerate_settle_date in enumerate_data_dict.settle_date" :key="enumerate_settle_date" :value="enumerate_settle_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员属性:">
                <el-select v-model="search_form.attribute" multiple placeholder="请选择" clearable collapse-tags>
                  <el-option v-for='enumerate_attribute in enumerate_data_dict.attribute' :key="enumerate_attribute" :label="enumerate_attribute" :value="enumerate_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="其他属性:">
                <el-select v-model="search_form.second_attribute" multiple placeholder="请选择" clearable collapse-tags>
                  <el-option v-for='enumerate_second_attribute in enumerate_data_dict.second_attribute' :key="enumerate_second_attribute" :label="enumerate_second_attribute" :value="enumerate_second_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="贫困状态:">
                <el-select v-model="search_form.poverty_state" multiple placeholder="请选择" clearable collapse-tags>
                  <el-option v-for='enumerate_poverty_state in enumerate_data_dict.poverty_state' :key="enumerate_poverty_state" :label="enumerate_poverty_state" :value="enumerate_poverty_state"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="乡镇:">
                <el-select v-model="search_form.town" placeholder="请选择" clearable multiple @change="update_village()" collapse-tags>
                  <el-option v-for='enumerate_town in enumerate_data_dict.town' :key="enumerate_town" :label="enumerate_town" :value="enumerate_town"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="村:">
                <el-select v-model="search_form.village" placeholder="请选择" clearable multiple collapse-tags>
                  <el-option v-for='enumerate_village in enumerate_data_dict.village' :key="enumerate_village" :label="enumerate_village" :value="enumerate_village"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医共体:">
                  <el-checkbox-group v-model="search_form.hospital_community" @change="update_town()">
                    <el-checkbox-button v-for="enumerate_hospital_community in enumerate_data_dict.hospital_community" :label="enumerate_hospital_community" :key="enumerate_hospital_community">{{enumerate_hospital_community}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="list_search(1)" icon="el-icon-search">明细查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="statistic_search()" icon="el-icon-search">统计查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" round icon="el-icon-refresh" @click='reset()'>重置</el-button>
            </el-form-item>
        </el-form>
        <div v-if='!is_list'>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>人次</span>
            </div>
                <span>{{settle_data_statistic.time_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>人数</span>
            </div>
                <span>{{settle_data_statistic.number_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>总费用（元）</span>
            </div>
                <span>{{settle_data_statistic.all_expense}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>范围内费用（元）</span>
            </div>
                <span>{{settle_data_statistic.inner_expense}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>统筹基金支出（元）</span>
            </div>
                <span>{{settle_data_statistic.overall_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>大额医疗支出（元）</span>
            </div>
                <span>{{settle_data_statistic.large_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>大病保险支出（元）</span>
            </div>
                <span>{{settle_data_statistic.big_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>医疗救助支出（元）</span>
            </div>
                <span>{{settle_data_statistic.rescue_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>公务员医疗补助（元）</span>
            </div>
                <span>{{settle_data_statistic.civil_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>其他基金支付（元）</span>
            </div>
                <span>{{settle_data_statistic.other_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>基金支付总额（元）</span>
            </div>
                <span>{{settle_data_statistic.all_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>个人现金支付（元）</span>
            </div>
                <span>{{settle_data_statistic.cash_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>个人账户支付（元）</span>
            </div>
                <span>{{settle_data_statistic.account_pay}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>账户共济支付金额（元）</span>
            </div>
                <span>{{settle_data_statistic.together_pay}}</span>
            </el-card>
        </div>
        <div v-if='is_list'>
            <el-table :data="settle_data_list">
                <el-table-column label="序号" width="75" prop="number" header-align="center" align="center"></el-table-column>
                <el-table-column label="姓名" width="150" prop="name" header-align="center" align="center"></el-table-column>
                <el-table-column label="身份证号" width="175" prop="id_number" header-align="center" align="center"></el-table-column>
                <el-table-column label="人员类别" width="50" prop="person_type" header-align="center" align="center"></el-table-column>
                <el-table-column label="支付地点类别" width="125" prop="pay_place" header-align="center" align="center"></el-table-column>
                <el-table-column label="定点医药机构编号" width="150" prop="hospital_id" header-align="center" align="center"></el-table-column>
                <el-table-column label="定点医药机构名称" width="500" prop="hospital_name" header-align="center" align="center"></el-table-column>
                <el-table-column label="医院等级" width="100" prop="hospital_level" header-align="center" align="center"></el-table-column>
                <el-table-column label="开始日期" width="175" prop="start_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="结束日期" width="175" prop="end_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="结算日期" width="175" prop="settle_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="就诊凭证类型" width="125" prop="evidence_type" header-align="center" align="center"></el-table-column>
                <el-table-column label="总费用" width="100" prop="all_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="全自费金额" width="100" prop="self_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="超限价自费费用" width="100" prop="over_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="先行自付金额" width="100" prop="first_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="范围内费用" width="100" prop="inner_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="起付线" width="100" prop="start_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="统筹基金支出" width="100" prop="overall_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="大额医疗支出金额" width="100" prop="large_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="大病保险支出" width="100" prop="big_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="医疗救助支出" width="100" prop="rescue_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="公务员医疗补助" width="100" prop="civil_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="其他基金支付" width="100" prop="other_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="基金支付总额" width="100" prop="all_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="个人现金支付" width="100" prop="cash_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="个人账户支付" width="100" prop="account_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="账户共济支付金额" width="100" prop="together_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="病种名称" width="350" prop="illness_name" header-align="center" align="center"></el-table-column>
                <el-table-column label="医疗类别" width="200" prop="cure_type" header-align="center" align="center"></el-table-column>
                <el-table-column label="人员属性" width="125" prop="attribute" header-align="center" align="center"></el-table-column>
                <el-table-column label="其他属性" width="150" prop="second_attribute" header-align="center" align="center"></el-table-column>
                <el-table-column label="贫困状态" width="125" prop="poverty_state" header-align="center" align="center"></el-table-column>
                <el-table-column label="乡镇" width="75" prop="town" header-align="center" align="center"></el-table-column>
                <el-table-column label="村" width="125" prop="village" header-align="center" align="center"></el-table-column>
            </el-table>
            <el-pagination
            background
            layout="total, prev, pager, next"
            :total='data_count'
            :current-page.sync='search_form.page'
            @current-change='list_search(search_form.page)'>
            </el-pagination>
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
        margin: 0 1% 1% 1%;
        }
</style>
    
<script>
 export default {
      data() {
        return {
          search_form: {
            "year": [], 
            'name': '', 
            'id_number': '', 
            "person_type": [], 
            "pay_place": [], 
            "hospital_level": [], 
            "evidence_type": [], 
            "cure_type": [], 
            "settle_date_start": '', 
            "settle_date_end": '', 
            "attribute": [], 
            "second_attribute": [], 
            "poverty_state": [], 
            "town": [], 
            "village": [], 
            'hospital_community': [], 
            'page': '', 
          }, 
          settle_data_statistic: {}, 
          settle_data_list: [], 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          is_list: false, 
          data_count: 0, 
        }
      }, 
      created () {
        this.user_data = JSON.parse(localStorage.getItem('user_data'))
        if (this.user_data['authority'].indexOf('*')==-1 && this.user_data['authority'].indexOf('settle_data')==-1) {
          this.$router.push('/login')
        }
        else {
            this.$axios.get('/enumerate_data').then((res)=>{
            const data = res['data']['data'];
            this.enumerate_data_dict = data
            this.enumerate_data_dict.town = Object.keys(this.enumerate_data_dict.town_village_dict)
            this.enumerate_data_dict.village = []
            this.set_default()
        })
        }
      }, 
      methods: {
        update_enumerate_data: function() {
            this.enumerate_data_dict.settle_date = []
            for (let i=1;i<=12;i++) {
                if (i < 10) {
                    i = `0${i}`
                }
                this.enumerate_data_dict.settle_date.push(`${this.search_form.year}-${i}`)
            }
        }, 
        set_default: function() {
            this.search_form.year = this.enumerate_data_dict.default_year
            this.enumerate_data_dict.village = []
            this.search_form.name = ''
            this.search_form.id_number = ''
            this.search_form.settle_date_start = ''
            this.search_form.settle_date_end = ''
            this.update_enumerate_data()
        }, 
        get_params: function() {
            const params_dict = {'params': {}}
            if (this.search_form.settle_date_start && this.search_form.settle_date_end) {
              params_dict.params['settle_date'] = `${this.search_form.settle_date_start}_${this.search_form.settle_date_end}`
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
        statistic_search: function() {
              this.loading = true
              this.is_list = false
              const params_dict = this.get_params()
              this.$axios.get(`/user/${this.user_data['id']}/settle_data/statistic`, params_dict).then((res)=>{
                this.loading = false
                this.settle_data_statistic = res.data['data']
              }).catch(error=>{
                  this.loading = false
                  this.$message({
                    showClose: true, 
                    message: '查询出错', 
                    type: 'error'
                })
              })
          }, 
        list_search: function(page) {
            this.loading = true
            this.is_list = true
            this.search_form.page = page
              const params_dict = this.get_params()
              this.$axios.get(`/user/${this.user_data['id']}/settle_data/list`, params_dict).then((res)=>{
                this.loading = false
                this.settle_data_list = res.data['data']
                this.data_count = res.data['data_count']
              }).catch(error=>{
                  this.loading = false
                  this.$message({
                    showClose: true, 
                    message: '查询出错', 
                    type: 'error'
                })
              })
        }, 
        reset: function () {
            for (let key in this.search_form) {
                this.search_form[key] = []
            }
            this.set_default()
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
      }
}
</script>
