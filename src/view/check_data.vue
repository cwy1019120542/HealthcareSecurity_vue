<template>
    <div v-loading="loading" class="body">
      <el-page-header @back="router_to('/staff')" :content="header_content"></el-page-header>
        <el-form :inline="true" :model="search_form" class='serach_form'>
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考核日期:">
                <el-date-picker
                  v-model="search_form.check_date"
                  type="daterange"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="奖惩类型:">
                <el-select v-model="search_form.operate_type" placeholder="请选择"  @change="update_search_check_type()" clearable>
                  <el-option v-for='enumerate_operate_type in enumerate_data_dict.search_operate_type' :key="enumerate_operate_type" :value="enumerate_operate_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考核事项:">
                <el-select v-model="search_form.check_type" placeholder="请选择"  @change="update_search_check_source()" clearable>
                  <el-option v-for='enumerate_check_type in enumerate_data_dict.search_check_type' :key="enumerate_check_type" :value="enumerate_check_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考核渠道:">
                <el-select v-model="search_form.check_source" placeholder="请选择" clearable>
                  <el-option v-for='enumerate_check_source in enumerate_data_dict.search_check_source' :key="enumerate_check_source" :value="enumerate_check_source"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search('list', 1)" icon="el-icon-search">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" @click="reset()" round icon="el-icon-refresh">重置</el-button>
            </el-form-item>
            <el-form-item>
              <el-button type="warning" icon="el-icon-download" circle @click='download()'></el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="danger" icon="el-icon-plus" @click="update_add_form()">新增考核事项</el-button>
            </el-form-item>
        </el-form>
        <div class="table">
          <el-table :data="data.data" stripe border height="100%" style="width: 100%">
          <el-table-column label="序号" width="100" prop="number" header-align="center" align="center"></el-table-column>
          <el-table-column label="姓名" width="100" prop="name" header-align="center" align="center"></el-table-column>
          <el-table-column label="身份证号" width="200" prop="id_number" header-align="center" align="center"></el-table-column>
          <el-table-column label="奖惩类型" width="100" prop="operate_type" header-align="center" align="center"></el-table-column>
          <el-table-column label="考核事项" width="180" prop="check_type" header-align="center" align="center"></el-table-column>
          <el-table-column label="考核渠道" width="150" prop="check_source" header-align="center" align="center"></el-table-column>
          <el-table-column label="加分" width="100"  prop="get_point" header-align="center" align="center"></el-table-column>
          <el-table-column label="扣分" width="100"  prop="lost_point" header-align="center" align="center"></el-table-column>
          <el-table-column label="考核日期" width="100" prop="check_date" header-align="center" align="center"></el-table-column>
            <el-table-column label="备注" width="100" header-align="center" align="center">
            <template slot-scope="scope">
                   <el-link type="primary" :disabled='!scope.row.remark' icon="el-icon-document" @click="alert(scope.row.remark, '备注')">查看</el-link>
            </template>  
            </el-table-column>
        　<el-table-column label="附件" width="100" header-align="center" align="center">
            <template slot-scope="scope">
                   <el-link type="primary" :disabled='!scope.row.attachment_id' icon="el-icon-takeaway-box" @click="download_attachment(scope.row.attachment_id)">下载</el-link>
            </template>  
            </el-table-column>
        　<el-table-column label="记录人" width="100" prop="operator" header-align="center" align="center"></el-table-column>
        　<el-table-column label="记录时间" width="200" prop="operate_date" header-align="center" align="center"></el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="limit_list"
          :page-size.sync="search_form.limit"
          :total='data.data_count'
          :current-page.sync='search_form.page'
          @size-change="search('list', search_form.page)"
          @current-change="search('list', search_form.page)">
        </el-pagination>
        </div>
        <el-dialog title="新增考核事项" :visible.sync="is_dialog">
        <el-form :model="add_form" ref="add_form" :rules="rules">
            <el-form-item label="年份:" label-width='10%' prop="year">
                <el-select v-model="add_form.year" placeholder="请选择">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="奖惩类型:" label-width='10%' prop="operate_type">
                <el-select v-model="add_form.operate_type" placeholder="请选择"  @change="update_check_type()">
                  <el-option v-for='enumerate_operate_type in enumerate_data_dict.operate_type' :key="enumerate_operate_type" :value="enumerate_operate_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考核事项:" label-width='10%' prop="check_type">
                <el-select v-model="add_form.check_type" placeholder="请选择"  @change="update_check_source()">
                  <el-option v-for='enumerate_check_type in enumerate_data_dict.check_type' :key="enumerate_check_type" :value="enumerate_check_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考核渠道:" label-width='10%' prop="check_source">
                <el-select v-model="add_form.check_source" placeholder="请选择"  @change="update_point()">
                  <el-option v-for='enumerate_check_source in enumerate_data_dict.check_source' :key="enumerate_check_source" :value="enumerate_check_source"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="加分:" v-if="add_form.operate_type=='加分'" label-width='10%' prop="get_point">
                <el-input placeholder="请输入" v-model="add_form.get_point" clearable class='input'><template slot="append">分</template></el-input>
            </el-form-item>
            <el-form-item label="扣分:" v-if="add_form.operate_type=='扣分'" label-width='10%' prop="lost_point">
                <el-input placeholder="请输入" v-model="add_form.lost_point" clearable class='input'><template slot="append">分</template></el-input>
            </el-form-item>
             <el-form-item label="考核日期:" label-width='10%' prop="check_date">
                <el-col>
                <el-date-picker type="date" placeholder="选择日期" v-model="add_form.check_date" value-format="yyyy-MM-dd"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="备注:" label-width='10%'>
                <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="add_form.remark"
                maxlength="50"
                show-word-limit
                >
                </el-input>
            </el-form-item>
            <el-form-item label="附件:" label-width='10%'>
                <el-upload
                name='attachment'
                :on-success='upload_success'
                :on-error='upload_error'
                :action="action"
                ref="upload"
                :limit="1">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">文件大小不超过10MB</div>
                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="info" @click="dialog_reset()"  icon="el-icon-refresh">重置</el-button>
            <el-button @click="is_dialog = false"  icon="el-icon-circle-close">取 消</el-button>
            <el-button type="primary" @click="add()"  icon="el-icon-circle-check">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.el-form-item {
  margin-right: 2%;
}
.el-form {
  margin: 1% 0;
}
.body {
  height: 100%;
}
.table {
  width: 100%;
  height: 70%;
}
.el-pagination {
  margin-top: 1%;
}
</style>

