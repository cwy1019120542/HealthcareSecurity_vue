<template>
    <div class="main center" v-loading="loading">
        <div class="content">
            <div class='title'>
                <p>潜山市医疗保障统计系统</p>
            </div>
            <el-form  :model="login_form">
                <el-form-item label="手机号:" class='input'>
                    <el-input placeholder="请输入手机号" v-model="login_form.phone_number" prefix-icon="el-icon-phone-outline" @keyup.enter.native="login"></el-input>
                </el-form-item>
                <el-form-item label="密码:" class='input'>
                    <el-input placeholder="请输入密码" v-model="login_form.password" prefix-icon="el-icon-s-check" show-password @keyup.enter.native="login"></el-input>
                </el-form-item>
            </el-form>
            <div class="center button">
                <el-button type="primary" @click="login" icon="el-icon-s-promotion">登陆</el-button>
            </div>
            
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
        background: url('login.jpeg') no-repeat;
        background-size: 100% 100%;
    }
    .content {
        width: 20%;
        height: 35%;
        padding: 2% 3% 8% 3%;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12);
        border-radius: 30px;
        margin: 0 35%;
        background-color:white;
    }
    .title {
        text-align: center;
        font-size: 2em;
    }
    .el-button {
        width: 85%;
        margin: auto;
        height: 50%;
    }
    .button {
        margin: 15% 0 0 0;
    }
    .input {
        width: 85%;
        margin: auto auto 10% auto;
    }
</style>

<script>
import {deal_error} from '../functools';
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
                deal_error(this, error)
            })
        }
    }
}
</script>