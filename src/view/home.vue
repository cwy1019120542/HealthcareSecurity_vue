<template>
    <div class="body">
        <div class="top">
            <el-menu mode="horizontal" text-color="#409EFF" active-text-color="#ffd04b">
                <el-menu-item class="logo_name" @click="router_to('/main')"><el-avatar src="static/logo.svg" class='logo' index="1"></el-avatar>潜山市医疗保障统计系统</el-menu-item>
                <el-submenu index="2">
                    <template slot="title"><el-avatar src="static/pic.png" class='logo' shape="square"></el-avatar>{{user_data.name}}</template>
                    <el-menu-item index="2-1" @click="router_to('/user')">个人中心</el-menu-item>
                    <el-menu-item index="2-2" @click="router_to('/change_password')">更改密码</el-menu-item>
                    <el-menu-item index="2-3" @click="logout">注销</el-menu-item>
                </el-submenu>
            </el-menu>
        </div>
        <div class="main">
            <div class="aside">
                <el-menu active-text-color="#409EFF" class="aside_menu">
                    <el-menu-item index="1" @click="router_to('/main')">
                        <i class="el-icon-house"></i>
                        <span slot="title">主页</span>
                    </el-menu-item>
                    <el-submenu index="2"><template slot="title"><i class="el-icon-star-off"></i><span>参保数据</span></template>
                    <el-menu-item-group>
                        <el-menu-item class="aside_option" v-if="is_in('insured_data')" index="2-1" @click="router_to('/insured_data')" >查询</el-menu-item>
                        <el-menu-item class="aside_option" v-if="is_in('insured_data')" index="2-2" @click="router_to('/insured_rate')" >本地居民参保进度</el-menu-item>
                        <el-menu-item class="aside_option" v-if="is_in('insured_data')" index="2-3" @click="router_to('/special_insured_rate')" >特殊人群参保进度</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-money"></i>
                        <span>结算数据</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item class="aside_option" v-if="is_in('settle_data')" @click="router_to('/settle_data')" index="3-１">查询</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <el-menu-item class="aside_option" v-if="is_in('settle_data')" @click="router_to('/settle_rate')" index="3-2">直接结算率</el-menu-item>
                    </el-menu-item-group>
                    <el-menu-item-group>
                        <el-menu-item class="aside_option" v-if="is_in('settle_data')" @click="router_to('/evidence_rate')" index="3-3">医保码结算率</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-timer"></i>
                        <span>慢特病数据</span>
                    </template>
                    <el-menu-item-group>
                        <el-menu-item class="aside_option" v-if="is_in('chronic_illness')" @click="router_to('/chronic_illness')" index="4-１">查询</el-menu-item>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="5">
                <template slot="title">
                    <i class="el-icon-notebook-2"></i>
                    <span>考核数据</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item class="aside_option" v-if="is_in('check_data')" @click="router_to('/staff')" index="5-１">查询</el-menu-item>
                </el-menu-item-group>
                </el-submenu>
                <el-submenu index="6">
                <template slot="title">
                    <i class="el-icon-pie-chart"></i>
                    <span>支出测算</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item class="aside_option" v-if="is_in('settle_data')" @click="router_to('/civil_pay')" index="6-１">公务员医疗补助</el-menu-item>
                </el-menu-item-group>
                </el-submenu>
                <el-submenu index="7">
                <template slot="title">
                    <i class="el-icon-sold-out"></i>
                    <span>数据导出</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item class="aside_option" v-if="is_in('settle_data')" @click="router_to('/open_data')" index="7-１">政务公开数据</el-menu-item>
                </el-menu-item-group>
                </el-submenu>
                </el-menu>
            </div>
            <div class="content">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .body {
        height: 100%;
        width: 100%;
    }
    .logo {
        margin-right: 10%;
    }
    .logo_name {
        margin-right: 75%;
        font-weight: bold;
        font-size: 1em;
    }
    .aside {
        width: 10%;
        overflow: auto;
        height: 100%;
    }
    .aside_option {
        min-width: 10%;
    }
    .aside_menu {
        border-right: none;
    }
    .top {
        height: 8%;
    }
    .main {
        height: 90%;
        display: flex;
    }
    .content {
        width: 85%;
        height: 95%;
        margin: 0% 2%;
    }
</style>

<script>
export default{
  data() {
    return {
      user_data: {},
    }
  }, 
  created() {
    const user_data = JSON.parse(localStorage.getItem('user_data'))
    if (!user_data) {
      this.$router.push('/login')
    }
    else {
      this.user_data = user_data
    }
  }, 
  methods: {
    is_in: function(value) {
      if (this.user_data['authority'].indexOf(value)!=-1 || this.user_data['authority'].indexOf('*')!=-1) {
        return true
      }
      else {
        return false
      }
    }, 
    router_to: function(url) {
      this.$router.push(url)
    }, 
    logout: function() {
      localStorage.removeItem('user_data')
      this.$router.push('/login')
    }, 
  }
}
</script>