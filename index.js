const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)
const path = require('path')
const PORT = process.env.PORT || 5000
const { Pool } = require('pg');
var bodyParser = require('body-parser')
var users = []
var users2 = []
var users3 = []
var users4 = []
var users5 = []
var users6 = []

var alluser = []



//net

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

//local

// var pool = new Pool({
//   user: 'penghang',
//   password: 'root',
//   host: 'localhost',
//   database: 'penghang',
//   port: '5432'
// });

const cookieParser = require('cookie-parser')
const session = require('express-session')
const SessionSave = require('session-file-store')(session)
// var cn = {
//     host: 'localhost', // server name or IP address;
//     port: 5432,
//     database: 'delongli',
//     user: '',
//     password: ''
// };


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(cookieParser('user_session'))
app.use(session({
    secret: "user_session",
    resave: true,
    saveUninitialized: false,
    store: new SessionSave({logFn: function(){}}),
    cookie: {user:"default",maxAge: 60*60*1000}
  }))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM test_table');
      const results = { 'results': (result) ? result.rows : null};
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })

  //sign up
app.get('/register', async (req,res)=>{
    try
    {
      const client = await pool.connect()
      // const exist = await client.query('select * from userinfo where username = ($1)', [req.query.username]);
      //
      // const results = { 'results': (exist) ? exist.rows : null};
      //
      // if(results.results[0]!=null)
      // {
      //   res.render("pages/register",{same_username:"duplicate"})
      //   res.end();
      // }
      var query = "insert into userinfo (username, age, gender, weight, height, password,isAdmin) values ($1,$2,$3,$4,$5,$6,0)";
      var insert_new_table = "insert into workoutinfo (username, workoutset1, workoutset2, workoutset3, workoutset4, workoutset5,workoutset6, workoutset7, workoutset8, workoutset9) values ($1,0,0,0,0,0,0,0,0,0)";
      var planquery = "insert into userplan values ($1)";
      var historyquery = "insert into history values ($1,$2)";
      var mapquery = "insert into map values ($1, $2, $3)";

      var info = [req.query.username,req.query.age, req.query.gender, req.query.weight, req.query.height, req.query.password];
      var info1 = [req.query.username];
      var plan = [req.query.username];
      var history = [req.query.username, [0,0,0,0,0,0,0]];
      var infomap = [req.query.username, 0, 0];
      console.log(info);
      console.log(info1);
      console.log(plan);

      await client.query(query, info, function(err){
      if (err)
      {
            console.log("Query error: " + err );
            res.render("pages/register",{same_username:"username already exists, please select another one."})
            //   res.end();
      }
      else
      {
            res.render("pages/Login",{regis_name:req.query.username,regis_pass:req.query.password,nopassword:"",nousername:""});
            // client.release();
            // console.log("insert succeed");
            // res.json({message:"Insert"});
      }
    })
      await client.query(planquery, plan, function(err){
      if (err)
      {
            console.log("Query error: " + err );
            // res.render("pages/register",{same_username:"username already exists, please select another one."})
            //   res.end();
      }
      else
      {
            console.log("insert succee");
            // res.render("pages/Login",{regis_name:req.query.username,regis_pass:req.query.password,nopassword:"",nousername:""});
            // client.release();
            // console.log("insert succeed");
            // res.json({message:"Insert"});
      }
    })

      await client.query(historyquery, history, function(err){
        if (err)
        {
          console.log("Query error: " + err );
          // res.render("pages/register",{same_username:"username already exists, please select another one."})
          // res.end();
        }
        else
        {
          // res.render("pages/Login",{regis_name:req.query.username,regis_pass:req.query.password,nopassword:"",nousername:""});
          //client.release();
          console.log("insert succeed");
          // res.json({message:"Insert"});
        }
      })

      await client.query(mapquery, infomap, function(err){
        if (err)
        {
          console.log("Query error: " + err );
          // res.render("pages/register",{same_username:"username already exists, please select another one."})
          // res.end();
        }
        else
        {
          // res.render("pages/Login",{regis_name:req.query.username,regis_pass:req.query.password,nopassword:"",nousername:""});
          //client.release();
          console.log("insert succeed");
          // res.json({message:"Insert"});
        }
      })

    await client.query(insert_new_table, info1, function(err){
      if (err)
      {
            console.log("Query error: " + err );
            // res.render("pages/register",{same_username:"username already exists, please select another one."})
            // res.end();
      }
      else
      {
            // res.render("pages/Login",{regis_name:req.query.username,regis_pass:req.query.password,nopassword:"",nousername:""});
            client.release();
            console.log("insert succeed");
            // res.json({message:"Insert"});
      }
    })
  } catch (err){
      console.error(err);
      // res.send("DB connection error: " + err );
    }
  })
  //login
