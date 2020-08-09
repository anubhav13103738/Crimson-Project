var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
var path =require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/productImages' });
var mongoClient = require('mongodb').MongoClient;

var db;
var adsdb;
var jsonobj;


mongoClient.connect(process.env.MONGOURI,(err,database)=> {
    if(err)console.log('can\'t connect ' + err);
else
{
    db = database;
    //console.log(db);
}
});

app.use('/chatroom',express.static('chatroom'));
app.use(bodyParser.urlencoded({extended: true}));
app.use('/bootstrap', express.static('bootstrap'));
app.use('/css', express.static('css'));
app.use('/images', express.static('images'));
app.use('/uploads/productImages', express.static('uploads/productImages'));
app.use('/js', express.static('js'));
app.use('/json', express.static('json'));
app.use('/server', express.static('server'));
app.use('/sparoutes', express.static('sparoutes'));
app.use('/libs', express.static('libs'));
app.use(cookieParser());
app.use(session({secret:'keyboard cat',resave:false,saveUninitialized:true}))

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'))
});
app.post('/removal',(req,res)=>{
    console.log(req.body.user);
    db.collection('products').deleteOne({"picturename":req.body.user}).then(function(err){
       console.log('deleted');
    });
    res.redirect('/dashboard');
});
app.get('/samsung.html',function(req,res){
    res.sendFile(path.join(__dirname+'/samsung.html'))
})
app.get('/xiaomi.html',function(req,res){
    res.sendFile(path.join(__dirname+'/xiaomi.html'))
})
app.get('/apple.html',function(req,res){
    res.sendFile(path.join(__dirname+'/apple.html'))
})
app.get('/ipad.html',function(req,res){
    res.sendFile(path.join(__dirname+'/ipad.html'))
})
app.get('/micromax.html',function(req,res){
    res.sendFile(path.join(__dirname+'/micromax.html'))
})
app.get('/hp.html',function(req,res){
    res.sendFile(path.join(__dirname+'/hp.html'))
})
app.get('/bravia.html',function(req,res){
    res.sendFile(path.join(__dirname+'/bravia.html'))
})
app.get('/lg.html',function(req,res){
    res.sendFile(path.join(__dirname+'/lg.html'))
})
app.get('/lloyd.html',function(req,res){
    res.sendFile(path.join(__dirname+'/lloyd.html'))
})
app.get('/index.html', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'))
});
app.get('/category', function(req, res) {
    res.sendFile(path.join(__dirname+'/category.html'))
});


/*app.get('/postad',(req,res)=>{
    res.sendFile(path.join(__dirname+'/ads/postad.html'))
});*/


app.post('/postad',(req,res)=>{
   res.sendFile(path.join(__dirname+'/ads/postad.html')) 
});

app.post('/postproduct',upload.single('image'),(req,res)=>{
    //console.log(JSON.stringify(req.file));
    //console.log(req.file.filename);
    db.collection('products').insertOne({'productname':req.body.productName,'productdesc':req.body.productDesc,'productprice':req.body.price,
                                    'sellername':req.body.sellerName,'email':req.body.mailid,'mobile':req.body.phone,
                                    'picturename':req.file.filename},function (err,result) {
                                                    if(err){
                                                        console.log('problem in entering in database:'+err);
                                                        //db.close();
                                                    }
                                                    else{console.log('entered successfully');
                                                    //db.close();
                                                    }
});

/*fs.readFile(path.join(__dirname+'/ads/sample3.html'),(err,data1)=>{
    if(err){throw err;}
    datay=data1;
    fs.writeFile(path.join(__dirname+'/adproducts/'+req.body.productName+req.body.sellerName),datay,'utf8',(err)=>{
        if(err){
            throw err;
        }
        else{
            fs.appendFile(path.join(__dirname+'/adproducts/'+req.body.productName+req.body.sellerName),"<table class='table'><tr><img src='../uploads/productImages/"+req.file.filename+"' height='800px' width='600px'>  </tr><tr><th>Name:</th><td>"+req.body.productName+"  </td></tr><tr><th>Description:</th><td>"+req.body.productDesc+"  </td></tr><tr><th>Price:<td>Rs."+req.body.price+"  </td></th></tr><tr><th>Seller:</th><td>"+req.body.sellerName+"  </td></tr><tr><th>Contact:"</th><td>Email:"+req.body.mailid+"  </td><td>Mob:"+req.body.phone+"  </td></tr></table>
",'utf8',(err)=>{
            if(err){throw err;}
            else{
                fs.readFile(path.join(__dirname+'/ads/sample2.html'),(err,data2)=>{
                datax=data2;
                fs.appendFile(path.join(__dirname+'/adproducts/'+req.body.productName+req.body.sellerName),datax,'utf8',(err)=>{
                    if(err){throw err;}
                    else{console.log('file created');}
                })
            })
            }
        });
        }
    })
});*/
res.redirect('/dashboard');
});
//login starts
app.get('/register',(req,res)=>{
    res.sendFile(path.join(__dirname+'/login/register.html'));
});


