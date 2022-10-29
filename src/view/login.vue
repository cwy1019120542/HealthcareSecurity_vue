<template>
    <div class="main center" v-loading="loading">
        <div class="content">
            <el-form  :model="login_form">
                <div class='title'>
                    <p>潜山市医疗保障统计系统</p>
                </div>
                <el-form-item label="手机号:">
                    <el-input placeholder="请输入手机号" v-model="login_form.phone_number" prefix-icon="el-icon-phone-outline"></el-input>
                </el-form-item>
                <el-form-item label="密码:">
                    <el-input placeholder="请输入密码" v-model="login_form.password" prefix-icon="el-icon-s-check" show-password></el-input>
                </el-form-item>
                <el-form-item class='center'>
                    <el-button type="primary" @click="login" plain icon="el-icon-s-promotion">登陆</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<style scoped>
    .center {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .main {
        width: 100%;
        height: 100%;
    }
    .content {
        width: 20%;
        height: 35%;
        padding: 2% 5% 5% 5%;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        margin: 0 35%;
    }
    .title {
        text-align: center;
        font-weight: bolder;
        font-size: 2em;
    }
</style>

<script>
export default{
    data() {
        return {
            login_form: {
                'phone_number': '', 
                'password': ''
            }, 
            loading: false, 
        }
    }, 
    methods:{
        login: function() {
            this.loading = true
            this.$axios.post('/login', this.$qs.stringify(this.login_form)).then(res=>{
                this.loading = false
                localStorage.setItem('user_data', JSON.stringify(res.data.data))
                this.$router.push('/main')
            }).catch(error=>{
                this.loading = false
                this.$message({
                    showClose: true, 
                    message: '登录出错', 
                    type: 'error'
                })
            })
        }
    }
}
</script>