app.post('/login', async (req,res)=>{
    try{
      const client = await pool.connect();


      var query = "select * from userinfo where username=$1";

      const result = await client.query(query, [req.body.username])
        if(result.rows[0]==null){

            res.render("pages/Login",{nopassword:"",nousername:"Username does not Exist!",regis_pass:'',regis_name:''});
            res.end();
        }
        else{
            console.log(result.rows[0]);
             if(result.rows[0].password === req.body.password)
              {

                req.session.regenerate(function(err)
                {
                  if(err)
                  {

                    return console.log(err);

                  }
                }
              )
                req.session.loginUser = req.body.username;

                if(result.rows[0].isadmin===1)
                {
                    res.render('pages/admin');
                }
                else
                {
                  res.redirect('profile.html');

                }
              }
              else{
                res.render("pages/Login",{nopassword:"Password is not Correct!",nousername:"",regis_pass:'',regis_name:''});

              }
      }

      client.release();
    } catch (err){
      console.log(err);
      // res.send("DB connection error: " + err );
      // res.render('pages/error',{message:""+err})
    }
  })

app.post('/googlelogin', async (req, res) => {
    if(!!req.body.username) {
      req.session.regenerate(function (err) {
        if (err) {

          return console.log(err);

        }
        req.session.loginUser = req.body.username;
        res.send({islogin: true});
      });



      try
      {
        const client = await pool.connect();

        var query = "insert into userinfo (username, age, gender, weight, height, password,isAdmin) values ($1,$2,$3,$4,$5,$6,0)";
        var insert_new_table = "insert into workoutinfo (username, workoutset1, workoutset2, workoutset3, workoutset4, workoutset5,workoutset6, workoutset7, workoutset8, workoutset9) values ($1,0,0,0,0,0,0,0,0,0)";
        var planquery = "insert into userplan values ($1, $2, $3)";
        var historyquery = "insert into history values ($1,$2)";
        var mapquery = "insert into map values ($1, $2, $3)";

        var info = [req.body.username,18, "O", 80, 180, "123"];
        var info1 = [req.body.username];
        var plan = [req.body.username, req.body.firstname, req.body.lastname];
        var history = [req.query.username, [0,0,0,0,0,0,0]];
        var infomap = [req.query.username, 0, 0];

        await client.query(query, info);
        await client.query(planquery, plan);

        await client.query(historyquery, history);
        await client.query(mapquery, infomap);

        await client.query(insert_new_table, info1);

        client.release();
      } catch (err){
        console.error(err);
        // res.send("DB connection error: " + err );
      }



    } else{
      res.send({islogin: false});
    }
  })

app.get('/', (req, res) => {
    var user = req.session.loginUser;
    if(!!user) {

      res.redirect('/profile.html')

    } else{
      res.redirect('/homepage.html');//not login
    }
  })

app.get('/islogined', (req, res, next) => {
    //islogined
    var user = req.session.loginUser;
    if(!!user){
      //logined
      console.log(user);
      res.send({islogin:true});
    }
  })

app.get('/logout', (req, res, next) => {
    req.session.destroy(function(err) {
      if (err) {
        res.json({err_msg: "logout failed"});
      }
      res.clearCookie();
      res.redirect('/');
    });
  })
app.get('/user/logout', (req, res, next) => {
    req.session.destroy(function(err) {
      if (err) {
        res.json({err_msg: "logout failed"});
      }
      res.clearCookie();
      res.redirect('/');
    });
  })

 // ********************************************
 // admin part
