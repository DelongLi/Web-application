// user list for display
var user_list=[];

// update user_list and print into html
function display(){
  var users="";
  $.get("/getdatas", function(data){
    for(var i=0; i<data.results.length; i++)
    {
      users+=data.results[i].username;
      users+=" &nbsp &nbsp ";
      if(user_list.includes(data.results[i].username))
      {
        continue;
      }
      else{
        user_list.push(data.results[i].username);
      }
    }
    document.getElementById("user_list1").innerHTML=users;
  })
}

// add user
function add_user(){
  var errors="";
  document.getElementById("error_info1").innerHTML=errors;
  var s_name = $("#d_name").val();
  var s_age = $("#d_age").val()
  var s_gend = $("#d_gend").val();
  var s_weig = $("#d_weig").val();
  var s_heig = $("#d_heig").val();
  var s_pass = $("#d_pass").val();
  if(s_name.length==0){
    errors="Name can't be empty.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (s_weig.length==0) {
    errors="Please enter weight.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (s_heig.length==0) {
    errors="Please enter height.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (s_age.length==0) {
    errors="Please enter age.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (s_gend.length==0) {
    errors="Please select gender.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (s_pass.length==0) {
    errors="Please enter password.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (user_list.includes(s_name)) {
    errors="This user already exists, if you want to update his/her information, click 'Update information' button.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else{
    $.post("/add", {username:s_name,age:s_age,gender:s_gend,weight:s_weig,height:s_heig,password:s_pass}, function(){
      display();
      errors="Successfully added user: "+s_name;
      document.getElementById("error_info1").innerHTML=errors;
    });
  }
}

//put user information into each input value
function sync(){
  var errors="";
  document.getElementById("error_info1").innerHTML=errors;
  var s_name = document.getElementById("d_name").value;
  if(user_list.includes(s_name)){
    $.post('/get_by_name', {username:s_name}, function(data){
      if(data.results[0].isadmin==1)
      {
        document.getElementById("error_info1").innerHTML="Admin account cannot be modified."
        document.getElementById("d_pass").value="**********";
      }
      else
      {
        document.getElementById("d_pass").value=data.results[0].password;
      }
      $("#d_age").val(data.results[0].age);
      $("#d_gend").val(data.results[0].gender);
      document.getElementById("d_weig").value=data.results[0].weight;
      document.getElementById("d_heig").value=data.results[0].height;
      
    })
    errors+="Here's the information of the user: ";
    errors+=s_name;
    document.getElementById("error_info1").innerHTML=errors;
  }else{
    $("#d_age").val(20);
    $("#d_gend").val("Gender");
    document.getElementById("d_weig").value=65;
    document.getElementById("d_heig").value=170;
    document.getElementById("d_pass").value="123456";
  }
}

// delete user
function del_user(){
  document.getElementById("error_info1").innerHTML="";
  var s_name = document.getElementById("d_name").value;
  if(s_name.length==0){
    errors="Name can't be empty, please choose a user to delete.";
    document.getElementById("error_info1").innerHTML=errors;
    return false;
  }else if(user_list.includes(s_name)){
    $.post('/get_by_name', {username:s_name}, function(data){
      if(data.results[0].isadmin==1){
        document.getElementById("error_info1").innerHTML="You can't edit admin accont";
        return false;
      }else{
          $.post('/delete', {username:s_name}, function(){
          user_list.splice(0,user_list.length);
          display();
          document.getElementById("error_info1").innerHTML="Successfully deleted user "+s_name;
          return true;
        })
      }
    })
  }else{
    document.getElementById("error_info1").innerHTML="This student does not exist, cannot delete.";
    return false;
  }
}

//update user information by delete old one and add new one into it
function update(){
  document.getElementById("error_info1").innerHTML="";
  var s_name = $("#d_name").val();
  var s_age = $("#d_age").val()
  var s_gend = $("#d_gend").val();
  var s_weig = $("#d_weig").val();
  var s_heig = $("#d_heig").val();
  var s_pass = $("#d_pass").val();
  if(s_name.length==0){
    errors="Name can't be empty, please choose a user to update information.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (s_weig.length==0) {
    errors="Please enter weight to update.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (s_heig.length==0) {
    errors="Please enter height to update.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (s_age.length==0) {
    errors="Please enter age to update.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (s_gend.length==0) {
    errors="Please enter gender to update.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (s_pass.length==0) {
    errors="Please enter password to update.";
    document.getElementById("error_info1").innerHTML=errors;
  }
  else if (user_list.includes(s_name)) {
    $.post('/get_by_name', {username:s_name}, function(data){
      if(data.results[0].isadmin==1){
        document.getElementById("error_info1").innerHTML="You can't edit admin accont";
        return false;
      }else{
          $.post('/delete', {username:s_name}, function(){
          user_list.splice(0,user_list.length);
          $.post("/add", {username:s_name,age:s_age,gender:s_gend,weight:s_weig,height:s_heig,password:s_pass}, function(){
          display();
          document.getElementById("error_info1").innerHTML="Successfully updated informations of "+s_name;
          return true;
          })
        })
      }
    })     
  }else{
    document.getElementById("error_info1").innerHTML="This student does not exist, cannot update.";
  }
}

$(document).ready(function(){
  //while get into page display users list
  display();
  //while enter a name in users list get all of this user's information and sync()
  document.getElementById("d_name").onkeyup=function(){
    sync();
  };
});
