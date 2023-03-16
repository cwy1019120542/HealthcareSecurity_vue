import fileDownload from 'js-file-download';

var status_dict = {
    400: '请求失败，请确认参数后重试', 
    401: '身份认证失败，请重新登录',
    413: '数据量过大，请分段下载', 
}

var update_date = function(self) {
    if (self.date_type == 'settle_date') {
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
function get_params(self) {
    var params_dict = {'params': {}}
    if (self.search_form.date_start && self.search_form.date_end) {
      params_dict.params[self.date_type] = `${self.search_form.date_start}|${self.search_form.date_end}`
    }
    if ('attribute' in self.search_form) {
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
    }
    for (let key in self.search_form) {
        params_dict = clean_params(params_dict, key, self.search_form[key])
    }
    return params_dict
}

function search(self, router, show_type=null) {
    self.loading = true
    const params_dict = get_params(self)
    self.$axios.get(`/user/${self.user_data['id']}/${router}`, params_dict).then((res)=>{
      self.loading = false
      self.data = res.data
      if ('show_type' in self) {
        self.show_type = show_type
      }
    }).catch(error=>{
        deal_error(self, error)
    })
}

var download = function(self, router) {
  self.loading = true
  const params_dict = get_params(self)
  params_dict['responseType'] = 'blob'
  self.$axios.get(`/user/${self.user_data['id']}/${router}/download`, params_dict).then((res)=>{
      self.loading = false
      fileDownload(res.data, res.headers.file_name)
    }).catch(error=>{
        deal_error(self, error)
    })
}


var authentication = function(self) {
    self.user_data = JSON.parse(localStorage.getItem('user_data'))
    if (self.user_data['authority'].indexOf('*')==-1 && self.user_data['authority'].indexOf(self.authority)==-1) {
        self.$router.push('/login')
    }
    else {
        for (let key in self.search_form) {
            self.default_search_form[key] = self.search_form[key]
        }
        self.$axios.get('/enumerate_data').then((res)=>{
        const data = res['data']['data'];
        self.enumerate_data_dict = data
        self.default_search_form.year = self.enumerate_data_dict.default_year
        if ('town' in self.search_form) {
            if (self.user_data.town) {
                self.default_search_form.town = [self.user_data.town]
                self.enumerate_data_dict.town = [self.user_data.town]
                self.enumerate_data_dict.village = self.enumerate_data_dict.town_village_dict[self.user_data.town]
                self.town_disabled = true
                }
        }
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
        reset(self)
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

var reset = function(self) {
    for (let key in self.default_search_form) {
          self.search_form[key] = self.default_search_form[key]
        }
    self.update_date(self)
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

export {authentication, update_date, update_town, update_village, reset, download, update_cure_type, deal_error, search, update_attribute}