app.get('/getdatas', async (req,res)=>{
    try{
      const client = await pool.connect();
      const result = await client.query('select * from userinfo');
      const results = { 'results': (result) ? result.rows : null};
      client.release();
      res.send(results);
      console.log("get datas succeed")
      res.end()
    } catch (err){
      console.error(err);
      res.send("Error " + err);
    }
  })
app.post('/get_by_name', async (req,res)=>{
    try{
      const client = await pool.connect();
      const result = await client.query('select * from userinfo where username=($1)', [req.body.username]);
      const results = { 'results': (result) ? result.rows : null};
      client.release();
      res.send(results);
      console.log("get datas by req.body.name succeed");
      res.end()
    } catch (err){
      console.error(err);
      res.send("Error " + err);
    }
  })
app.post('/add', async (req,res)=>{
    try{
      const client = await pool.connect();
      await client.query('INSERT INTO userinfo VALUES($1, $2, $3, $4, $5, $6, $7)',[req.body.username,req.body.age,req.body.gender,req.body.weight,req.body.height,req.body.password,0]);
      client.release();
      console.log("add succeed");
    }
      catch (err){
      console.error(err);
      res.send("Error " + err);
    }
    res.end()
  })
app.post('/delete', async (req,res)=>{
    try{
      const client = await pool.connect()
      const result = await client.query("delete from userinfo where username=($1)", [req.body.username]);
      client.release();
      console.log("userinfo delete")
      res.end()
    }
      catch (err){
        console.error(err);
        res.send("Error " + err);
      }
    })


    .get('/username', (req, res) => {
      if(!!req.session.loginUser){
        res.send({username:req.session.loginUser});
      }else{
        res.send({});
      }
    })


    //*********************************************


    //profile: body: onload赋值user信息
    //********************
    .post('/user_profile_info',async (req, res) => {
      try{
        const client = await pool.connect()
        const result = await client.query("select * from userinfo where username=$1", [req.body.username]);
        client.release();
        res.send(result);

      }
        catch (err){
          console.error(err);
          res.send("Error " + err);
        }

    })


    .post('/user_remaindate',async (req, res) => {
        try{
            const client = await pool.connect()
            const result = await client.query("select To_char(completedate::DATE,'mm/dd/yyyy'),goalweight,about,fitnesstyle from userplan where username=$1", [req.body.username]);
            client.release();
            res.send(result);

          }
            catch (err){
              console.error(err);
              res.send("Error " + err);
            }

    })


    //********************
       .get('/workoutplan', async (req,res)=>{
    try{
      const client = await pool.connect();
      const result = await client.query("select * from workoutinfo where username=($1)", [req.session.loginUser]);
      res.send(result.rows[0]);
      client.release();
      res.end();
    } catch (err){
      console.error(err);
      res.send("Error " + err);
    }
  })// render to html

