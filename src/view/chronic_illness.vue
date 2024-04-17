<template>
    <div v-loading="loading" class="body">
        <el-page-header @back="router_to('/main')" :content='header_content'></el-page-header>
        <el-form :inline="true" class="demo-form-inline" :model="search_form">
            <el-form-item label="姓名:">
                <el-input placeholder="请输入（支持模糊查询）" v-model="search_form.name" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-form-item label="身份证号:">
                <el-input placeholder="请输入" v-model="search_form.id_number" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-form-item label="人员类别:">
                <el-select v-model="search_form.person_type_simple" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_person_type_simple in enumerate_data_dict.person_type_simple" :key="enumerate_person_type_simple" :value="enumerate_person_type_simple"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="人员属性:">
                <el-select v-model="search_form.attribute" multiple placeholder="请选择" clearable collapse-tags>
                  <el-option v-for='enumerate_attribute in enumerate_data_dict.attribute' :key="enumerate_attribute" :label="enumerate_attribute" :value="enumerate_attribute"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="病种名称:">
                <el-input placeholder="请输入（支持模糊查询）" v-model="search_form.illness_name" clearable @keyup.enter.native="search('list', 1)"></el-input>
            </el-form-item>
            <el-collapse accordion>
            <el-collapse-item>
              <template slot="title">
                更多查询
              </template>
              <el-form-item label="乡镇:" style="width: 18%">
                <el-select v-model="search_form.town" placeholder="请选择" @change="update_village()" :disabled='town_disabled' :clearable='!town_disabled' :multiple='!town_disabled' :collapse-tags='!town_disabled' >
                  <el-option v-for='enumerate_town in enumerate_data_dict.town' :key="enumerate_town" :label="enumerate_town" :value="enumerate_town"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="村居:">
                <el-select v-model="search_form.village" placeholder="请选择" clearable multiple collapse-tags>
                  <el-option v-for='enumerate_village in enumerate_data_dict.village' :key="enumerate_village" :label="enumerate_village" :value="enumerate_village"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="病种类别:">
                <el-select v-model="search_form.illness_type" multiple placeholder="请选择" clearable collapse-tags>
                    <el-option v-for="enumerate_illness_type in enumerate_data_dict.illness_type" :key="enumerate_illness_type" :value="enumerate_illness_type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="经办日期:">
              <el-date-picker
                    v-model="search_form.operate_date"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="人员属性快速筛选:">
                  <el-checkbox-group v-model="search_form.attribute_gather" @change="update_attribute()">
                    <el-checkbox-button v-for="enumerate_attribute_gather in enumerate_data_dict.attribute_gather" :label="enumerate_attribute_gather" :key="enumerate_attribute_gather">{{enumerate_attribute_gather}}</el-checkbox-button>
                  </el-checkbox-group>
            </el-form-item>
                </el-collapse-item>
          </el-collapse>
          <div class="button">
            <el-form-item>
                <el-button type="primary" @click="search('list', 1)" icon="el-icon-search">明细查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="search('statistic')" icon="el-icon-search">统计查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="info" round icon="el-icon-refresh" @click='reset()'>重置</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="warning" icon="el-icon-download" circle @click='download()'></el-button>
            </el-form-item>
          </div>
        </el-form>
        <div v-if='show_type=="statistic"'>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>条数</span>
            </div>
                <span>{{data.data.time_count}}</span>
            </el-card>
            <el-card class="box-card" shadow="hover">
            <div slot="header" class="clearfix">
                <span>人数</span>
            </div>
                <span>{{data.data.number_count}}</span>
            </el-card>
        </div>
        <div v-if='show_type=="list"' class="table">
            <el-table :data="data.data" stripe border height="100%" style="width: 100%">
                <el-table-column label="序号" width="75" prop="number" header-align="center" align="center"></el-table-column>
                <el-table-column label="姓名" width="150" prop="name" header-align="center" align="center"></el-table-column>
                <el-table-column label="身份证号" width="175" prop="id_number" header-align="center" align="center"></el-table-column>
                <el-table-column label="慢性病证" width="100" header-align="center" align="center">
                  <template slot-scope="scope">
                    <el-link type="primary" icon="el-icon-view" @click="create_card({'id_number': scope.row.id_number, 'town': scope.row.town})">查看</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="病种名称" width="350" prop="illness_name" header-align="center" align="center"></el-table-column>
                <el-table-column label="病种编号" width="125" prop="illness_number" header-align="center" align="center"></el-table-column>
                <el-table-column label="开始日期" width="175" prop="start_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="结束日期" width="175" prop="end_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="人员类别" width="100" prop="person_type_simple" header-align="center" align="center"></el-table-column>
                <el-table-column label="病种类型" width="175" prop="illness_type" header-align="center" align="center"></el-table-column>
                <el-table-column label="经办日期" width="175" prop="operate_date" header-align="center" align="center"></el-table-column>
                <el-table-column label="人员属性" width="350" prop="attribute" header-align="center" align="center"></el-table-column>
                <el-table-column label="乡镇" width="100" prop="town" header-align="center" align="center"></el-table-column>
                <el-table-column label="村居" width="125" prop="village" header-align="center" align="center"></el-table-column>
                <el-table-column label="手机号" width="350" prop="phone_number" header-align="center" align="center"></el-table-column>
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
            <el-dialog :visible.sync="dialogVisible" top=2% close-on-press-escape	close-on-click-modal>
              <div class='card'>
              <div class='card_title'>
                <p>个&emsp;人&emsp;慢&emsp;特&emsp;病&emsp;信&emsp;息&emsp;证</p>
              </div>
              <div class='card_content'>
                <p><span class='card_field_name'>姓&emsp;&emsp;&emsp;&emsp;&emsp;名:&emsp;&emsp;</span><span>{{card_data.name}}</span></p>
                <p><span class='card_field_name'>性&emsp;&emsp;&emsp;&emsp;&emsp;别:&emsp;&emsp;</span><span>{{card_data.sex}}</span></p>
                <p><span class='card_field_name'>身&emsp;份&emsp;证&emsp;号:&emsp;&emsp;</span><span>{{card_data.id_number}}</span></p>
                <p><span class='card_field_name'>病种及审批时间:</span><span>&emsp;&emsp;{{card_data.illness_data}}</span></p>
                <p><span class='card_field_name'>地&emsp;&emsp;&emsp;&emsp;&emsp;址:&emsp;&emsp;</span><span>{{card_data.address}}</span></p>
                <p class="tip">温馨提示：１.慢特病信息根据申请及医保政策动态调整，实际情况以医保信息系统为准。２.就医无需携带此证，凭医保电子凭证、社会保障卡及有效身份证件即可享受医保待遇。</p>
              </div>
              <div class="card_end">
                <p style="line-height: 4;margin-bottom: 0;">{{card_data.department}}</p>
                <p style="margin: 0;">{{card_data.now_date}}</p>
              </div>
            </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="download_card()">下 载</el-button>
                <el-button type="success" @click="print_card()">打 印</el-button>
              </span>
            </el-dialog>
        </div>
    </div>