app.get('/login',(req,res)=>{
   res.sendFile(path.join(__dirname+'/login/login.html'));
});


app.post('/loggedin',(req,res)=> {
    //if(db.collection('Users').find({$and}:[{"userid":req.body.email},{"password":req.body.password}])){
    var in1 = db.collection('Users').findOne({$and: [{"userid": req.body.email}, {"password": req.body.password}]}).then(
        function (in1) {
            if (in1) {
                //console.log(in1);
                //res.sendFile(path.join(__dirname+'/ads/ads.html'));
                /*console.log(req.session.user);
                console.log('**************************************');*/
                req.session.user=in1;
                //console.log(req.session.user);
                res.redirect('/dashboard');
                jsonobj=in1;
                //console.log(jsonobj);
                //db.close();
            }
            else {
                res.sendFile(path.join(__dirname+'/login/loginagain.html'));
                //db.close();
            }

        }
    );
});

app.post('/loginagain',(req,res)=>{
    var in1 = db.collection('Users').findOne({$and: [{"userid": req.body.email}, {"password": req.body.password}]}).then(
        function (in1) {
            if (in1) {
                //console.log(in1);
                //res.sendFile(path.join(__dirname+'/ads/ads.html'));
                req.session.user=in1;
                res.redirect('/dashboard');
                jsonobj=in1;
                //console.log(jsonobj);
                //db.close();
            }
            else {
                res.sendFile(path.join(__dirname+'/login/loginagain.html'));
                //db.close();
            }

        }
    );
res.sendFile(path.join(__dirname+'/login/loginagain.html'));    
});

app.get('/dashboard',(req,res)=>{
   if(!req.session.user){
    res.redirect('/loginagain');
}

/*db.collection('products').find().toArray().then(function(docs){
    adsdb=docs;
    //console.log(adsdb);
    res.sendFile(path.join(__dirname+'/ads/ads.html'));
});*/
res.sendFile(path.join(__dirname+'/ads/ads.html'));
});

app.get('/dbjson',(req,res)=>{
    db.collection('products').find().toArray().then(function(docs){
    adsdb=docs;
    //console.log(adsdb);
    //res.sendFile(path.join(__dirname+'/ads/ads.html'));
    res.json(adsdb);
});
});

app.get('/yourjson',(req,res)=>{
    //console.log(req.session.user);
    //console.log(req.session.user.userid);
    db.collection('products').find({"email":req.session.user.userid}).toArray().then(function (docs1){
    res.json(docs1);
});
});

app.get('/yourads',(req,res)=>{
    res.sendFile(path.join(__dirname+'/ads/yourads.html'));
});

app.get('/logout',(req,res)=>{
    req.session.destroy();
res.redirect('/');
})
app.get('/chat',(req,res)=>{
    res.sendFile(path.join(__dirname+'/chatroom/public/index.html'));
});
app.post('/registered',(req,res)=> {
    if(req.body.password===req.body.repassword){
    var data={"name":req.body.fullname,"userid":req.body.email,"password":req.body.password};
    db.collection('Users').save(data,(err,result)=>{
        if(err){
            console.log(err);
            //db.close();
            return;
        }
        else{console.log('check db');
       // db.close();
}
});
    res.sendFile(path.join(__dirname+'/login/login.html'));
}else{
    console.log('pass!=repass');
    res.sendFile(path.join(__dirname+'/login/register.html'));
}
});


//login ends

