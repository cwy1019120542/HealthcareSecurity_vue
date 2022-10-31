<template>
    <div v-loading="loading">
        <el-page-header @back="router_to('/main')" content="结算数据统计"></el-page-header>
        <el-form :inline="true" class="demo-form-inline" :model="search_form">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择" @change="update_enumerate_date">
                    <el-option v-for="enumerate_year in enumerate_data_dict.year" :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员类别:">
                <el-select v-model="search_form.person_type" multiple placeholder="请选择" clearable>
                    <el-option v-for="enumerate_person_type in enumerate_data_dict.person_type" :key="enumerate_person_type" :value="enumerate_person_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支付地点类别:">
                <el-select v-model="search_form.pay_place" multiple placeholder="请选择" clearable>
                    <el-option v-for="enumerate_pay_place in enumerate_data_dict.pay_place" :key="enumerate_pay_place" :value="enumerate_pay_place"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医院等级:">
                <el-select v-model="search_form.hospital_level" multiple placeholder="请选择" clearable>
                    <el-option v-for="enumerate_hospital_level in enumerate_data_dict.hospital_level" :key="enumerate_hospital_level" :value="enumerate_hospital_level"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="就诊凭证类型:">
                <el-select v-model="search_form.evidence_type" multiple placeholder="请选择" clearable>
                    <el-option v-for="enumerate_evidence_type in enumerate_data_dict.evidence_type" :key="enumerate_evidence_type" :value="enumerate_evidence_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="医疗类别:">
                <el-select v-model="search_form.cure_type" multiple placeholder="请选择" clearable>
                    <el-option v-for="enumerate_cure_type in enumerate_data_dict.cure_type" :key="enumerate_cure_type" :value="enumerate_cure_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算时间开始:">
                <el-select v-model="search_form.settle_date_start" placeholder="请选择" clearable>
                    <el-option v-for="enumerate_settle_date in enumerate_data_dict.settle_date" :key="enumerate_settle_date" :value="enumerate_settle_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算时间结束:">
                <el-select v-model="search_form.settle_date_end" placeholder="请选择" clearable>
                    <el-option v-for="enumerate_settle_date in enumerate_data_dict.settle_date" :key="enumerate_settle_date" :value="enumerate_settle_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员属性:">
                <el-select v-model="search_form.attribute" multiple placeholder="请选择" clearable>
                  <el-option v-for='enumerate_attribute in enumerate_data_dict.attribute' :key="enumerate_attribute" :label="enumerate_attribute" :value="enumerate_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="其他属性:">
                <el-select v-model="search_form.second_attribute" multiple placeholder="请选择" clearable>
                  <el-option v-for='enumerate_second_attribute in enumerate_data_dict.second_attribute' :key="enumerate_second_attribute" :label="enumerate_second_attribute" :value="enumerate_second_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="贫困状态:">
                <el-select v-model="search_form.poverty_state" multiple placeholder="请选择" clearable>
                  <el-option v-for='enumerate_poverty_state in enumerate_data_dict.poverty_state' :key="enumerate_poverty_state" :label="enumerate_poverty_state" :value="enumerate_poverty_state"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="乡镇:">
                <el-select v-model="search_form.town" placeholder="请选择" clearable multiple>
                  <el-option v-for='enumerate_town in enumerate_data_dict.town' :key="enumerate_town" :label="enumerate_town" :value="enumerate_town"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="村:">
                <el-select v-model="search_form.village" placeholder="请选择" clearable>
                  <el-option v-for='enumerate_village in enumerate_data_dict.village' :key="enumerate_village" :label="enumerate_village" :value="enumerate_village"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="search" icon="el-icon-search">搜索</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" round icon="el-icon-refresh" @click='reset'>重置</el-button>
            </el-form-item>
        </el-form>
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
</style>
    
<script>
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            "person_type": '', 
            "pay_place": '', 
            "hospital_level": '', 
            "evidence_type": '', 
            "cure_type": '', 
            "settle_date_start": '', 
            "settle_date_end": '', 
            "attribute": '', 
            "second_attribute": '', 
            "poverty_state": '', 
            "town": '', 
            "village": ''
          }, 
          settle_data_statistic: {}, 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
        }
      }, 
      created () {
        this.user_data = JSON.parse(localStorage.getItem('user_data'))
        if (this.user_data['authority'].indexOf('*')==-1 && this.user_data['authority'].indexOf('settle_data_statistic')==-1) {
          this.$router.push('/login')
        }
        else {
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
        }
      }, 
      methods: {
        update_enumerate_date: function() {
            this.enumerate_data_dict.settle_date = []
            for (let i=1;i<=12;i++) {
                if (i < 10) {
                    i = `0${i}`
                }
                this.enumerate_data_dict.settle_date.push(`${this.search_form.year}-${i}`)
            }
            this.search_form.settle_date_start = `${this.search_form.year}-01` 
            this.search_form.settle_date_end = `${this.search_form.year}-12`
        }, 
        set_default: function() {
            this.search_form.year = this.enumerate_data_dict.year.slice(-1)
            this.update_enumerate_date()
        }, 
        search: function() {
              this.loading = true
              const params_dict = {'params': {}}
              params_dict.params['settle_date'] = `${this.search_form.settle_date_start}_${this.search_form.settle_date_end}`
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
        reset: function () {
            for (let key in this.search_form) {
                this.search_form[key] = ''
            }
            this.set_default()
        }, 
        router_to: function(url) {
          this.$router.push(url)
        }, 
      }
}
</script>
