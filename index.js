require("webduino-js");
require("webduino-blockly");


var nodemailer = require('nodemailer');


const Web_crawler = require('./model/web_crawler');

web_crawler = new Web_crawler();



//web_crawler.crawler_7_11()

//web_crawler.crawler_plurk_xhr()

//web_crawler.crawler_eyny()

//web_crawler.crawler_taiwanlottery()
web_crawler.crawler_taiwanlottery()
//web_crawler.test_time()
