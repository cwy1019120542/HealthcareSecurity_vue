<template>
    <div class="body" v-loading="loading" >
        <el-carousel :interval="4000" type="card" height="90%">
            <el-carousel-item><el-image src="static/HealthcareSecurity.png" fit="fill"></el-image></el-carousel-item>
            <el-carousel-item><el-image src="static/main1.jpg" fit="fill"></el-image></el-carousel-item>
            <el-carousel-item><el-image src="static/main2.png" fit="fill"></el-image></el-carousel-item>
        </el-carousel>
        <div class="bottom">
            <div class="data">
                <div class='flex_data'>
                    <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                    <span>居民参保数据更新至</span>
                </div>
                    <span>{{pay_date}}</span>
                </el-card>
                <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                    <span>结算数据更新至</span>
                </div>
                    <span>{{settle_date}}</span>
                </el-card>
                <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                    <span>职工参保数据更新至</span>
                </div>
                    <span>{{work_insured_date}}</span>
                </el-card>
                </div>
                <div class='flex_data'>
                    <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                    <span>特殊人群身份更新至</span>
                </div>
                    <span>{{special_insured_date}}</span>
                </el-card>
                <el-card class="box-card" shadow="hover">
                <div slot="header" class="clearfix">
                    <span>慢特病数据更新至</span>
                </div>
                    <span>{{operate_date}}</span>
                </el-card>
                </div>
            </div>
            <div class="notify">
                <el-collapse accordion>
                <el-collapse-item  v-for='notify_data in notify_data_list' :key="notify_data.id">
                    <template slot="title">
                    <i class="header-icon el-icon-bell"></i>{{notify_data.operate_date}} : {{notify_data.title}}
                    </template>
                    <div>{{notify_data.content}}</div>
                </el-collapse-item>
                </el-collapse>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .el-card {
        width: 25%;
        text-align: center;
        margin: 3% 4%;
    }
    .el-carousel {
        height: 50%;
        width: 100%;
    }
    .el-carousel>div {
        height: 100%;
    }
    .el-image {
        height: 100%;
        width: 100%;
    }
    .bottom {
        display: flex;
        width: 100%;
        height: 45%;
    }
    .notify {
        border-top: solid 1px #e6e6e6;
        width: 40%;
        height: 45%;
    }
    .data {
        width: 50%;
        height: 100%;
        border: solid 1px #e6e6e6;
        margin-right: 5%;
    }
    .flex_data {
        display: flex;
    }

</style>

<script>
import {deal_error} from '../functools'; 
export default {
    data() {
        return {
            pay_date: '', 
            settle_date: '', 
            notify_data_list: [], 
            work_insured_date: '', 
            special_insured_date: '', 
            operate_date: '', 
            loading: false, 
        }
    }, 
    created() {
    this.loading = true
    this.$axios.get(`/notify_data`).then((res)=>{
        localStorage.setItem('notify_data', JSON.stringify(res.data))
        this.notify_data_list=res.data.data
        this.pay_date = res.data.pay_date
        this.settle_date = res.data.settle_date
        this.work_insured_date = res.data.work_insured_date
        this.special_insured_date = res.data.special_insured_date
        this.operate_date = res.data.operate_date
        this.loading = false
        }).catch(error=>{
        deal_error(this, error)
    })
  }, 
}
</script>
