appState = {
	firstClick : 0,
	numPenguins : 0, 
  totalScore: 0
};

score = []; // should be an array with key of format (i, j)
solution = [];

$(document).ready(function(){
  $('#myModal').modal({show: true});
  //$("#btn").click(onClick);
  logButton(); //To get whether the button should display login or logout
});

function onClick(){
	var x = $("#x").val();
	// debugger;//stops code to see value of variables in code (look in scope far right)

	if (x>=1 && x <=9){
    $('#myModal').modal('hide');
    $("#msg").html("Make as many penguins eat food and then maximize the total score.");
    $("#msg2").html("");
    $("#modmsg").html("Select a worksheet (Easy: 1-3, Medium: 4-6, Hard: 7-9) and click 'Generate Worksheet'.");
    
    appState.firstClick = 0;
    appState.numPenguins = 0;
    appState.totalScore = 0;

    //Insert Server Request Code here for L, R, E
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var data = JSON.parse(xmlhttp.responseText);
        saveScores(data["L"].length, data["R"].length, data["E"]);
        makeTable(data["L"], data["R"]); //code to make table with specified image numbers
        drawEdges(data["L"].length, data["R"].length);
        processGame(); //code to process the game
      }
      if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
        $("#msg").html("Invalid request"); 
      }
    };
    xmlhttp.open("GET", "matching.php?cmd=generate&graph_id=" + x, true);
    xmlhttp.send();
  }	

  else{
      $("#modmsg").html("Please select X from 1 to 9.");
  }
}
/* -----------------------------------Login and Logout logistics---------------------------------------------- */

function logButton() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var data = xmlhttp.responseText;
      $('#inout').html(data)  
    }
  };  
  xmlhttp.open("GET", "matching.php?cmd=log", true);
  xmlhttp.send(); 
}

function login() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      var data = xmlhttp.responseText;
      if(data == "Login")
        window.location.replace("login.php");
      else
        window.location.replace("logout.php");  
    }
  };  
  xmlhttp.open("GET", "matching.php?cmd=log", true);
  xmlhttp.send();
}

/* ----------------------------------Getting solutions----------------------------------------------- */

function solve(){
  var x = $("#x").val(); 
  var sol = JSON.stringify(solution);
  var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var data = JSON.parse(xmlhttp.responseText); //database values
        if(data["new_best"]== 1){
          $('#modmsg2').html("Your solution of " + appState.numPenguins + " penguins and " + appState.totalScore + " points is the highest so far.<br><br>Best recorded from our database:<br> Number of matches: " + data["num_match"] + "<br>Score: " + data["match_score"]+ "<br>Best Time: " + data["best_time"]);
        }  
        else{
          $('#modmsg2').html("Your solution is NOT the highest so far. <br><br>Best recorded from our database:<br> Number of matches: " + data["num_match"] + "<br>Score: " + data["match_score"] + "<br>Best Time: " + data["best_time"] + "<br>Reset and try again :(");
        }  
        getOptimal();
      }

      if (xmlhttp.readyState == 4 && xmlhttp.status == 400) {
        $("#msg").html("Invalid request"); 
        $("#modmsg2").html("Invalid request"); 
      }
    };
    xmlhttp.open("GET", "matching.php?cmd=solve&graph_id=" + x + "&solution=" + sol, true);
    xmlhttp.send(); 
}

function getOptimal(){
  var x = $("#x").val(); 
  var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        var data = JSON.parse(xmlhttp.responseText); //solution edges

        if(data["match_score"] == appState.totalScore && data["num_match"] == appState.numPenguins){
          $('#modmsg3').html("<br>Congratulations. You found the optimal solution.");
        }
        else{
          $("#modmsg3").html("<br>Sorry, you didn't find the optimal score.");
        }
      }
    };
    xmlhttp.open("GET", "matching.php?cmd=solve&graph_id=" + x, true);
    xmlhttp.send(); 
}

function saveScores(l_length, r_length, edge_list){
  score.splice(0, score.length); //empty score array
  solution.splice(0, solution.length); //empty solution array here too?

  // creating 2D array and initializing scores to 0
  for(var i = 0; i < l_length; i++){
    score[i] = new Array();
    for(var j = 0; j < r_length; j++){
      score[i].push(0);
    }
  }

  var l, r, val;
  for(var i = 0; i < edge_list.length; i++){
    l = edge_list[i][0];
    r = edge_list[i][1];
    val = edge_list[i][2];

    score[l][r] = val;    
  }
}

/* -----------------------------------Making Table---------------------------------------------- */