app.get('/redminote3', function(req, res){

    url = 'http://www.amazon.in/gp/product/B01C2T6IDY/ref=br_asw_pdt-3/255-5256393-4509514?pf_rd_m=A1VBAL9TL5WCBF&pf_rd_s=desktop-1&pf_rd_r=1KH091S2WNDD20J1AWWW&pf_rd_t=36701&pf_rd_p=bf0ef2fd-53e8-410d-9756-b13a70e28cb8&pf_rd_i=desktop';
    url1 = 'https://www.snapdeal.com/product/redmi-note3-32gb/654134757432#bcrumbSearch:redmi%20note%203';
    url2 ='http://www.ebay.in/itm/Xiaomi-Redmi-Note-3-3GB-Ram-32GB-Rom-16-Mp-Camera-Gold-/182302480502?hash=item2a72131876:g:CIMAAOSwmfhX6oYI';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
                //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
                json.image='http://cdn.ndtv.com/tech/images/redmi_note_3_gold_all_sides.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();
                //release = data.children().last().children().text();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();


                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();


                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+json.name+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })

        res.sendFile(path.join(__dirname+'/products/xiaomiredminote3.html'))

    }) ;
})
app.get('/samsungon5', function(req, res){

    url = 'http://www.amazon.in/Samsung-Galaxy-On5-SM-G550F-Gold/dp/B01D1A5096/ref=sr_1_5?s=electronics&ie=UTF8&qid=1476033898&sr=1-5&keywords=samsung+on5';
    url1 = 'https://www.snapdeal.com/product/samsung-on5-8gb/627055373428#bcrumbSearch:samsung%20on%205|bcrumbLabelId:12';
    url2 ='http://www.ebay.in/itm/SAMSUNG-Galaxy-On5-Gold-8-GB-1-Year-Manufacturer-Warrnty-/222272804419?hash=item33c07dd643:g:HgYAAOSwCGVX9inU';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://files.gsmchoice.com/news/6311/on5-22822.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+json.name+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/samsungon5.html'))

    }) ;
})
app.get('/whowillcry', function(req, res){



    url = 'http://www.amazon.in/Who-Will-Cry-When-You/dp/8179929787/ref=sr_1_2?s=books&ie=UTF8&qid=1476126590&sr=1-2&keywords=who+will+cry+when+you+die';
    url1 = 'https://www.snapdeal.com/product/who-will-cry-when-you/625073058812#bcrumbSearch:who%20will%20cry%20when%20you%20die|bcrumbLabelId:364';
    url2 ='http://www.ebay.in/itm/Who-Will-Cry-When-You-Die-Robin-Sharma-English-/252567465846?hash=item3ace31af76:g:fbsAAOSwZVlXpwm4';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='https://littlebooknesslane.files.wordpress.com/2015/02/after-you-die-by-eva-dolan.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        //var naam = __dirname+"/json/"+json.name+'output.json';
        var naam = __dirname+"/json/"+'whowillcry'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/whowillcrywhenyoudie.html'))

    }) ;
})
//paste
app.get('/inspiron3558', function(req, res){

    url = 'http://www.amazon.in/gp/product/B01GHGLL2G/ref=s9_acsd_ri_bw_c_x_1?pf_rd_m=A1VBAL9TL5WCBF&pf_rd_s=merchandised-search-7&pf_rd_r=05AZ9M25RST887PJCMPP&pf_rd_t=101&pf_rd_p=00600dcf-3c0f-4d68-b3a4-c57df8f5892f&pf_rd_i=1375424031';
    url1 = 'https://www.snapdeal.com/product/dell-inspiron-3558-notebook-z565155uin9/619612846170#bcrumbSearch:Dell%20Inspiron%203558';
    url2 ='http://www.ebay.in/itm/Dell-Inspiron-15-3558-Laptop-Core-i3-5th-Gen-4GB-1TB-Ubuntu-Box-Open-/152261757737?hash=item2373820b29:g:Z4sAAOSwNRdX71mL';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://snatchit.pk/wp-content/uploads/2016/08/dpreal-800x600.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+json.name+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })

        //only for 1st time run res.send
        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/dellinspiron3558.html'))

    }) ;
})
app.get('/vibexx', function(req, res){

    url = 'http://www.amazon.in/Lenovo-Vibe-X2-X2-AP-Gold/dp/B00PRP9YFA/ref=sr_1_3?s=electronics&ie=UTF8&qid=1476120258&sr=1-3&keywords=lenovo+vibe+x2';
    url1 = 'https://www.snapdeal.com/product/lenovo-vibe-x2ap/619606468183#bcrumbSearch:lenovo%20vibe%20x2%20mobile';
    url2 ='https://www.ebay.in/pdt/Lenovo-Vibe-X2-Late/203834523';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://i00.i.aliimg.com/wsphoto/v0/32295963156_1/Original-Lenovo-VIBE-X2-4G-LTE-Cell-Phones-MTK6595m-Octa-Core-5-0-IPS-1920x1080-Android.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        //var naam = __dirname+"/json/"+json.name+'output.json';
        var naam = __dirname+"/json/"+'vibexx'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/vibexx.html'))

    }) ;
})

