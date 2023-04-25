<template>
    <div v-loading="loading">
      <el-page-header @back="router_to('/staff')" :content="header_content"></el-page-header>
        <el-form :inline="true" :model="search_form" class='serach_form'>
            <el-form-item label="年份:">
                <el-select v-model="search_form.year" placeholder="请选择" @change="update_date()">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考核日期开始:">
                <el-select v-model="search_form.date_start" placeholder="请选择" clearable>
                    <el-option v-for="enumerate_check_date in enumerate_data_dict.check_date" :key="enumerate_check_date" :value="enumerate_check_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考核日期结束:">
                <el-select v-model="search_form.date_end" placeholder="请选择" clearable>
                    <el-option v-for="enumerate_check_date in enumerate_data_dict.check_date" :key="enumerate_check_date" :value="enumerate_check_date"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="奖惩类型:">
                <el-select v-model="search_form.operate_type" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_operate_type in enumerate_data_dict.operate_type' :key="enumerate_operate_type" :value="enumerate_operate_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考核事项:">
                <el-select v-model="search_form.check_type" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_check_type in enumerate_data_dict.check_type' :key="enumerate_check_type" :value="enumerate_check_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考核渠道:">
                <el-select v-model="search_form.check_source" placeholder="请选择" clearable  multiple collapse-tags>
                  <el-option v-for='enumerate_check_source in enumerate_data_dict.check_source' :key="enumerate_check_source" :value="enumerate_check_source"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="list_search(1)" icon="el-icon-search">查询</el-button>
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
        <div>
          <el-table :data="data.data">
          <el-table-column label="序号" width="100" prop="number" header-align="center" align="center"></el-table-column>
          <el-table-column label="姓名" width="100" prop="name" header-align="center" align="center"></el-table-column>
          <el-table-column label="身份证号" width="200" prop="id_number" header-align="center" align="center"></el-table-column>
          <el-table-column label="奖惩类型" width="100" prop="operate_type" header-align="center" align="center"></el-table-column>
          <el-table-column label="考核事项" width="100" prop="check_type" header-align="center" align="center"></el-table-column>
          <el-table-column label="考核渠道" width="100" prop="check_source" header-align="center" align="center"></el-table-column>
          <el-table-column label="加分" width="100"  prop="get_point" header-align="center" align="center"></el-table-column>
          <el-table-column label="扣分" width="100"  prop="lost_point" header-align="center" align="center"></el-table-column>
          <el-table-column label="考核日期" width="200" prop="check_date" header-align="center" align="center"></el-table-column>
            <el-table-column label="备注" width="100" header-align="center" align="center">
            <template slot-scope="scope">
                   <el-link type="primary" :disabled='!scope.row.remark' :icon="{'el-icon-document': scope.row.remark}" @click="alert(scope.row.remark, '备注')">查看</el-link>
            </template>  
            </el-table-column>
        　<el-table-column label="附件" width="100" header-align="center" align="center">
            <template slot-scope="scope">
                   <el-link type="primary" :disabled='!scope.row.attachment_id' :icon="{'el-icon-takeaway-box': scope.row.attachment_id}">下载</el-link>
            </template>  
            </el-table-column>
        　<el-table-column label="记录人" width="100" prop="operator" header-align="center" align="center"></el-table-column>
        　<el-table-column label="记录时间" width="200" prop="operate_date" header-align="center" align="center"></el-table-column>
        </el-table>
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total='data.data_count'
          :current-page.sync='search_form.page'
          @current-change='list_search(search_form.page)'>
        </el-pagination>
        </div>
        <el-dialog title="新增考核事项" :visible.sync="is_dialog">
        <el-form :model="add_form">
            <el-form-item label="年份:" label-width='8%'>
                <el-select v-model="add_form.year" placeholder="请选择">
                  <el-option v-for='enumerate_year in enumerate_data_dict.year' :key="enumerate_year" :value="enumerate_year"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="奖惩类型:" label-width='8%'>
                <el-select v-model="add_form.operate_type" placeholder="请选择"  @change="update_check_type()">
                  <el-option v-for='enumerate_operate_type in enumerate_data_dict.operate_type' :key="enumerate_operate_type" :value="enumerate_operate_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考核事项:" label-width='8%'>
                <el-select v-model="add_form.check_type" placeholder="请选择"  @change="update_check_source()">
                  <el-option v-for='enumerate_check_type in enumerate_data_dict.check_type' :key="enumerate_check_type" :value="enumerate_check_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="考核渠道:" label-width='8%'>
                <el-select v-model="add_form.check_source" placeholder="请选择"  @change="update_point()">
                  <el-option v-for='enumerate_check_source in enumerate_data_dict.check_source' :key="enumerate_check_source" :value="enumerate_check_source"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="加分:" v-if="add_form.operate_type=='加分'" label-width='8%'>
                <el-input placeholder="请输入" v-model="add_form.get_point" clearable class='input'><template slot="append">分</template></el-input>
            </el-form-item>
            <el-form-item label="扣分:" v-if="add_form.operate_type=='扣分'" label-width='8%'>
                <el-input placeholder="请输入" v-model="add_form.lost_point" clearable class='input'><template slot="append">分</template></el-input>
            </el-form-item>
             <el-form-item label="考核日期:" label-width='8%'>
                <el-col>
                <el-date-picker type="date" placeholder="选择日期" v-model="add_form.check_date"></el-date-picker>
                </el-col>
            </el-form-item>
            <el-form-item label="备注:" label-width='8%'>
                <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="add_form.remark"
                maxlength="50"
                show-word-limit
                >
                </el-input>
            </el-form-item>
            <el-form-item label="附件:" label-width='8%'>
                <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                multiple
                :limit="3"
                :on-exceed="handleExceed"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="is_dialog = false">取 消</el-button>
            <el-button type="primary" @click="is_dialog = false">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<style scoped>
.serach_form {
  margin: 1% 0;
}
.el-table {
  margin: 0 1% 1% 1%;
}
.el-col-24 {
    width: 60%;
}
.input {
    width: 26%;
}
</style>

<script>
import {authentication, reset, search, download, update_date, alert} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            "year": '', 
            'id_number': this.$route.query.id_number, 
            'operate_type': [],  
            "check_type": [], 
            'check_source': [], 
            "date_start": '', 
            "date_end": '', 
            'page': 0, 
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
          }, 
          default_search_form: {}, 
          data: {}, 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          authority: 'check_data', 
          date_type: 'check_date', 
          header_content: '考核数据查询', 
          is_dialog: false, 
          label_width: '5%', 
        }
      }, 
      created () {
          if (this.$route.query.operate_type) {
              this.search_form.operate_type = [this.$route.query.operate_type]
          }
          if (this.$route.query.name) {
              this.header_content = `${this.header_content}：${this.$route.query.name}`
          }
        authentication(this, 'default_year|year|operate_type|check_dict', true, ['check'])
      }, 
      methods: {
        list_search: function(page) {
          this.search_form.page = page
          search(this, 'check_data/list')
        },
        download: function() {
          download(this, 'check_data/list')
        }, 
        router_to: function(url) {
          this.$router.push(url)
        }, 
        reset: function() {
          reset(this)
        }, 
        update_date: function() {
          update_date(this)
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
            this.add_form.check_type = []
            this.add_form.check_source = []
            this.add_form.get_point = 0
            this.add_form.lost_point = 0
            this.enumerate_data_dict.check_type = Object.keys(this.enumerate_data_dict.check_dict[this.add_form.operate_type])
        }, 
        update_check_source: function() {
            this.add_form.check_source = []
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
        }
    }, 
 }
</script>