function makeTable(l, r){
  $("#tbl").empty(); //empty table contents

  var n = Math.max(l.length, r.length);

  for(var i = 0; i < n; i++){
    var tableRef = document.getElementById("tbl");
    var newRow = tableRef.insertRow(-1);
   
    //Insert Left cell
    var cell1  = newRow.insertCell(0);
    //Check if images needs to be inserted
    if(i >= l.length){
       cell1.setAttribute("class", "col-xs-4 col-sm-4 col-md-4 enlarge");
    }  
    else{
      cell1.setAttribute("class", "left col-xs-4 col-sm-4 col-md-4 enlarge");

      //creating an image
      var newImg = document.createElement("IMG");
      newImg.setAttribute("src", "penguin/" + l[i] + ".png");
      
      //setting image size
      if(screen.width >= 768)
        newImg.setAttribute("class", "big");
      else
        newImg.setAttribute("class", "small");

      cell1.appendChild(newImg);
      cell1.setAttribute("id", i); // id = current row     
    }

    //adding middle canvas
    if(i == 0){
      var midCol = newRow.insertCell(-1);
      midCol.setAttribute("class","col-xs-4 col-sm-4 col-md-4");
      midCol.setAttribute("rowspan", n);
      midCol.setAttribute("id", "midCol");
      var height = n * 100
      if(screen.width >= 768)
        $('#midCol').html('<canvas id="cvs" width="300" height="' + height + '" ;"></canvas>');
      else
        $('#midCol').html('<canvas id="cvs" width="100" height="' + height + '" ;"></canvas>');
    }

    //Insert Right Cell
    var cell2  = newRow.insertCell(-1);
    //Check if images needs to be inserted
    if(i >= r.length){
      cell2.setAttribute("class", "col-xs-4 col-sm-4 col-md-4 enlarge");
    }
    else{
      cell2.setAttribute("class", "right col-xs-4 col-sm-4 col-md-4 enlarge");
      newImg = document.createElement("IMG");
      newImg.setAttribute("src", "food/" + r[i] + ".png");
      
      //setting image size
      if(screen.width >= 768)
        newImg.setAttribute("class", "big");
      else
        newImg.setAttribute("class", "small");
      
      cell2.appendChild(newImg);
      cell2.setAttribute("id", i);
    }
  }
}

/* ------------------------------------Processing Game--------------------------------------------- */

function processGame(){
  $("td").on("click", function(){
    var first_id, first_class;
    var second, second_id, second_class;

    if(!($(this).hasClass('matched'))){

      if(appState.firstClick == 0){
          $(this).addClass("selected");
          first = $(this);
          appState.firstClick = 1;
        }

      else{
        second = $(this);
        second_id = $(this).attr("id");
        second_class = $(this).attr('class').split(/\s+/)[0];

        first_id = first.attr("id");
        first_class = first.attr('class').split(/\s+/)[0];

        if(first_class == second_class){
          $("#msg").html("Match penguin with food.");
        }

        // *TODO: could be accessing undefined range of score array
        else if((first_class == "left" && score[first_id][second_id]!=0) || (first_class == "right" && score[second_id][first_id] != 0)) 
        {
          first.addClass('matched');
          second.addClass('matched');
          appState.numPenguins++;

          if(first_class == "left"){
            appState.totalScore+=score[first_id][second_id];
            drawLines(first_id, second_id, "red", 4);
            var arr = [first_id, second_id]; //add to the 2D sol array
            solution.push(arr);
          }
          else{
            appState.totalScore+=score[second_id][first_id];
            drawLines(second_id, first_id, "red", 4);
            var arr = [second_id, first_id]; //add to the 2D sol array
            solution.push(arr);
          }

          $("#msg").html("You have made " + appState.numPenguins + " penguin(s) eat with " + appState.totalScore + " points.");
        }

        first.removeClass("selected");
        appState.firstClick = 0; 
      }
     }   
  });
}

/* ----------------------------------Drawing with HTML5 Canvas----------------------------------------------- */

//draw Edges of the graph in the beginning
function drawEdges(l_length, r_length){
  for(var i = 0; i < l_length; i++){
    for(var j = 0; j < r_length; j++){
      if(score[i][j] > 0){
        drawLines(i, j, "black", 1);
        insertScore(i, j, score[i][j])
      }
    }
  }
}

// draw a line between two of the specified indices
function drawLines(l, r, color, width){
  var diff = Math.abs(l-r);
  if(diff <=1){
    drawStraightLine(l, r, color, width);
  }
  else{
    drawCurvyLine(l, r, color, width);
  }
}

function drawStraightLine(l, r, color, width){
  var canvas = document.getElementById('cvs');
  var context = canvas.getContext('2d');

  context.beginPath();
  if(screen.width >= 768){
    context.moveTo(0, l*100 + 50);
    context.lineTo(300, r*100 + 50);
  }
  else{
    context.moveTo(0, l*100 + 50);
    context.lineTo(100, r*100 + 50);
  }
  context.strokeStyle = color; 
  context.lineWidth = width; 
  context.stroke();
}

function drawCurvyLine(l, r, color, width){
  var c = document.getElementById("cvs");
  var ctx = c.getContext("2d");

  ctx.beginPath();
    if(screen.width >= 768){
      ctx.moveTo(0, l*100 + 50);
      ctx.bezierCurveTo(150, l*100 + 50, 150, r*100 + 50, 300, r*100 + 50);
    }
    else{
      ctx.moveTo(0, l*100 + 50);
      ctx.bezierCurveTo(50, l*100 + 50, 50, r*100 + 50, 100, r*100 + 50);
    }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;  
  ctx.stroke();
}

function insertScore(l, r, s){
  var canvas = document.getElementById('cvs');
  var context = canvas.getContext('2d');
  
  if(screen.width >= 768){
    context.font="16px Georgia";
    if(l>r+1) 
      context.fillText(s, 30,r*100 + 40);
    else if(r > l+1)
      context.fillText(s, 270,r*100 + 40);
    else
      context.fillText(s, 150,(l+r)*100/2 + 45);
   }
   else{
    context.font="10px Georgia";
    if(l>r+1)
      context.fillText(s, 20,r*100 + 45); 
    else if(r > l+1)
      context.fillText(s, 80,r*100 + 45); 
    else 
      context.fillText(s, 50,(l+r)*100/2 + 45);    
   }   
}