app.get('/iphonefs', function(req, res){

    url = 'http://www.amazon.in/Apple-iPhone-5s-Space-Grey/dp/B00FXLC9V4/ref=sr_1_1?s=electronics&ie=UTF8&qid=1476127052&sr=1-1&keywords=iphone+5s';
    url1 = 'https://www.snapdeal.com/product/apple-iphone-5s-16-gb/1204769399#bcrumbSearch:iphone%205s|bcrumbLabelId:12';
    url2 ='http://www.ebay.in/itm/Apple-iPhone-5s-16-GB-Grey-/112162414123?hash=item1a1d669e2b:g:Md0AAOSwLF1X-yz5';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='https://www.my-icover.nl/img/cms/iphone%205/iphone%205%205s%20hoesjes%208.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'iphonefs'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/iphonefs.html'))

    }) ;
})


app.get('/beats2', function(req, res){

    url = 'http://www.amazon.in/Beats-Solo-Wireless-Headphones-Black/dp/B00TKGVBCG/ref=sr_1_1?s=electronics&ie=UTF8&qid=1476166084&sr=1-1&keywords=beats+solo2+wireless';
    url1 = 'https://www.snapdeal.com/product/beats-solo2-onear-headphones-black/621911128237#bcrumbSearch:beats%20solo2';
    url2 ='http://www.ebay.in/itm/Beats-Solo2-On-Ear-Headphones-Black-/122076931218?hash=item1c6c5a2492:g:o8kAAOSwU-pXqFEW';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='https://s-media-cache-ak0.pinimg.com/originals/5b/5e/c8/5b5ec81c3a75007ec05546da8fe347b2.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'beats2'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/beats2.html'))

    }) ;
})

app.get('/scharger', function(req, res){

    url = 'http://www.amazon.in/Samsung-Original-Charging-LOYO-SmartPhones/dp/B01M0B4NXW/ref=sr_1_8?s=electronics&ie=UTF8&qid=1476167247&sr=1-8&keywords=samsung+charger';
    url1 = 'https://www.snapdeal.com/product/samsung-21a-travel-charger/680802386040#bcrumbSearch:samsung%20charger|bcrumbLabelId:12';
    url2 ='http://www.ebay.in/itm/100-Original-2-0A-Samsung-S6-Universal-Mobile-Charger-USB-Adapter-1-5M-Cable-/152271824012?hash=item23741ba48c:g:TYcAAOSwLF1X-JV0';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://ftaelectronics.ca/store/image/cache/data/Mobile%20Chargers/2A%20USB%203.0%20Charger%20Sync%20Cable%20for%20Samsung%20Galaxy%20S5%20Note3%20(2)-800x600_0.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'scharger'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/scharger.html'))

    }) ;
})

app.get('/philipst', function(req, res){

    url = 'http://www.amazon.in/Philips-QT4000-Skin-Advanced-Trimmer/dp/B00GUBY0JA/ref=sr_1_5?s=hpc&ie=UTF8&qid=1476168375&sr=1-5&keywords=philips+trimmer';
    url1 = 'https://www.snapdeal.com/product/philips-qt4000-beard-trimmer/716782929#bcrumbSearch:philips%20trimmer';
    url2 ='http://www.ebay.in/itm/Philips-QT4000-15-Pro-Skin-Advanced-Trimmer-For-Men-/112027362415?hash=item1a1559e46f:g:x40AAOSwMNxXX8Lz';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://smadshop.md/image/cache/data/sredstva%20uhoda/personalinii_uhod_2/philips-qt4000151-800x600.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'philipst'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/philipst.html'))

    }) ;
})

