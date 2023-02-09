import fileDownload from 'js-file-download';

var update_date = function(self) {
    if (self.data_type == 'settle_data') {
        self.enumerate_data_dict.settle_date = []
        for (let i=1;i<=12;i++) {
            if (i < 10) {
                i = `0${i}`
            }
        self.enumerate_data_dict.settle_date.push(`${self.search_form.year}-${i}`)
        }
    }
    else {
        self.enumerate_data_dict.pay_date = []
        for (let i=1;i<=12;i++) {
            if (i < 10) {
                i = `0${i}`
            }
            self.enumerate_data_dict.pay_date.push(`${parseInt(self.search_form.year)-1}-${i}`)
        }
        for (let i=1;i<=12;i++) {
            if (i < 10) {
                i = `0${i}`
            }
            self.enumerate_data_dict.pay_date.push(`${self.search_form.year}-${i}`)
        }
    }
    
}


function clean_params(params_dict, key, value) {
    if (value instanceof Array) {
            if (value.length) {
                params_dict.params[key] = value.join('_')
            }
            
        } 
        else {
            if (value) {
                params_dict.params[key] = value
            }
        }
    return params_dict
}
function get_params(self) {
    var params_dict = {'params': {}}
    if (self.search_form.date_start && self.search_form.date_end) {
      params_dict.params[self.date_type] = `${self.search_form.date_start}_${self.search_form.date_end}`
    }
    const reverse_attribute_dict = {}
    for (let attribute of self.search_form.attribute) {
        const reverse_attribute = self.enumerate_data_dict.reverse_attribute_dict[attribute]
        if (reverse_attribute in reverse_attribute_dict) {
            reverse_attribute_dict[reverse_attribute].push(attribute)
        }
        else {
            reverse_attribute_dict[reverse_attribute] = [attribute]
        }
    }
    for (let reverse_attribute in reverse_attribute_dict) {
        params_dict = clean_params(params_dict, reverse_attribute, reverse_attribute_dict[reverse_attribute])
    }
    for (let key in self.search_form) {
        params_dict = clean_params(params_dict, key, self.search_form[key])
    }
    return params_dict
}

function statistic_search(self) {
    self.loading = true
    self.is_list = false
    const params_dict = get_params(self)
    self.$axios.get(`/user/${self.user_data['id']}/${self.data_type}/statistic`, params_dict).then((res)=>{
      self.loading = false
      self.data_statistic = res.data['data']
    }).catch(error=>{
        self.loading = false
        self.$message({
          showClose: true, 
          message: '查询出错', 
          type: 'error'
      })
    })
}

function list_search(self, page) {
  self.loading = true
  self.is_list = true
  self.search_form.page = page
    const params_dict = get_params(self)
    self.$axios.get(`/user/${self.user_data['id']}/${self.data_type}/list`, params_dict).then((res)=>{
      self.loading = false
      self.data_list = res.data['data']
      self.data_count = res.data['data_count']
    }).catch(error=>{
        self.loading = false
        self.$message({
          showClose: true, 
          message: '查询出错', 
          type: 'error'
      })
    })
}

function download(self) {
  self.loading = true
  const params_dict = get_params(self)
  params_dict['responseType'] = 'blob'
  var download_type = 'list'
  if (!self.is_list) {
      download_type = 'statistic'
  }
  self.$axios.get(`/user/${self.user_data['id']}/${self.data_type}/${download_type}/download`, params_dict).then((res)=>{
      self.loading = false
      fileDownload(res.data, res.headers.file_name)
    }).catch(error=>{
        self.loading = false
        self.$message({
          showClose: true, 
          message: '无法下载，数据量需小于5万',  
          type: 'error'
      })
    })
}



function set_default(self) {
    self.search_form.year = self.enumerate_data_dict.default_year
    self.search_form.town = self.default_town
    self.enumerate_data_dict.village = self.default_village
    self.search_form.id_number = ''
    self.search_form.name = ''
    self.search_form.date_start = ''
    self.search_form.date_end = ''
    if (self.data_type == 'insured_data') {
        self.search_form.is_civil = ''
    }
    self.update_date()
}


var authentication = function(self) {
    self.user_data = JSON.parse(localStorage.getItem('user_data'))
    if (self.user_data['authority'].indexOf('*')==-1 && self.user_data['authority'].indexOf(self.data_type)==-1) {
        self.$router.push('/login')
    }
    else {
        self.$axios.get('/enumerate_data').then((res)=>{
        const data = res['data']['data'];
        self.enumerate_data_dict = data
        if (self.user_data.town) {
            self.search_form.town = [self.user_data.town]
            self.enumerate_data_dict.town = [self.user_data.town]
            self.enumerate_data_dict.village = self.enumerate_data_dict.town_village_dict[self.user_data.town]
            self.town_disabled = true
            self.default_town = [self.user_data.town]
            self.default_village = self.enumerate_data_dict.village
            }
        self.enumerate_data_dict.attribute = []
        self.enumerate_data_dict.reverse_attribute_dict = {}
        for (let key in self.enumerate_data_dict.attribute_dict) {
            const value_list = self.enumerate_data_dict.attribute_dict[key]
            for (let value of value_list) {
                self.enumerate_data_dict.attribute.push(value)
                self.enumerate_data_dict.reverse_attribute_dict[value] = key
             }
        }
        set_default(self)
        // list_search(self, 1)
        })
    }
}

var update_town = function(self) {
    self.search_form.town = []
    for (let hospital_community of self.search_form.hospital_community) {
        self.search_form.town = self.search_form.town.concat(self.enumerate_data_dict.hospital_community_dict[hospital_community])
    }
  }

var update_village = function(self) {
    self.search_form.village = []
    if (self.search_form.town.length) {
      self.enumerate_data_dict.village = []
      for (let town of self.search_form.town) {
        self.enumerate_data_dict.village = self.enumerate_data_dict.village.concat(self.enumerate_data_dict.town_village_dict[town])
      }
    }
    else {
      self.enumerate_data_dict.village = self.default_village
    }
  }

var reset = function(self) {
    for (let key in self.search_form) {
          self.search_form[key] = []
        }
    set_default(self)
}

var update_cure_type = function(self) {
    self.search_form.cure_type = []
    for (let cure_type_gather of self.search_form.cure_type_gather) {
        self.search_form.cure_type = self.search_form.cure_type.concat(self.enumerate_data_dict.cure_type_dict[cure_type_gather])
    }
  }

export {authentication, update_date, update_town, update_village, reset, list_search, statistic_search, download, update_cure_type}
