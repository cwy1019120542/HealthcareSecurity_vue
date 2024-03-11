import fileDownload from 'js-file-download';

var status_dict = {
    400: '请求失败，请确认参数后重试', 
    401: '身份认证失败，请重新登录',
    413: '数据量过大，请分段下载', 
    404: '请求失败，请确认参数后重试', 
}

var deal_error = function(self, error) {
    self.loading = false
    self.$message({ 
      showClose: true, 
      message: status_dict[error.response.status], 
      type: 'error'
  })
}


function clean_params(params_dict, key, value) {
    if (value instanceof Array) {
        if (value.length) {
                params_dict.params[key] = value.join('|')
            }
        } 
    else {
        if (value) {
            params_dict.params[key] = value
        }
    }
    return params_dict
}

var clean_request_field_dict = {
    'attribute': function(self, params_dict) {
        if ('attribute' in params_dict.params) {
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
            delete params_dict.params.attribute
        }
        return params_dict
    }, 
    'local_hospital': function(self, params_dict) {
        if (self.search_form.local_hospital_id.length) {
            const params_hospital_id_list = []
            for (let hospital_id_list of self.search_form.local_hospital_id) {
                for (let hospital_id of hospital_id_list) {
                    if (!params_hospital_id_list.includes(hospital_id)) {
                        params_hospital_id_list.push(hospital_id)
                    }
                }
            }
            params_dict.params.hospital_id = params_hospital_id_list.join('|')
        }
        delete params_dict.params.local_hospital_id
        return params_dict
    }, 
}



function get_params(self) {
    var params_dict = {'params': {}}
    for (let key in self.search_form) {
        params_dict = clean_params(params_dict, key, self.search_form[key])
    }
    for (let field of self.clean_request_field_list) {
        params_dict = clean_request_field_dict[field](self, params_dict)
    }
    return params_dict
}

function search(self, router, show_type=null) {
    self.loading = true
    self.$axios.get(`/user/${self.user_data['id']}/${router}`, get_params(self)).then((res)=>{
      self.loading = false
      self.data = res.data
      if ('show_type' in self) {
        self.show_type = show_type
      }
    }).catch(error=>{
        deal_error(self, error)
    })
}

var add = function(self, router) {
    self.loading = true
    self.$axios.post(`/user/${self.user_data['id']}/${router}`, self.$qs.stringify(self.add_form)).then((res)=>{
      self.loading = false
      self.$message({ 
        showClose: true, 
        message: '添加成功', 
        type: 'success'
    })
    self.is_dialog = false
    self.search('list', 1)
    }
    ).catch(error=>{
        deal_error(self, error)
    })
}

var download = function(self, router, download_params=null) {
  self.loading = true
  var params_dict = {}
  if (!download_params) {
    params_dict = get_params(self)
  }
  else {
    params_dict = {'params': download_params}
  }
  params_dict['responseType'] = 'blob'
  self.$axios.get(`/user/${self.user_data['id']}/${router}`, params_dict).then((res)=>{
      self.loading = false
      fileDownload(res.data, res.headers.file_name)
      self.$message({ 
        showClose: true, 
        message: '下载成功', 
        type: 'success'
    })
    }).catch(error=>{
        deal_error(self, error)
    })
}