app.post('/submitplan', async (req,res)=>{
    try{
      const client = await pool.connect();
      await client.query("delete from workoutinfo where username=($1)", [req.session.loginUser]);
      await client.query("insert into workoutinfo values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [req.session.loginUser, req.body.workout1, req.body.workout2, req.body.workout3, req.body.workout4, req.body.workout5, req.body.workout6, req.body.workout7, req.body.workout8, req.body.workout9]);
      client.release();
      res.redirect("/profile.html");
    } catch (err){
      console.error(err);
      res.send("Error " + err);
    }
  })

//editprofile
app.get('/change', async(req, res)=>{
  try{
    const client = await pool.connect();

    await client.query("update userinfo set age=$1, gender=$2, weight=$3, height=$4, password=$5 where username=$6", [req.query.age, req.query.gender, req.query.weight, req.query.height, req.query.password, req.session.loginUser ]);
    client.release();
    console.log("insert Successfully");
    res.redirect("/profile.html");
  } catch(err){
    console.error(err);
    res.send("Error " + err)
  }
})

app.get('/update', async(req, res)=>{
  try{
    const client = await pool.connect();
    var date1= req.query.year+'-'+req.query.month+'-'+req.query.day;
    await client.query("update userplan set firstname=$1, lastname=$2, about=$3, fitnesstyle=$4, completedate=$5, goalweight=$6 where username=$7", [req.query.firstname, req.query.lastname, req.query.about, req.query.fitnesstyle, date1, req.query.goalweight, req.session.loginUser ]);
    client.release();
    console.log("update Successfully");
    res.redirect("/profile.html");
  } catch(err){
    console.error(err);
    res.send("Error " + err)
  }
})

app.get('/userplan',async (req, res) => {
    try{
      const client = await pool.connect()
      const result = await client.query("select firstname,lastname,about,fitnesstyle, To_char(completedate::DATE,'mm/dd/yyyy'),goalweight from userplan where username=$1", [req.session.loginUser]);
      //const result = await client.query("select * from userplan where username=$1", [req.session.loginUser]);
      client.release();
      res.send(result.rows[0]);

    }
      catch (err){
        console.error(err);
        res.send("Error " + err);
      }

})

app.post('/updateLoc', async (req, res) => {
    try{
      const client = await pool.connect();
      const result = await client.query("update map set lat = $1, lng = $2 where username = $3", [req.body.lat, req.body.lng, req.session.loginUser]);
      //const result = await client.query("select * from userplan where username=$1", [req.session.loginUser]);
      client.release();
      //console.log(req.body.lat);
      res.send(result.rows[0]);
      //update then socket to all other users => 1.let all of them get /nearbyuser 2.friend online notice
    }
    catch (err){
      console.error(err);
      res.send("Error " + err);
    }
  })

app.get('/nearbyuser', async (req, res) => {
    try{
      const client = await pool.connect();
      const result = await client.query("select * from map where lat<$1 and lat>$2 and lng<$3 and lng>$4 and username != $5", [req.query.maxlat, req.query.minlat, req.query.maxlng, req.query.minlng, req.session.loginUser]);
      //const result = await client.query("select * from userplan where username=$1", [req.session.loginUser]);
      client.release();
      //console.log([req.body.maxlat, req.body.minlat, req.body.maxlng, req.body.minlng, req.session.loginUser]);
      console.log(result);
      res.send(result);
    }
    catch (err){
      console.error(err);
      res.send("Error " + err);
    }
  })

  //send friend request???

app.post('/addfriend', async (req, res) => {
    try{
      const client = await pool.connect();
      await client.query("update map set friend = friend || $1 where username = $2", [[req.body.username], req.session.loginUser]);
      await client.query("update map set friend = friend || $2 where username = $1", [req.body.username, [req.session.loginUser]]);
      //const result = await client.query("select * from userplan where username=$1", [req.session.loginUser]);
      client.release();
      //console.log([req.body.maxlat, req.body.minlat, req.body.maxlng, req.body.minlng, req.session.loginUser]);
      res.end();
    }
    catch (err){
      console.error(err);
      res.send("Error " + err);
    }
  })

app.get('/isfriend', async (req, res) => {
    try{
      const client = await pool.connect();
      const result = await client.query("select friend from map where username = $1", [req.session.loginUser]);
      //const result = await client.query("select * from userplan where username=$1", [req.session.loginUser]);
      client.release();
      //console.log([req.body.maxlat, req.body.minlat, req.body.maxlng, req.body.minlng, req.session.loginUser]);
      if(result.rows[0].friend===null){
        res.send(false);
      }
      console.log(result.rows[0].friend.includes(req.query.username));
      if(result.rows[0].friend.includes(req.query.username)){
        res.send(true);
      } else {
        res.send(false);
      }
    }
    catch (err){
      console.error(err);
      res.send("Error " + err);
    }
  })

app.get('/friendlist', async (req,res) => {
  try{
    const client = await pool.connect();
    const result = await client.query("select friend from map where username = $1", [req.session.loginUser]);
    //const result = await client.query("select * from userplan where username=$1", [req.session.loginUser]);
    client.release();
    //console.log([req.body.maxlat, req.body.minlat, req.body.maxlng, req.body.minlng, req.session.loginUser]);
    res.send(result.rows[0].friend);
  }
  catch (err){
    console.error(err);
    res.send("Error " + err);
  }
})


//create event start



//check if the event name is existed
app.post('/check_event', async(req, res)=>{
  try{
    const client = await pool.connect();
    const result =  await client.query("select * from event where name = $1", [req.body.eventname]);
    client.release();
    res.send(result);
  } catch(err){
    console.error(err);
    res.send("Error " + err)
  }
})

//insert event list into databse
app.post('/insert_event', async(req, res)=>{
  try{
    const client = await pool.connect();
    const result =  await client.query("insert into event values($1,$2,$3,$4,$5,$6)", [req.body.leader,req.body.type,req.body.name,req.body.time,req.body.location,req.body.phone]);
    client.release();
    res.send(req.body);
    // console.log("update Successfully");
  } catch(err){
    console.error(err);
    res.send("Error " + err)
  }

})


//get event list
app.get('/get_event_list', async(req, res)=>{
  try{
    const client = await pool.connect();
    const result =  await client.query("select leader,type,name,To_char(time::DATE,'yyyy-mm-dd'),location,phone from event where type = $1", [req.query.type]);
    client.release();
    res.send(result);
    // console.log("update Successfully");
  } catch(err){
    console.error(err);
    res.send("Error " + err)
  }

})


//new
//show event created by user
app.post('/leader_event', async(req, res)=>{
  try{
    const client = await pool.connect();
    const result =  await client.query("select leader,type,name,To_char(time::DATE,'yyyy-mm-dd'),location,phone from event where leader = $1", [req.body.leader]);
    client.release();
    res.send(result);
  } catch(err){
    console.error(err);
    res.send("Error " + err)
  }

})

//delete event created by user
app.post('/leader_delete_event', async(req, res)=>{
  try{
    const client = await pool.connect();
    await client.query("delete from event where name = $1", [req.body.name]);
    client.release();
    res.send(" ");
    // console.log(req.body.name);
  } catch(err){
    console.error(err);
    res.send("Error " + err)
  }

})




//create event end



//show frend list

app.post('/friend_list', async(req, res)=>{
  try{
    const client = await pool.connect();
    const result =  await client.query("select friend from map where username = $1", [req.body.username]);
    client.release();
    res.send(result.rows[0].friend);
  } catch(err){
    console.error(err);
    res.send("Error " + err)
  }

})


//show friend end


//bind the server to the 80 port
//server.listen(3000);//for local test
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));//publish to heroku
//server.listen(process.env.OPENSHIFT_NODEJS_PORT || 3000);//publish to openshift
//console.log('server started on port'+process.env.PORT || 3000);
//handle the socket
io.sockets.on('connection', function(socket) {
    //new user login
    socket.on('login', function(nickname) {
        // if (users.indexOf(nickname) > -1) {
        //     socket.emit('nickExisted');
        // } else {
            //socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            io.sockets.emit('system', nickname, users.length, 'login');
        // };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname != null) {
            //users.splice(socket.userIndex, 1);
            users.splice(users.indexOf(socket.nickname), 1);
            socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    //new image get
    socket.on('img', function(imgData, color) {
        socket.broadcast.emit('newImg', socket.nickname, imgData, color);
    });



    //room2
    //new user login
    socket.on('login2', function(nickname) {
        // if (users.indexOf(nickname) > -1) {
        //     socket.emit('nickExisted');
        // } else {
            //socket.userIndex = users.length;
            socket.nickname2 = nickname;
            users2.push(nickname);
            socket.emit('loginSuccess2');
            io.sockets.emit('system2', nickname, users2.length, 'login2');
        // };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname2 != null) {
            //users3.splice(socket.userIndex, 1);
            users2.splice(users2.indexOf(socket.nickname2), 1);
            socket.broadcast.emit('system2', socket.nickname2, users2.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg2', function(msg, color) {
        socket.broadcast.emit('newMsg2', socket.nickname2, msg, color);
    });
    //new image get
    socket.on('img2', function(imgData, color) {
        socket.broadcast.emit('newImg2', socket.nickname2, imgData, color);
    });


    //room3
    //new user login
    socket.on('login3', function(nickname) {
        // if (users.indexOf(nickname) > -1) {
        //     socket.emit('nickExisted');
        // } else {
            //socket.userIndex = users.length;
            socket.nickname3 = nickname;
            users3.push(nickname);
            socket.emit('loginSuccess3');
            io.sockets.emit('system3', nickname, users3.length, 'login3');
        // };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname3 != null) {
            //users3.splice(socket.userIndex, 1);
            users3.splice(users3.indexOf(socket.nickname3), 1);
            socket.broadcast.emit('system3', socket.nickname3, users3.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg3', function(msg, color) {
        socket.broadcast.emit('newMsg3', socket.nickname3, msg, color);
    });
    //new image get
    socket.on('img3', function(imgData, color) {
        socket.broadcast.emit('newImg3', socket.nickname3, imgData, color);
    });

    //room4
    //new user login
    socket.on('login4', function(nickname) {
        // if (users.indexOf(nickname) > -1) {
        //     socket.emit('nickExisted');
        // } else {
            //socket.userIndex = users.length;
            socket.nickname4 = nickname;
            users4.push(nickname);
            socket.emit('loginSuccess4');
            io.sockets.emit('system4', nickname, users4.length, 'login4');
        // };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname4 != null) {
            //users3.splice(socket.userIndex, 1);
            users4.splice(users4.indexOf(socket.nickname4), 1);
            socket.broadcast.emit('system4', socket.nickname4, users4.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg4', function(msg, color) {
        socket.broadcast.emit('newMsg4', socket.nickname4, msg, color);
    });
    //new image get
    socket.on('img4', function(imgData, color) {
        socket.broadcast.emit('newImg4', socket.nickname4, imgData, color);
    });

    //room5
    //new user login
    socket.on('login5', function(nickname) {
        // if (users.indexOf(nickname) > -1) {
        //     socket.emit('nickExisted');
        // } else {
            //socket.userIndex = users.length;
            socket.nickname5 = nickname;
            users5.push(nickname);
            socket.emit('loginSuccess5');
            io.sockets.emit('system5', nickname, users5.length, 'login5');
        // };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname5 != null) {
            //users3.splice(socket.userIndex, 1);
            users5.splice(users5.indexOf(socket.nickname5), 1);
            socket.broadcast.emit('system5', socket.nickname5, users5.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg5', function(msg, color) {
        socket.broadcast.emit('newMsg5', socket.nickname5, msg, color);
    });
    //new image get
    socket.on('img5', function(imgData, color) {
        socket.broadcast.emit('newImg5', socket.nickname5, imgData, color);
    });


    //room6
    //new user login
    socket.on('login6', function(nickname) {
        // if (users.indexOf(nickname) > -1) {
        //     socket.emit('nickExisted');
        // } else {
            //socket.userIndex = users.length;
            socket.nickname6 = nickname;
            users6.push(nickname);
            socket.emit('loginSuccess6');
            io.sockets.emit('system6', nickname, users6.length, 'login6');
        // };
    });
    //user leaves
    socket.on('disconnect', function() {
        if (socket.nickname6 != null) {
            //users3.splice(socket.userIndex, 1);
            users6.splice(users6.indexOf(socket.nickname6), 1);
            socket.broadcast.emit('system6', socket.nickname6, users6.length, 'logout');
        }
    });
    //new message get
    socket.on('postMsg6', function(msg, color) {
        socket.broadcast.emit('newMsg6', socket.nickname6, msg, color);
    });
    //new image get
    socket.on('img6', function(imgData, color) {
        socket.broadcast.emit('newImg6', socket.nickname6, imgData, color);
    });

    //addfriend
    socket.on('friendrequest', function(data) {
      console.log(data.friendusername);
      if(typeof alluser[data.friendusername]!== 'undefined'){
        alluser[data.friendusername].emit('friendrequest1', data.username);
      }
    });

    socket.on('initid', function(data) {
      console.log(data.username);
      alluser[data.username] = socket;
    });

    socket.on('imonline', function(data) {
      var i;
      for(i=0; i<data.friendlist.length; i++) {
        console.log(data.friendlist[i]);
        if(typeof alluser[data.friendlist[i]]!== 'undefined') {
          alluser[data.friendlist[i]].emit('friendonline', data.username);
        }
      }
      //alluser["SUP"].emit('online');
    })

});
