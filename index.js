var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var p2p = require('socket.io-p2p-server')(http);
var port = process.env.PORT || 3839;
var mergeJSON = require("merge-json");
var Log = require('log');
    log =  new Log('debug');

//io.use(p2p);


var mysql = require('mysql');
// var con = mysql.createConnection({
//     host: "localhost",
//     user: "root",
//     password: "",
//     database: "zarathemes"
// });
//
//
// con.connect(function (error) {
//     if (!!error) {
//         console.log('Error');
//     } else {
//         //console.log('Connected');
//     }
// });
// var base_url = 'https://192.168.0.133/zarathemes/';
// app.get('/', function(req, res){
//     res.sendFile(__dirname + '/index.html');
// });
var users = {};
//var admin = {};
io.on('connection',function(socket) {
    //console.log(socket);
    // if (socket.handshake.query.userid == undefined) {
    //     admin[socket.handshake.query.admin] = new Array();
    //     admin[socket.handshake.query.admin] = socket;
    //     socket.join(socket.handshake.query.admin);
    //     //admin[socket.handshake.query.admin][0] = socket;
    //     console.log('connected ' + socket.handshake.query.admin);
    // } else {
        users[socket.handshake.query.userid] = new Array();
        users[socket.handshake.query.userid] = socket;
        socket.join(socket.handshake.query.userid);
        //users[socket.handshake.query.userid][0] = socket;
        //console.log('connected ' + socket.handshake.query.userid);
    // }


    //socket.join(socket);
    socket.on('send message', function (namedata) {
        //console.log(users);
        //console.log(client_data);
        io.to(namedata.client_data.from).emit('incoming message',namedata.client_data);
        io.to(namedata.client_data.to).emit('incoming message',namedata);

    });


    socket.on('disconnect', function() {
        if(socket.handshake.query.userid!=undefined){
            //console.log('disconnected '+socket.handshake.query.userid);

            users[socket.handshake.query.userid]--;

               auto_logout(socket.handshake.query.userid);




            //console.log("kyada users are "+users[socket.handshake.query.username].length);
            //console.table(socket);
        }



    });


    // socket.on('chat_history', function (userdata) {
    //     var sql = "SELECT * FROM chat where (sender=" + userdata.from + " AND receiver='admin1') OR (sender='admin1' AND receiver=" + userdata.from + ")";
    //     // var sql1 = "SELECT * FROM chat where ";
    //     con.query(sql, function (error, result) {
    //         // con.query(sql1,function (error,result) {
    //         //io.to(admin_data.from).emit('getuser_data',result);
    //         // var result2 = mergeJSON.merge(result1,result) ;
    //         //console.log(result2);
    //         socket.emit('chat_history_list',result);
    //         // console.log(result1);
    //         // });
    //     });
    //
    // });

    //console.log(data);
    // socket.on('getchat_user',function (admin_data) {
    //     con.query("SELECT DISTINCT sender FROM chat WHERE sender!='admin1'", function (error, result) {
    //
    //         //console.log("SELECT DISTINCT sender FROM chat AND sender!='admin1'");
    //         io.to(admin_data.from).emit('getuser_data', result);
    //         //console.log(result);
    //     });
    //
    // });

    // socket.on('getchatalldata', function (id) {
    //     var sql = "SELECT * FROM chat where (sender=" + id + " AND receiver='admin1') OR (sender='admin1' AND receiver=" + id + ")";
    //     var sql1 = "SELECT * FROM user WHERE user_id=" + id + "";
    //     con.query(sql, function (error, result1) {
    //         con.query(sql1, function (error, result2) {
    //             //console.log(result);
    //             var result = {
    //                 chatdata: result1,
    //                 userdata: result2
    //             };
    //             socket.emit('chat_data',result);
    //         });
    //     });
    // });


    socket.on('sendmessage admin', function (data) {

        // //console.log(data);
        // var query = "INSERT INTO chat (sender,receiver,message) VALUES (";
        // query += " '" + data.from + "',";
        // query += " '" + data.to + "',";
        // query += " '" + data.message + "')";
        // console.log(query);
        // con.query(query, function (error, result) {
        //     if (result) {
                io.to(data.from).emit('live_chat',data);
                io.to(data.to).emit('live_chat',data);
            // }
        // });
    });


    // socket.on('getuser_details_request', function(admin_data_send) {
    //     var sql = "SELECT * FROM user where user_id=" + admin_data_send.id + "";
    //     var sql1 = "SELECT * FROM chat where sender=" + admin_data_send.id + " AND receiver='admin1' AND status=0";
    //     con.query(sql, function (error, resultdata) {
    //         //console.log(resultdata);
    //         con.query(sql1, function (error, resultdata1) {
    //             //console.log(resultdata);
    //             //console.log(resultdata);
    //             var countdata = resultdata1.length;
    //             var result_send = {
    //                 resultdata: resultdata,
    //                 countdata: countdata
    //             };
    //             //console.log(result_send);
    //             io.to(admin_data_send.from).emit('getuser_details', result_send);
    //         });
    //     });
    // });


    // socket.on('unread_message_count',function (count_data_send){
    //     var sql = "SELECT * FROM chat where sender="+count_data_send.id+" AND receiver='admin1' AND status=0";
    //     console.log(sql);
    //     con.query(sql,function (error,countdata) {
    //         //console.log(countdata.length);
    //
    //         io.to(count_data_send.from).emit('unread_message',countdata.length);
    //     });
    // });


    socket.on('file_upload_sending', function (alldata) {
//        console.log(alldata.filedata.message);
//         var query1 = "SELECT * FROM user where user_id=" + alldata.from + "";

        var client_data = {
            to: alldata.to,
            from: alldata.from,
            message: alldata.filedata.message
        };
        //console.log(client_data);
        io.to(alldata.from).emit('incoming message',client_data);
        // con.query(query1, function (error, result1) {
            var namedata = {
                lastid: alldata.lastid,
                client_data:client_data,
                userdata:alldata.userdata
            };
            io.to(client_data.to).emit('incoming message', namedata);
        // });
    });

    socket.on('logoutchangestatus',function (id) {
        io.to('admin1').emit('offline',id);
    });

    socket.on('loginevent',function (id) {
        io.to('admin1').emit('online',id);
    });
    socket.on('file_upload_sending_admin', function (alldata) {

        var client_data = {
            to: alldata.to,
            from: alldata.from,
            message: alldata.filedata.message
        };

        io.to(client_data.from).emit('live_chat', client_data);
        io.to(client_data.to).emit('live_chat', client_data);

    });

    function auto_logout(user_handshake){
        //console.log(user_handshake);

        if(user_handshake=='admin1'){
            //console.log('this will logout '+user_handshake);
        }else {

            //setTimeout(function () {
            //var id = user_handshake;
            //console.log('this will logout '+user_handshake);

            //io.to(user_handshake).emit('autologout',user_handshake);
            //con.query("UPDATE users set status='0',designation='kallia' WHERE id='"+id+"'");
             //con.query("UPDATE user set user_online='0' WHERE user_id='"+user_handshake+"'");
            // con.query("UPDATE tasks set divert_time='0000-00-00 00:00:00', task_status='0', final_status='pause' WHERE worker_id='"+id+"' and task_status='1' and ( final_status='start' or final_status='resume' or final_status='start_again') ");

            //con.query("SELECT * FROM users where id='"+id+"'");

            //}, 10000);

        }

    }

    socket.on('stream',function(imagedata){
        //console.log(imagedata.to);
        socket.to(imagedata.to).emit('stream',imagedata.image);
    });





});


http.listen(port, function () {
    console.log('listening on *:' + port);
});