app.get('/nikefp', function(req, res){

    url = 'http://www.amazon.in/Nike-Fission-EDT-Green-100ml/dp/B00DRE3TUO/ref=sr_1_5?s=hpc&ie=UTF8&qid=1476169891&sr=1-5&keywords=nike+perfume';
    url1 = 'https://www.snapdeal.com/product/nike-fission-100ml-buy-1/227302082#bcrumbSearch:nike%20perfume';
    url2 ='http://www.ebay.in/itm/NIKE-FISSION-EDT-PERFUME-FOR-MEN-100-ML-/162070609187?hash=item25bc293d23:g:zdYAAOSw~oFXNxWo';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://www.deobazaar.com/admin/product_image/NikeFissionEDTPerfume_d40198.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'nikefp'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/nikefp.html'))

    }) ;
})

app.get('/adidasal', function(req, res){

    url = 'http://www.amazon.in/adidas-Albis-Silver-Orange-Running/dp/B019MQO98G/ref=sr_1_6?ie=UTF8&qid=1476173584&sr=8-6&keywords=adidas%2Bfootwear&th=1';
    url1 = 'https://www.snapdeal.com/product/adidas-albis-10-white-sports/666217562563#bcrumbSearch:adidas|bcrumbLabelId:4583';
    url2 ='http://www.ebay.in/itm/ADIDAS-ALBIS-1-0-RUNNING-SPORTS-SHOES-IN-WHITE-COLORS-/172227466224?var=&hash=item28198e93f0:m:mMP56uZPaK-DDpyD06ByFrA';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://static1.shop.indiatimes.com/images/products/additional/original/B6622244_View_2/fashion/sports/adidas-albis-1-0-white-sports-shoes.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'adidasal'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/adidasal.html'))

    }) ;
})

app.get('/jockeyv', function(req, res){

    url = 'http://www.amazon.in/Jockey-Mens-Cotton-8901326034330_8820-0310-WHITE-White/dp/B00W04OOFQ/ref=sr_1_1?s=apparel&ie=UTF8&qid=1476174374&sr=1-1&keywords=jockey+vest';
    url1 = 'https://www.snapdeal.com/product/jockey-white-cotton-vests-pack/661885899660#bcrumbSearch:jockey%20vest';
    url2 ='http://www.ebay.in/itm/Jockey-Mens-Classic-Vest-8820-Three-Piece-Pack-/152259090623?var=&hash=item23735958bf:m:mIyngmvg-v9yy28rF7Z0CJw';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='https://kartrocket-res.cloudinary.com/image/fetch/w_800,q_90,h_600,c_pad,f_auto/http%3A%2F%2Fkartrocket-mtp.s3.amazonaws.com%2Fall-stores%2Fimage_makeupshades%2Fdata%2F8817.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'jockeyv'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/jockeyv.html'))

    }) ;
})

app.get('/lggl', function(req, res){

    url = 'http://www.amazon.in/LG-GL-Q292SHAM-Frost-free-Double-door-Refrigerator/dp/B01DM8HRKC/ref=sr_1_3?s=kitchen&ie=UTF8&qid=1476175128&sr=1-3&keywords=lg+refrigerator+260+ltr+double+door';
    url1 = 'https://www.snapdeal.com/product/lg-260-glt292rhsm-frost-free/633103670479#bcrumbSearch:lg%20refrigerators';
    url2 ='http://www.ebay.in/itm/Brand-New-LG-255-LITRES-FROST-FREE-REFRIGERATOR-Model-GL-Q282SHAM-2016-Model-/282021829803?hash=item41a9cf9cab:g:OAcAAOSwFEFXJDu2';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://static.digit.in/product/5120bd689512c82bb0cfa70db519ed794f8b441e.jpeg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'lggl'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/lggl.html'))

    }) ;
})

app.get('/pumabag', function(req, res){

    url = 'http://www.amazon.in/Puma-Pioneer-Backpack-II-Quarry/dp/B01DUHA1GC/ref=sr_1_1?ie=UTF8&qid=1476176184&sr=8-1&keywords=puma+backpack';
    url1 = 'https://www.snapdeal.com/product/puma-grey-backpack/672960191351';
    url2 ='http://www.ebay.in/itm/Puma-Unisex-Echo-Plus-blue-Backpack-fast-free-shipping-/111756108576?hash=item1a052ee320:g:0G8AAOSwMmBVgS8~';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='https://asset3.surfcdn.com/puma-backpacks-puma-pioneer-backpack-mazarine-blue-black.jpg?w=1200&h=1200&q=80&o=zTL@g8pQ7JtOIbg2RfFMB1YrhFAj&V=$tSL';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'pumabag'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/pumabag.html'))

    }) ;
})

