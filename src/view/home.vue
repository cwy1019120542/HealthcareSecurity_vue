<template>
  <div class="main">
    <div class="top">
      <el-menu
          mode="horizontal"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
            <el-menu-item class="left_float" @click="router_to('/main')">潜山市医疗保障统计系统</el-menu-item>
            <el-menu-item class="right_float" @click="logout">注销</el-menu-item>
            <el-menu-item class="right_float" @click="router_to('/change_password')">{{user_data.name}}</el-menu-item>
            <el-menu-item class="right_float" @click="router_to('/change_password')">{{user_data.phone_number}}</el-menu-item>
            <el-menu-item class="right_float" v-if='user_data.village' @click="router_to('/change_password')">{{user_data.village}}</el-menu-item>
            <el-menu-item class="right_float" v-if="user_data.town" @click="router_to('/change_password')">{{user_data.town}}</el-menu-item>
            <el-menu-item class="right_float" @click="router_to('/change_password')">{{user_data.identity}}</el-menu-item>
        </el-menu>
    </div>
    <div class="aside">
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b">
          <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-management"></i>
            <span>参保数据</span>
          </template>
          <el-menu-item-group>
            <el-menu-item class="aside_option" v-if="is_in('insured_data')" index="1-1" @click="router_to('/insured_data')" >查询</el-menu-item>
            <el-menu-item class="aside_option" v-if="is_in('insured_data')" index="1-2" @click="router_to('/insured_rate')" >本地居民参保进度</el-menu-item>
            <el-menu-item class="aside_option" v-if="is_in('insured_data')" index="1-3" @click="router_to('/special_insured_rate')" >特殊人群参保进度</el-menu-item>
          </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-claim"></i>
            <span>结算数据</span>
          </template>
          <el-menu-item-group>
            <el-menu-item class="aside_option" v-if="is_in('settle_data')" @click="router_to('/settle_data')" index="2-１">查询</el-menu-item>
          </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-order"></i>
            <span>考核数据</span>
          </template>
          <el-menu-item-group>
            <el-menu-item class="aside_option" v-if="is_in('check_data')" @click="router_to('/staff')" index="3-１">查询</el-menu-item>
          </el-menu-item-group>
          </el-submenu>
        </el-menu>
    </div>
    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
  .el-menu {
    border-bottom: none;
  }
  .main {
    height: 100%;
    width: 100%;
  }
  .top {
    height: 8%;
    width: 100%;
    background-color: rgb(84, 92, 100);
  }
  .aside {
    height: 90%;
    width: 12%;
    background-color: rgb(84, 92, 100);
    float: left;
  }
  .container {
    width: 86%;
    height: 88%;
    float: right;
    margin: 1%;
    overflow: auto;
  }
  .el-menu--horizontal>.el-submenu .el-submenu__title {
    height: 100%;
  }
  .el-menu--horizontal, .el-menu-item, .el-submenu, .el-submenu__title {
    height: 100%;
    line-height: 70px;
  }
  .right_float, .left_float
  {
    border:0ch;
    vertical-align: middle;
  }
  .left_float {
    float: left;
    padding: 0px;
    width: 12%;
    text-align: center;
    font-size: 17px;
  }
  .right_float {
    float: right;
  }
  .aside_option {
    width: 100%;
    min-width: none;
  }
  .el-submenu .el-menu-item {
    min-width: 0;
  }
  .el-menu-vertical-demo {
    border: none;
  }
</style>

<script>
export default{
  data() {
    return {
      user_data: {}
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
    this.$axios.get(`/notify_data`).then((res)=>{
      for (let data of res.data.data) {
        this.$notify({
          title: data.title,
          message: data.content,
          duration: 0, 
          type: 'warning', 
          offset: 80, 
        });
      }
    }).catch(error=>{
      this.$message({ 
      showClose: true, 
      message: '获取通知出错', 
      type: 'error'
  })
    })
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
    }

  }
}
</script>

