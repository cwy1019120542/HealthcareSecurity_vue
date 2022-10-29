<template>
    <div v-loading="loading">
        <el-page-header @back="router_to('/main')" content="修改密码"></el-page-header>
        <el-form :model="form" :rules="rules" ref="form">
            <el-form-item label="原密码:" prop="old_password">
                <el-input v-model="form.old_password" show-password prefix-icon="el-icon-delete-solid"></el-input>
            </el-form-item>
            <el-form-item label="新密码:" prop="new_password">
                <el-input v-model="form.new_password" show-password prefix-icon="el-icon-success"></el-input>
            </el-form-item>
            <el-form-item label="确认密码:">
                <el-input v-model="form.check_password" show-password prefix-icon="el-icon-s-help"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="change_password">确定修改</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped>
    .el-form {
        width: 30%;
        margin: 8% 35%;
    }
</style>

<script>
    export default {
        data() {
            return {
                user_data: {}, 
                form: {
                    'old_password': '', 
                    'new_password': '', 
                    'check_password': '', 
                }, 
                loading: false, 
                rules: {
                    old_password: [
                        { required: true, message: '请输入原密码', trigger: 'blur' },
                        { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
                    ], 
                    new_password: [
                        { required: true, message: '请输入新密码', trigger: 'blur' },
                        { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' }
                    ],
                }
            }
        }, 
        created() {
            this.user_data = JSON.parse(localStorage.getItem('user_data'))
        }, 
        methods: {
            router_to: function(url) {
                this.$router.push(url)
            }, 
            change_password: function() {
                this.$refs['form'].validate(valid=>{
                    if (valid) {
                        if (this.form.check_password!=this.form.new_password) {
                            this.$message({
                                showClose: true, 
                                message: '两次密码不一致', 
                                type: 'warning'
                            })
                        }
                        else {
                            this.loading = true
                            this.$axios.put(`/user/${this.user_data.id}/password`, this.$qs.stringify(this.form)).then(res=>{
                                this.loading = false
                                this.$message({
                                    showClose: true, 
                                    message: '修改成功', 
                                    type: 'success'
                                })
                                this.$router.push('/login')
                            }).catch(error=>{
                                this.loading = false
                                this.$message({
                                    showClose: true, 
                                    message: '修改出错', 
                                    type: 'error'
                                })
                            })
                        }
                    }
                    else {
                        return false;
                    }
                })
                
            }, 
            reset: function () {
                for (let key in this.form) {
                    this.form[key] = ''
                }
        }, 
        }
    }
</script>