app.get('/pumashoe', function(req, res){

    url = 'http://www.amazon.in/Puma-Fashion-Quarry-Blast-Running/dp/B01AW5PPHK/ref=sr_1_1?s=shoes&ie=UTF8&qid=1476186415&sr=1-1&keywords=puma%2Breef&th=1';
    url1 = 'https://www.snapdeal.com/product/puma-reef-fashion-black-running/630497780746#bcrumbLabelId:255';
    url2 ='http://www.ebay.in/itm/262576694724';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='https://n1.sdlcdn.com/imgs/b/n/f/Puma-Reef-Fashion-Black-Sports-SDL733935017-1-b77cd.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'pumashoe'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/pumashoe.html'))

    }) ;
})

app.get('/sonymdr', function(req, res){

    url = 'http://www.amazon.in/gp/product/B00KGZZ824/ref=br_bsl_pdt-4?pf_rd_m=A1VBAL9TL5WCBF&pf_rd_s=desktop-bestsellers-2&pf_rd_r=1DKHGRV333C41H7ATG0E&pf_rd_r=1DKHGRV333C41H7ATG0E&pf_rd_t=36701&pf_rd_p=8f8027a4-7aec-4616-a794-86bb839b1c0c&pf_rd_p=8f8027a4-7aec-4616-a794-86bb839b1c0c&pf_rd_i=desktop';
    url1 = 'https://www.snapdeal.com/product/sony-mdrzx110a-zx-series-headphone/629950831750#bcrumbSearch:Sony%20MDR-ZX110A%20Stereo%20On-Ear%20Headphone%28White%29';
    url2 ='http://www.ebay.in/rpp/diwali-sale?_trkparms=clkid%3D8784653190672872105';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='https://d3nevzfk7ii3be.cloudfront.net/igi/yUJPHvkSgxwJVIRO.large';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'sonymdr'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/sonymdr.html'))

    }) ;
})

app.get('/htcdesire10', function(req, res){

    url = 'http://www.amazon.in/HTC-Desire-Lifestyle-Stone-Black/dp/B01FM7H4GS/ref=sr_1_1?s=electronics&rps=1&ie=UTF8&qid=1476520556&sr=1-1&th=1';
    url1 = 'https://www.snapdeal.com/product/htc-desire-830-32gb-sprinkle/678965079589#bcrumbSearch:HTC%20Desire%2010%20Lifestyle%20%28Stone%20Black%2C%2032%20GB';
    url2 ='http://www.ebay.in/itm/HTC-Desire-825-Sprinkle-White-Dual-Sim-2-GB-Ram-13-MP-Camera-Smart-Phone-/112159512990?hash=item1a1d3a599e:g:WBYAAOSwIgNXi~Yr';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://cdn.ndtv.com/tech/images/htc_desire_10_evleaks.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'htcdesire10'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/htcdesire10.html'))

    }) ;
})

app.get('/zebronics', function(req, res){

    url = 'http://www.amazon.in/Zebronics-ZEB-K11-USB-keyboard-Black/dp/B011O6BB9M/ref=sr_1_1?s=computers&ie=UTF8&qid=1476521666&sr=1-1&keywords=keyboard';
    url1 = 'https://www.snapdeal.com/product/zebronics-zebk11-usb-desktop-keyboard/665318583881#bcrumbSearch:Zebronics%20ZEB-K11%20USB%20keyboard%20%28Black%29';
    url2 ='http://www.ebay.in/itm/Zebronics-ZEB-K11-USB-keyboard-/321996494296?hash=item4af87c95d8:g:QLoAAOSwAKxWXybE';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='https://www.zebronics.com/uploads/products/product_900/Zeb-K11-USB-pic1.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'zebronics'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/zebronics.html'))

    }) ;
})

app.get('/daburred', function(req, res){

    url = 'http://www.amazon.in/Dabur-Red-Paste-100-g/dp/B0067GFOOS/ref=sr_1_fkmr1_1?ie=UTF8&qid=1476522591&sr=8-1-fkmr1&keywords=dabur+red+toothpaste+100+gms';
    url1 = 'https://www.snapdeal.com/product/dabur-red-paste-100g/620812277148#bcrumbSearch:dabur%20ratnaprash';
    url2 ='http://www.ebay.in/itm/Dabur-Red-Paste-for-Teeth-Gums-100g-/281869425230?hash=item41a0ba1a4e:g:3m4AAOSwv-NWWaXl';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://i.ebayimg.com/images/i/141884260542-0-1/s-l1000.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'daburred'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/daburred.html'))

    }) ;
})

