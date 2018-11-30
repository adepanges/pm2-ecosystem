const { lstatSync, readdirSync } = require('fs')
const path = require('path')
var log_folder = 'zzz-logs';
const isDirectory = source =>  (
  lstatSync(source).isDirectory() &&
  (process_whitelist.indexOf(source) > -1) &&
  readdirSync('./'+source).map(name => path.join('./', name)).filter(file => (file == '.env')).length > 0
) 
const getApp = () => readdirSync('./').map(name => path.join('./', name)).filter(isDirectory)
const generateConf = (list_app) => {
  var conf = [];
  getApp().forEach((val, key) => {
    conf.push({
      name: val,
      script: 'server.js',
      cwd: path.resolve(__dirname, val),
      instances: 1,
      autorestart: false,
      watch: true,
      error_file:  path.resolve(__dirname, log_folder, val+'-error.log'),
      out_file:  path.resolve(__dirname, log_folder, val+'-out.log'),
      combine_logs: true,
      env: require('dotenv').config({ path: path.resolve(val, '.env') }).parsed,
      exec_mode : 'cluster'
    })
  })
  return conf
}

var process_whitelist = ['ms-accounts','ms-sso-server','ms-soco-public-api','ms-sociolla-public-api'];
module.exports = {
  apps : generateConf()
};
