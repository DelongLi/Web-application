var sets = [0,0,0,0,0,0,0,0,0];
var setcal = [12,15,21,25,23,17,22,16,9];
$.get("/workoutplan", function(data){
  sets[0] = data.workoutset1;
  sets[1] = data.workoutset2;
  sets[2] = data.workoutset3;
  sets[3] = data.workoutset4;
  sets[4] = data.workoutset5;
  sets[5] = data.workoutset6;
  sets[6] = data.workoutset7;
  sets[7] = data.workoutset8;
  sets[8] = data.workoutset9;
  //change left list
  document.getElementById("workout1").innerText = sets[0];
  document.getElementById("workout2").innerText = sets[1];
  document.getElementById("workout3").innerText = sets[2];
  document.getElementById("workout4").innerText = sets[3];
  document.getElementById("workout5").innerText = sets[4];
  document.getElementById("workout6").innerText = sets[5];
  document.getElementById("workout7").innerText = sets[6];
  document.getElementById("workout8").innerText = sets[7];
  document.getElementById("workout9").innerText = sets[8];
  //change total calories
  document.getElementById("totalcal").innerText = sets[0]*setcal[0]+sets[1]*setcal[1]+sets[2]*setcal[2]+sets[3]*setcal[3]+sets[4]*setcal[4]+sets[5]*setcal[5]+sets[6]*setcal[6]+sets[7]*setcal[7]+sets[8]*setcal[8];
  //change sets
  document.getElementById("workoutset1").value = sets[0];
  document.getElementById("workoutset2").value = sets[1];
  document.getElementById("workoutset3").value = sets[2];
  document.getElementById("workoutset4").value = sets[3];
  document.getElementById("workoutset5").value = sets[4];
  document.getElementById("workoutset6").value = sets[5];
  document.getElementById("workoutset7").value = sets[6];
  document.getElementById("workoutset8").value = sets[7];
  document.getElementById("workoutset9").value = sets[8];
});

//update
function js_method(){//update all sets
  sets[0]=document.getElementById("workoutset1").value;
  sets[1]=document.getElementById("workoutset2").value;
  sets[2]=document.getElementById("workoutset3").value;
  sets[3]=document.getElementById("workoutset4").value;
  sets[4]=document.getElementById("workoutset5").value;
  sets[5]=document.getElementById("workoutset6").value;
  sets[6]=document.getElementById("workoutset7").value;
  sets[7]=document.getElementById("workoutset8").value;
  sets[8]=document.getElementById("workoutset9").value;
  document.getElementById("workout1").innerText = sets[0];
  document.getElementById("workout2").innerText = sets[1];
  document.getElementById("workout3").innerText = sets[2];
  document.getElementById("workout4").innerText = sets[3];
  document.getElementById("workout5").innerText = sets[4];
  document.getElementById("workout6").innerText = sets[5];
  document.getElementById("workout7").innerText = sets[6];
  document.getElementById("workout8").innerText = sets[7];
  document.getElementById("workout9").innerText = sets[8];
  document.getElementById("totalcal").innerText = sets[0]*setcal[0]+sets[1]*setcal[1]+sets[2]*setcal[2]+sets[3]*setcal[3]+sets[4]*setcal[4]+sets[5]*setcal[5]+sets[6]*setcal[6]+sets[7]*setcal[7]+sets[8]*setcal[8];
}

document.getElementById("submitp").onclick = function(){
$.post("/submitplan", {workout1:sets[0], workout2:sets[1], workout3:sets[2], workout4:sets[3], workout5:sets[4], workout6:sets[5], workout7:sets[6], workout8:sets[7], workout9:sets[8]  });
   var message = document.getElementById("submitSuccess");
  alert("Submit succeeded!");

}