app.get('/philipsiron', function(req, res){

    url = 'http://www.amazon.in/Philips-GC1905-1440-Watt-Steam-Spray/dp/B008QTK47Q/ref=sr_1_1?s=kitchen&ie=UTF8&qid=1476523801&sr=1-1&keywords=philips+iron';
    url1 = 'https://https://www.snapdeal.com/product/philips-gc190521-steam-iron/130570#bcrumbSearch:Philips%20GC1905%201440-Watt%20Steam%20Iron%20with%20Spray';
    url2 ='http://www.ebay.in/itm/Philips-GC1905-1440-Watt-Steam-Iron-with-Spray-/112078579340?hash=item1a1867668c:g:J7UAAOSwnQhXnpN8';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://shop24hrs.in/30-thickbox_default/philips-1440-watt-steam-iron-with-spray.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'philipsiron'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        res.send('success')
        //res.sendFile(path.join(__dirname+'/products/philipsiron.html'))

    }) ;
})
app.get('/dlink', function(req, res){

    url = 'http://www.amazon.in/D-Link-Dir-600M-Broadband-Wireless-Router/dp/B00JE6HMNY/ref=sr_1_1?s=electronics&ie=UTF8&qid=1476524817&sr=1-1&keywords=dlink';
    url1 = 'https://www.snapdeal.com/product/dlink-dir600m-wireless-n150-home/625069392643#bcrumbSearch:D-Link%20Dir-600M%20Broadband%20Wireless%20Router';
    url2 ='http://www.ebay.in/itm/1X-New-D-Link-Dir-600M-Broadband-Wireless-Router-D-Link-Dir-600M-Routers-/172372175336?hash=item28222ea9e8:g:u3kAAOSw8gVX~dbF';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://www.technicapc.com/2640/d-link-dir-605l-300mbps-wireless-router.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'dlink'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/dlink.html'))

    }) ;
})
app.get('/ushasewing', function(req, res){

    url = 'http://www.amazon.in/Usha-Janome-Allure-75-Watt-Machine/dp/B00E9OFDH8/ref=sr_1_4?s=kitchen&ie=UTF8&qid=1476547397&sr=1-4&keywords=usha+sewing+machine';
    url1 = 'https://www.snapdeal.com/product/usha-janome-allure-sewing-machine/432999078#bcrumbSearch:Usha%20Janome%20Dream%20Stitch%20Sewing%20Machine';
    url2 ='http://www.ebay.in/itm/EXTRA-DISCOUNT-Usha-Allure-Automatic-Sewing-Machine-2-Year-Usha-Warranty-/251697907819?hash=item3a9a5d486b:g:zqQAAOSw9IpX0UmP';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='https://n4.sdlcdn.com/imgs/a/5/o/Usha-Allure-Sewing-Machine-SDL157542646-2-ccda9.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'ushasewing'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/ushasewing.html'))

    }) ;
})

app.get('/cooker', function(req, res){

    url = 'http://www.amazon.in/Prestige-Popular-Aluminium-Pressure-Cooker/dp/B002RL8XB8/ref=sr_1_4?s=kitchen&ie=UTF8&qid=1476548474&sr=1-4&keywords=cooker&th=1';
    url1 = 'https://www.snapdeal.com/product/prestige-silver-outer-lid-cooker/633605374724#bcrumbSearch:Prestige%20Popular%20Aluminium%20Pressure%20Cooker%2C%205%20Litres%2CSilver';
    url2 ='http://www.ebay.in/itm/Prestige-Popular-Aluminium-Pressure-Cooker-5-Litres-/181890734058?hash=item2a598857ea:g:ScUAAOSwFnFWDiSd';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://ffwatchco.com/wp-content/uploads/2015/03/POPULAR-P.COOKER-4.0L.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'cooker'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/cooker.html'))

    }) ;
})

