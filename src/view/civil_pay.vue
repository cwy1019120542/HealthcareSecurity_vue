<template>
    <div v-loading="loading">
      <el-page-header @back="router_to('/main')" content="公务员医疗补助测算"></el-page-header>
        <el-form :inline="true" :model="search_form" ref="search_form" :rules="rules">
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择"  @change="update_date()">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="身份证号:" class='id_number_form' prop="id_number">
                <el-input placeholder="请输入" v-model="search_form.id_number" clearable @keyup.enter.native="list_search(1)"></el-input>
            </el-form-item>
            <el-form-item label="开始日期:">
                <el-select v-model="search_form.date_start" placeholder="请选择"  clearable>
                    <el-option v-for="enumerate_pay_date in enumerate_data_dict.settle_date" :key="enumerate_pay_date" :value="enumerate_pay_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结束日期:">
                <el-select v-model="search_form.date_end" placeholder="请选择"  clearable>
                    <el-option v-for="enumerate_pay_date in enumerate_data_dict.settle_date" :key="enumerate_pay_date" :value="enumerate_pay_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search()" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" icon="el-icon-download" circle @click='download()'></el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="reset()" round icon="el-icon-refresh">重置</el-button>
            </el-form-item>
        </el-form>
        <div>
          <el-table :data="data.data" border stripe>
              <el-table-column label="序号" width="75" prop="number" header-align="center" align="center"></el-table-column>
                <el-table-column label="姓名" width="150" prop="name" header-align="center" align="center"></el-table-column>
                <el-table-column label="身份证号" width="175" prop="id_number" header-align="center" align="center"></el-table-column>
               <el-table-column label="公务员医疗补助起付线" width="175" prop="start_civil_pay" header-align="center" align="center"></el-table-column>
               <el-table-column label="公务员医疗补助范围内分段额度" width="250" prop="start_inner_pay" header-align="center" align="center"></el-table-column>
               <el-table-column label="公务员医疗补助拨付类型" width="500" prop="civil_pay_type" header-align="center" align="center"></el-table-column>
                <el-table-column label="公务员医疗补助范围内拨付" width="200" prop="civil_inner_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="公务员医疗补助范围外拨付" width="200" prop="civil_out_pay" header-align="center" align="center"></el-table-column>
                 <el-table-column label="公务员医疗补助总拨付" width="175" prop="civil_all_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="人员类别" width="100" prop="person_type" header-align="center" align="center"></el-table-column>
                <el-table-column label="医药机构地点类别" width="150" prop="hospital_place" header-align="center" align="center"></el-table-column>
                <el-table-column label="定点医药机构编号" width="150" prop="hospital_id" header-align="center" align="center"></el-table-column>
                <el-table-column label="定点医药机构名称" width="500" prop="hospital_name" header-align="center" align="center"></el-table-column>
                <el-table-column label="医院等级" width="100" prop="hospital_level" header-align="center" align="center"></el-table-column>
                <el-table-column label="开始日期" width="175" prop="start_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="结束日期" width="175" prop="end_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="结算日期" width="175" prop="settle_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="就诊凭证类型" width="125" prop="evidence_type" header-align="center" align="center"></el-table-column>
                <el-table-column label="总费用" width="100" prop="all_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="全自费金额" width="100" prop="self_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="超限价自费费用" width="150" prop="over_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="先行自付金额" width="150" prop="first_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="范围内费用" width="100" prop="inner_expense" header-align="center" align="center"></el-table-column>
                <el-table-column label="起付线" width="100" prop="start_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="统筹基金支出" width="150" prop="overall_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="大额医疗支出金额" width="150" prop="large_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="大病保险支出" width="150" prop="big_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="医疗救助支出" width="150" prop="rescue_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="公务员医疗补助" width="150" prop="civil_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="其他基金支付" width="150" prop="other_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="基金支付总额" width="150" prop="all_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="个人现金支付" width="150" prop="cash_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="个人账户支付" width="150" prop="account_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="账户共济支付金额" width="150" prop="together_pay" header-align="center" align="center"></el-table-column>
                <el-table-column label="病种名称" width="350" prop="illness_name" header-align="center" align="center"></el-table-column>
                <el-table-column label="医疗类别" width="200" prop="cure_type" header-align="center" align="center"></el-table-column>
                <el-table-column label="统筹基金支付比例" width="150" prop="overall_percent" header-align="center" align="center"></el-table-column>
                <el-table-column label="中心报销" width="125" prop="is_centre" header-align="center" align="center"></el-table-column>
                <el-table-column label="经办人员" width="125" prop="operator" header-align="center" align="center"></el-table-column>
                <el-table-column label="乡镇" width="100" prop="town" header-align="center" align="center"></el-table-column>
                <el-table-column label="村" width="125" prop="village" header-align="center" align="center"></el-table-column>
                <el-table-column label="备注" width="350" prop="remark" header-align="center" align="center"></el-table-column>
        </el-table>
        </div>
    </div>
</template>

<style scoped>
.el-form {
  margin: 1% 0;
}
</style>

<script>
import {authentication, update_date, search, reset, download} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            "id_number": '',
            'date_start': '', 
            'date_end': '', 
            'is_valid': '是', 
            'is_refund': '否', 
            'cure_type': ['普通住院', '外伤住院', '无他方责任意外伤害住院', '分疗程间断住院治疗', '单病种住院', '床日费用住院', '转外诊治住院', '急诊转住院', '自主就医住院', '门诊特病', '门诊慢病'], 
          }, 
          default_search_form: {}, 
          data: [], 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          authority: 'settle_data', 
          date_type: 'settle_date', 
          clean_request_field_list: ['combine_date'], 
          rules: {
            id_number: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
          ]}
        }
      }, 
      created () {
        authentication(this, 'default_year|year', false)
      }, 
      methods: {
        search: function() {
            this.$refs['search_form'].validate((valid) => {
            if (valid) {
              search(this, 'civil_pay/list')
            }
            else {
              return false
            }
          })
        },
        update_date: function() {
          update_date(this)
        }, 
        download: function() {
        this.$refs['search_form'].validate((valid) => {
            if (valid) {
              download(this, 'civil_pay/list/download')
            }
            else {
              return false
            }
          })
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
