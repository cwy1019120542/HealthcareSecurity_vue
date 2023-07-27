<template>
    <div>
        <el-page-header @back="router_to('/main')" content="个人中心"></el-page-header>
         <el-descriptions class="table" :column="3" border>
            <el-descriptions-item>
            <template slot="label">
                <i class="el-icon-user"></i>
                用户名
            </template>
            {{user_data.name}}
            </el-descriptions-item>
            <el-descriptions-item>
            <template slot="label">
                <i class="el-icon-mobile-phone"></i>
                手机号
            </template>
            {{user_data.phone_number}}
            </el-descriptions-item>
            <el-descriptions-item>
            <template slot="label">
                <i class="el-icon-chat-line-round"></i>
                QQ
            </template>
            {{user_data.qq}}
            </el-descriptions-item>
            <el-descriptions-item>
            <template slot="label">
                <i class="el-icon-help"></i>
                身份
            </template>
            {{user_data.identity}}
            </el-descriptions-item>
            <el-descriptions-item>
            <template slot="label">
                <i class="el-icon-office-building"></i>
                乡镇
            </template>
            {{user_data.town}}
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<style scoped>
.table {
    margin-top: 2%;
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
    router_to: function(url) {
      this.$router.push(url)
    }, 
  }
}
</script>