app.get('/reeboksocks', function(req, res){

    url = 'http://www.amazon.in/Reebok-ankle-Socks-White-Black/dp/B016YEQ6YO/ref=sr_1_fkmr0_1?s=grocery&ie=UTF8&qid=1476549469&sr=8-1-fkmr0&keywords=3+Pairs+of+Reebok+Sports+ankle+length+cotton+towel+socks';
    url1 = 'https://www.snapdeal.com/product/reebok-ankle-length-socks/674960256363#bcrumbSearch:3%20Pairs%20of%20Reebok%20Sports%20ankle%20length%20cotton%20towel%20socks';
    url2 ='http://www.ebay.in/itm/3-Pairs-of-Reebok-Sports-ankle-length-cotton-towel-socks-/152268984194?hash=item2373f04f82:g:B~YAAOSwuzRXfTz-';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://n1.sdlcdn.com/imgs/c/d/3/Reebok-Gray-Casual-Ankle-Length-SDL180516066-1-b82da.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'reeboksocks'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/reeboksocks.html'))

    }) ;
})

app.get('/lenovoa7', function(req, res){

    url = 'http://www.amazon.in/Lenovo-A7000-Black/dp/B013I7VO2E/ref=sr_1_1?ie=UTF8&qid=1476909496&sr=8-1&keywords=Lenovo+A7000+Turbo+%2816GB%2C+Black%29';
    url1 = 'https://www.snapdeal.com/product/lenovo-a7000-turbo-16gb-matte/676482356343#bcrumbSearch:Lenovo%20Z2%20Plus%20%28Black%2C%2064GB%29';
    url2 ='http://www.ebay.in/itm/LENOVO-A7000-TURBO-Black-/331963769663?hash=item4d4a95233f:g:dBYAAOSwxg5X0UXU';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://cdn.ndtv.com/tech/lenovo_a7000_home_screen.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'lenovoa7'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/lenovoa7.html'))

    }) ;
})

app.get('/coscorio', function(req, res){

    url = 'http://www.amazon.in/Cosco-Rio-Football-Size-Green/dp/B00P0IJLRA/ref=sr_1_2?ie=UTF8&qid=1476911151&sr=8-2&keywords=cosco&th=1';
    url1 = 'https://www.snapdeal.com/product/cosco-rio-football-size-3/633148972649#bcrumbSearch:Cosco%20Rio%20Football%2C%20Size%203';
    url2 ='http://www.ebay.in/itm/Cosco-Rio-Football-Size-3-Green-FootBall-Best-Quality-/282075800135?hash=item41ad072247:g:fxgAAOSw3YNXanbp';
    var name1, desc1, price1, rating1;
    var json = { amazon_url: "", snapdeal_url: "",ebay_url: "", name : "", description : "", price : "", sd_price: "", ebay_price: "",image: "", rating: ""};
    json.amazon_url=url;
    json.snapdeal_url=url1;
    json.ebay_url=url2;
    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            //console.log(na);
        })
    });

    request(url2, function(error,response,html){
        var $ = cheerio.load(html);
        $('#prcIsum').filter(function(){
            var data1 = $(this);
            na1 = data1.text().trim();
            json.ebay_price=na1;
            //console.log(na1);
        })
    });

    request(url1, function(error,response,html){
        var $ = cheerio.load(html);
        $('.payBlkBig').filter(function(){
            var data = $(this);
            na = data.text().trim();
            json.sd_price=na;
            console.log(na);
        })
    });

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            //var name1, desc1, price1, rating1;
            //var json = { name : "", description : "", price : "",image: "", rating: ""};
            //json.image='http://ecx.images-amazon.com/images/I/613LxykIpzL._SY606_.jpg';
            json.image='http://pandoras.in/6746-thickbox_default/cosco-rio-football-size-3.jpg';
            $('#productTitle').filter(function(){
                var data = $(this);
                name1 = data.text().trim();

                json.name = name1;

            })

            $('#featurebullets_feature_div').filter(function(){
                var data = $(this);
                desc1 = data.text().trim();

                json.description = desc1;

            })

            $('#priceblock_ourprice').filter(function(){
                var data = $(this);
                price1 = data.text().trim();

                json.price = price1;

            })

            $('#reviewStarsLinkedCustomerReviews').filter(function(){
                var data = $(this);
                rating1 = data.text().trim();

                json.rating = rating1;
            })
        }


        var naam = __dirname+"/json/"+'coscorio'+'output.json';
        var JSONItems = [json];
        fs.writeFile(naam, JSON.stringify(JSONItems, null, 4), function(err){
            console.log(naam);
            console.log('File successfully written! - Check your project directory for the output.json file');

        })


        //res.send('success')
        res.sendFile(path.join(__dirname+'/products/coscorio.html'))

    }) ;
})



app.listen('8081')
console.log('run on localhost:8081');
exports = module.exports = app;