var clean_enumerate_func_dict = {
    'town': function(self) {
        if ('town' in self.search_form) {
            if (self.user_data.town) {
                self.default_search_form.town = [self.user_data.town]
                self.enumerate_data_dict.town = [self.user_data.town]
                self.enumerate_data_dict.village = self.enumerate_data_dict.town_village_dict[self.user_data.town]
                self.town_disabled = true
                }
            else {
                self.enumerate_data_dict.village = []
            }
        }
    }, 
    'attribute': function(self) {
        if ('attribute' in self.search_form) {
            self.enumerate_data_dict.attribute = []
            self.enumerate_data_dict.reverse_attribute_dict = {}
            for (let key in self.enumerate_data_dict.attribute_dict) {
                const value_list = self.enumerate_data_dict.attribute_dict[key]
                for (let value of value_list) {
                    self.enumerate_data_dict.attribute.push(value)
                    self.enumerate_data_dict.reverse_attribute_dict[value] = key
                 }
            }
        }
    }, 
    'check': function(self) {
        self.enumerate_data_dict.check_type = []
        self.enumerate_data_dict.check_source = []
        self.enumerate_data_dict.search_operate_type = self.enumerate_data_dict.operate_type
        if (self.search_form.operate_type) {
            self.enumerate_data_dict.search_check_type = Object.keys(self.enumerate_data_dict.check_dict[self.search_form.operate_type])
        }
        else {
            self.enumerate_data_dict.search_check_type = []
        }
        self.enumerate_data_dict.search_check_source = []
    }, 
    'local_hospital': function(self) {
        for (let hospital in self.enumerate_data_dict.local_hospital_dict) {
            const children_hospital_list = self.enumerate_data_dict.local_hospital_dict[hospital]
            const hospital_dict = {value: self.enumerate_data_dict.hospital_name_id_dict[hospital], label: hospital}
            if (children_hospital_list.length) {
                hospital_dict['children'] = []
                for (let children_hospital of children_hospital_list) {
                    hospital_dict['children'].push({value: self.enumerate_data_dict.hospital_name_id_dict[children_hospital], label: children_hospital})
                }
            }
            self.local_hospital_list.push(hospital_dict)
        }
    }
}


var authentication = function(self, enumerate_field, is_search=false, enumerate_func_list=[], default_form_list=['search_form']) {
    self.user_data = JSON.parse(localStorage.getItem('user_data'))
    if (self.user_data['authority'].indexOf('*')==-1 && self.user_data['authority'].indexOf(self.authority)==-1) {
        self.$router.push('/login')
    }
    else {
        for (let form_name of default_form_list) {
            for (let key in self[form_name]) {
                self[`default_${form_name}`][key] = self[form_name][key]
            }
        }
        self.$axios.get('/enumerate_data', {'params': {'enumerate_field': enumerate_field}}).then((res)=>{
        const data = res['data']['data'];
        self.enumerate_data_dict = data
        self.default_search_form.year = self.enumerate_data_dict.default_year
        self.default_search_form.compare_year = (self.enumerate_data_dict.default_year - 1).toString()
        for (let enumerate_func of enumerate_func_list) {
            clean_enumerate_func_dict[enumerate_func](self)
        }
        reset(self, is_search)
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
          for (let village of self.enumerate_data_dict.town_village_dict[town]) {
              if (!self.enumerate_data_dict.village.includes(village)) {
                self.enumerate_data_dict.village.push(village)
              }
          }
      }
    }
    else {
      self.enumerate_data_dict.village = self.default_village
    }
  }

var reset = function(self, is_search=false, form_name='search_form') {
    for (let key in self[form_name]) {
          self[form_name][key] = self[`default_${form_name}`][key]
        }
    if ('village' in self[form_name]) {
        self.enumerate_data_dict.village = []
    }
    if (is_search) {
        self.search('list', 1)
    }
}

var update_cure_type = function(self) {
    self.search_form.cure_type = []
    for (let cure_type_gather of self.search_form.cure_type_gather) {
        self.search_form.cure_type = self.search_form.cure_type.concat(self.enumerate_data_dict.cure_type_dict[cure_type_gather])
    }
  }

var update_attribute = function(self) {
    self.search_form.attribute = []
    for (let attribute_gather of self.search_form.attribute_gather) {
        self.search_form.attribute = self.search_form.attribute.concat(self.enumerate_data_dict.attribute_gather_dict[attribute_gather])
    }
  }

var alert = function(self, content, title) {
    self.$alert(content, title, {confirmButtonText: '确定'})
}

export {authentication, update_town, update_village, reset, download, update_cure_type, deal_error, search, update_attribute, alert, add}