</template>

<style scoped>
.tip {
  font-family: 'Courier New', Courier, monospace;
}
.card {
  /* width: 100%; */
  padding: 2% 10% 0 10%;
}
.card_title {
  text-align: center;
  width: 100%;
  font-size: 2.5em;
  font-weight: bold;
}
.card_field_name {
  font-weight: bold;
}
.card_content p {
  line-height: 2;
  font-size: 1.5em;
}
.card_end {
  text-align: right;
  font-size: 1.5em;
}
.el-form-item {
  margin-right: 2%;
}
.button {
  margin-top: 1%;
}
.el-card {
        width: 14%;
        text-align: center;
        display: inline-block;
        margin: 1%;
    }
.el-form {
  margin: 1% 0;
}
.body {
  height: 100%;
}
.table {
  width: 100%;
  height: 62%;
}
.el-pagination {
  margin-top: 1%;
}
</style>
    
<script>
import {authentication, update_town, update_village, reset, search, download, update_attribute, download_pdf, deal_error, print_pdf} from '../functools';
 export default {
      data() {
        return {
          search_form: {
            'name': '', 
            'id_number': '', 
            "person_type_simple": [], 
            "illness_name": '', 
            "illness_type": [], 
            "operate_date": [], 
            "attribute": [], 
            "town": [], 
            "village": [], 
            'hospital_community': [], 
            'page': 0, 
            'attribute_gather': [],
            'is_valid': '是', 
            'limit': 10, 
            'birthday': [], 
          }, 
          default_search_form: {}, 
          data: {}, 
          card_data: {}, 
          enumerate_data_dict: {}, 
          user_data: {}, 
          loading: false, 
          show_type: 'list', 
          authority: 'chronic_illness', 
          clean_request_field_list: ['attribute'], 
          limit_list: [10, 20, 50, 100], 
          town_disabled: false, 
          dialogVisible: false, 
          header_content: `慢特病数据查询（更新至${JSON.parse(localStorage.getItem('notify_data'))['operate_date']}）`, 
        }
      }, 
      created () {
        authentication(this, 'attribute_dict|town_village_dict|town|village|attribute_gather|attribute_gather_dict|person_type_simple|illness_type', false, ['town', 'attribute'])
      }, 
      methods: {
        search: function(show_type, page=0) {
          this.search_form.page = page
          search(this, `chronic_illness/${show_type}`, show_type)
        }, 
        download: function() {
          download(this, `chronic_illness/${this.show_type}/download`)
        },  
        router_to: function(url) {
          this.$router.push(url)
        }, 
        update_town: function() {
          update_town(this)
        }, 
        update_village: function() {
          update_village(this)
        }, 
        reset: function() {
          reset(this)
        }, 
        update_attribute: function() {
          update_attribute(this)
        }, 
        create_card: function(params) {
          this.loading = true
          this.$axios.get(`/user/${this.user_data['id']}/chronic_illness/list`, {'params': params}).then((res)=>{
            var illness_data_dict = {}
            var illness_data_list = []
            for (let person_data of res.data.data) {
              this.card_data.name = person_data.name
              this.card_data.sex = person_data.sex
              this.card_data.id_number = person_data.id_number
              var now_date = new Date()
              this.card_data.now_date = now_date.toLocaleDateString()
              if ((!(person_data.illness_name in illness_data_dict) || (person_data.illness_name in illness_data_dict && Date.parse(person_data.start_date)>Date.parse(illness_data_dict[person_data.illness_name]))) && (Date.parse(person_data.end_date)>=now_date)) {
                  illness_data_dict[person_data.illness_name] = person_data.start_date
              }
              if (person_data.village == '其他') {
                person_data.village = ''
              }
              this.card_data.address = `${person_data.town}${person_data.village}`
              if (person_data.town != '开发区') {
                this.card_data.department = `潜山市${person_data.town}人民政府`
              }
              else {
                this.card_data.department = '潜山市开发区管委会'
              }
            }
            for (var illness_name in illness_data_dict) {
              illness_data_list.push(`${illness_name}(${illness_data_dict[illness_name]})`)
            }
            this.card_data.illness_data = illness_data_list.join('、')
            // this.card_data.name = '***'
            // this.card_data.sex = '*'
            // this.card_data.id_number = '******************'
            // this.card_data.address = '******'
            // this.card_data.illness_data = '***(xx-xx-xx)'
            // this.card_data.department = '潜山市XXX人民政府'
            // this.card_data.now_date = 'xx-xx-xx'
            this.loading = false
            this.dialogVisible = true
          }).catch(error=>{
              deal_error(this, error)
          })
        }, 
        download_card: function() {
          download_pdf(document.querySelector('.card'), this.card_data.department, `${this.card_data.name}(${this.card_data.id_number})${this.card_data.address}`)
          this.$message({ 
            showClose: true, 
            message: '下载成功', 
            type: 'success'
        })
          this.dialogVisible = false
        }, 
        print_card: function() {
          print_pdf(document.querySelector('.card'), this.card_data.department)
          this.dialogVisible = false
        }
      }
}
</script>
