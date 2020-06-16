const axios = require('axios');
const querystring = require('querystring');
const cheerio = require("cheerio");
const qs = require("qs");




module.exports = class crawler_models {



    crawler_taiwanlottery(){



        async function find_shop(){

            let taiwan_lotto_shop_1 = [], taiwan_lotto_shop_2 = []  
            
            const city_data_1 = await axios_lotto_1()

            for( let i=0 ; i < city_data_1[1].length ; i++ ){           // i < city_data_1[1].length  

                const city_data_2 = await axios_lotto_2( city_data_1[1][i], city_data_1[0] )

                taiwan_lotto_shop_1.push( [] )
                taiwan_lotto_shop_1[ i ].push(  city_data_1[1][i][1], city_data_2[1] )            
                

                for( var j=0 ; j < city_data_2[1].length ; j++ ){  // j < city_data_2[1].length

                    const city_data_3 = await axios_lotto_3(  city_data_2[1][j], city_data_2[0]  )

                    taiwan_lotto_shop_2.push( [] )
                    taiwan_lotto_shop_2[ taiwan_lotto_shop_2.length - 1 ].push(  city_data_2[1][j], city_data_3  )
                }
            }

            console.log( taiwan_lotto_shop_1 )  //所有縣市 和 區名,

            console.log( taiwan_lotto_shop_2 )    // 所有區名 和 區內的店家地址
        }


        find_shop()


        


        function axios_lotto_1(){  // 拿到所有城市代號 和 該初次使用網頁的驗證碼
            
            return  new Promise( function ( resolve, reject ){

                var that = this; var city_data_1 = []; 
                
                axios( {  method: 'get',  url: 'https://www.taiwanlottery.com.tw/Lotto/se/salelocation.aspx'  } )
                
                .then( function ( result ) {   
            
                    var $ = cheerio.load( result.data )

                    city_data_1.push( {} )

                    city_data_1[0][ "__VIEWSTATE" ] = $('#__VIEWSTATE').val()
                    city_data_1[0][ "__VIEWSTATEGENERATOR" ] = $('#__VIEWSTATEGENERATOR').val()
                    city_data_1[0][ "__EVENTVALIDATION" ] = $('#__EVENTVALIDATION').val()

                    city_data_1.push( [] )

                    $('#DropDownList1 option[value!=0]').each( function( i, elem ){
                        
                        city_data_1[1].push( [] )
                        city_data_1[1][i].push( $(this).attr('value'), $(this).text() )   // 城市代號, 城市名
                        
                    })
                    
                    resolve( city_data_1 )
                })  
                    
                .catch( function( err ){  console.log( err )  } ) 
            })
        }



        function axios_lotto_2(  city_i_data, axios_data ){     // 拿到該城市的驗證碼 和 該城市的所有鄉鎮名 
            
            return  new Promise( function ( resolve, reject ){

                var that = this, city_data_2 = []
 
                axios_data[ "DropDownList1" ] = city_i_data[0],  axios_data[ "DropDownList2" ] = '0'

                axios( {  
                    
                    method: 'post',  url: 'https://www.taiwanlottery.com.tw/Lotto/se/salelocation.aspx',
        
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    
                    data: qs.stringify( axios_data ) 
                } )
                    
                .then( function ( result ) {  
                    
                    var $ = cheerio.load( result.data )

                    city_data_2.push( {} )

                    city_data_2[0][ "__VIEWSTATE" ] = $('#__VIEWSTATE').val()
                    city_data_2[0][ "__VIEWSTATEGENERATOR" ] = $('#__VIEWSTATEGENERATOR').val()
                    city_data_2[0][ "__EVENTVALIDATION" ] = $('#__EVENTVALIDATION').val()
                    city_data_2[0][ "DropDownList1" ] = city_i_data[0]

                    city_data_2.push( [] )
                    
                    $('#DropDownList2 option[value!=0]').each( function(i, elem) {

                        city_data_2[ 1 ].push(  $(this).text()  )
                    })

                    resolve(  city_data_2  )
                })  
                    
                .catch( function ( err ) {  console.log( err ), reject( err )  } )                      
            })
        }



        function axios_lotto_3(  city_i_loacl, axios_data  ){     // 搜尋該區所有店家的地址 
            
            return  new Promise( function ( resolve, reject ){

                var that = this, city_local_shop = []

                axios_data[ "DropDownList2" ] = city_i_loacl,  axios_data[ "Button1" ] = "查詢"

                axios( {  
                    
                    method: 'post',  url: 'https://www.taiwanlottery.com.tw/Lotto/se/salelocation.aspx',
        
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    
                    data: qs.stringify( axios_data ) 
                } )
                    
                
                .then( function ( result ) {  
                    
                    var $ = cheerio.load( result.data )

                    $('.tableD.td_hm tbody tr[class!=thA]').each( function(i, elem) {

                        city_local_shop.push(  $(this).text()  )
                    })

                    resolve(  city_local_shop  ) 
                })
                    
                .catch( function ( err ) {  console.log( err ), reject( err )  } )                      
            })
        } 



    
    }

}