<script>
import {authentication, reset, search, download, alert, deal_error, add} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            'id_number': this.$route.query.id_number, 
            'operate_type': '',  
            "check_type": '', 
            'check_source': '', 
            "check_date": [], 
            'page': 0, 
            'limit': 10, 
          }, 
          add_form: {
            "year": '', 
            'id_number': '', 
            'operate_type': '',  
            "check_type": '', 
            'check_source': '', 
            'get_point': 0, 
            'lost_point': 0, 
            "check_date": '', 
            'remark': '', 
            'attachment_id': '', 
          }, 
          default_search_form: {}, 
          default_add_form: {}, 
          data: {}, 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          authority: 'check_data', 
          header_content: '考核数据查询', 
          is_dialog: false, 
          label_width: '5%', 
          action: '', 
          clean_request_field_list: [], 
          limit_list: [10, 20, 50, 100], 
          rules: {
            year: [
            { required: true, message: '请选择年份', trigger: 'blur' },
          ],
          operate_type: [
            { required: true, message: '请选择奖惩类型', trigger: 'blur' },
          ],
          check_type: [
            { required: true, message: '请选择考核事项', trigger: 'blur' },
          ],
          check_source: [
            { required: true, message: '请选择考核渠道', trigger: 'blur' },
          ],
          get_point: [
            { required: true, message: '请输入分值', trigger: 'blur' },
          ],
          lost_point: [
            { required: true, message: '请输入分值', trigger: 'blur' },
          ],
          check_date: [
            { required: true, message: '请选择考核日期', trigger: 'blur' },
          ],
          }
        }
      }, 
      created () {
        if (this.$route.query.name) {
              this.header_content = `${this.header_content}：${this.$route.query.name}`
          }
        if (this.$route.query.operate_type) {
              this.search_form.operate_type = this.$route.query.operate_type
          }
        authentication(this, 'default_year|year|operate_type|check_dict', true, ['check'], ['search_form', 'add_form'], true)
        this.action = `${this.$axios.defaults.baseURL}/user/${this.user_data['id']}/check_attachment`
      }, 
      methods: {
        search: function(show_type, page=0) {
          this.search_form.page = page
          search(this, `check_data/${show_type}`, show_type)
        }, 
        download: function() {
          download(this, 'check_data/list/download')
        }, 
        router_to: function(url) {
          this.$router.push(url)
        }, 
        reset: function() {
          reset(this)
          this.enumerate_data_dict.search_check_type = []
          this.enumerate_data_dict.search_check_source = []
        }, 
        dialog_reset: function() {
          reset(this, false, 'add_form')
          this.enumerate_data_dict.check_type = []
          this.enumerate_data_dict.check_source = []
          this.$refs.upload.clearFiles()
          this.update_add_form()
        }, 
        alert: function(content, title) {
            alert(this, content, title)
        }, 
        update_add_form: function() {
            this.is_dialog = true
            this.add_form.id_number = this.search_form.id_number
            this.add_form.year = this.search_form.year
        }, 
        update_check_type: function() {
            this.add_form.check_type = ''
            this.add_form.check_source = ''
            this.add_form.get_point = 0
            this.add_form.lost_point = 0
            this.enumerate_data_dict.check_type = Object.keys(this.enumerate_data_dict.check_dict[this.add_form.operate_type])
        }, 
        update_check_source: function() {
            this.add_form.check_source = ''
            this.add_form.get_point = 0
            this.add_form.lost_point = 0
            this.enumerate_data_dict.check_source = Object.keys(this.enumerate_data_dict.check_dict[this.add_form.operate_type][this.add_form.check_type])
        }, 
        update_point: function() {
            if (this.add_form.operate_type=='加分') {
                this.add_form.get_point = this.enumerate_data_dict.check_dict[this.add_form.operate_type][this.add_form.check_type][this.add_form.check_source]
            }
            else {
                this.add_form.lost_point = this.enumerate_data_dict.check_dict[this.add_form.operate_type][this.add_form.check_type][this.add_form.check_source]
            }
        }, 
        update_search_check_type: function() {
            this.search_form.check_type = ''
            this.search_form.check_source = ''
            this.enumerate_data_dict.search_check_type = Object.keys(this.enumerate_data_dict.check_dict[this.search_form.operate_type])
        }, 
        update_search_check_source: function() {
            this.search_form.check_source = ''
            this.enumerate_data_dict.search_check_source = Object.keys(this.enumerate_data_dict.check_dict[this.search_form.operate_type][this.search_form.check_type])
        }, 
        upload_success: function(response, file, fileList) {
            this.add_form.attachment_id = response.data['attachment_id']
            this.$message({ 
            showClose: true, 
            message: '附件上传成功', 
            type: 'success'
        })
        }, 
        upload_error: function(err, file, fileList) {
          this.$message({ 
            showClose: true, 
            message: '附件上传失败', 
            type: 'error'
        })
        }, 
        add: function() {
          this.$refs['add_form'].validate((valid) => {
            if (valid) {
              add(this, 'check_data/list')
            }
            else {
              return false
            }
          })
        }, 
        download_attachment: function(attachment_id) {
          download(this, 'check_attachment', {'attachment_id': attachment_id})
        }, 
    }, 
 }
</script>
