appState = {
	firstClick : 0,
	numRounds : 0, 
  numWrongMatches: 0,
  timeRemain: 90
};

match = [];

$(document).ready(function(){
    makeTable(4);
    processGame(4);
    $("#btn").click(onClick);
});

function onClick(){
	var n = $("#n").val();
	//debugger; //stops code to see value of variables in code (look in scope far right)

	if (n>=2 && n <=12){
        $("#msg").html("Match image on left with its identical on the right.");
        $("#modmsg").html("Select worksheet size and click 'Generate Worksheet'.");
        appState.firstClick = 0;
        appState.numRounds = 0;
        makeTable(n);
        processGame(n);
        }	

  else{
        $("#modmsg").html("Please select a worksheet size between 2 and 12.");
        $('#myModal').modal({show: true});
     }
}


//Code for making the tabl
function makeTable(n){
  // if(screen.width > screen.height)
  //   makeTableWide(n);
  // else
    makeTableTall(n);
}

function makeTableTall(n){	

	$("#tbl").empty() //empty table contents

  var left_col = [];
  var right_col = [];

  var shuffled_left = [];
  var shuffled_right = [];

  match.splice(0, match.length);
	for(var x = 0; x < n; x++){
		left_col.push(x);
		right_col.push(x);
    match.push(-1);
	}

  var node0, node1;

  for(var j = 0; j < n; j++){
    node0 = Math.floor(Math.random()*12)%(n-j); //get random index
    node1 = Math.floor(Math.random()*12)%(n-j);

    shuffled_left.push(left_col[node0]); //add random number to shuffled array
    shuffled_right.push(right_col[node1]);
    
    left_col.splice(node0, 1); // remove number from array
    right_col.splice(node1, 1);
  } 

  for(var k = 0; k < n; k++){
    if(shuffled_left[k] == shuffled_right[k]){
      var temp = shuffled_right[k]; 
      shuffled_right[k] = shuffled_right[(k+1)%n];
      shuffled_right[(k+1)%n] = temp;
    }
  }

	for(var i = 0; i <n; i++){
		var tableRef = document.getElementById("tbl");
		var newRow = tableRef.insertRow(-1);
		
    var cell1  = newRow.insertCell(0);
		cell1.setAttribute("class", "left " + i + " col-xs-4 col-sm-4 col-md-4");

		var newImg = document.createElement("IMG");
  	newImg.setAttribute("src", "penguin/" + shuffled_left[i] + ".png");
    if(screen.width >= 768)
      newImg.setAttribute("class", "big");
    else
      newImg.setAttribute("class", "small");

    cell1.appendChild(newImg);
  	cell1.setAttribute("id", shuffled_left[i]);

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

  	var cell2  = newRow.insertCell(-1);
  	cell2.setAttribute("class", "right " + i + " col-xs-4 col-sm-4 col-md-4");

		newImg = document.createElement("IMG");
  	newImg.setAttribute("src", "penguin/" + shuffled_right[i] + ".png");
    if(screen.width >= 768)
      newImg.setAttribute("class", "big");
    else
      newImg.setAttribute("class", "small");
  	
    cell2.appendChild(newImg);
  	cell2.setAttribute("id", shuffled_right[i]);
	}
}

function makeTableWide(n){  

  $("#tbl").empty(); //empty table contents

  var left_col = [];
  var right_col = [];

  var shuffled_left = [];
  var shuffled_right = [];

  match.splice(0, match.length);
  for(var x = 0; x < n; x++){
    left_col.push(x);
    right_col.push(x);
    match.push(-1);
  }

  var node0, node1;

  for(var j = 0; j < n; j++){
    node0 = Math.floor(Math.random()*12)%(n-j); //get random index
    node1 = Math.floor(Math.random()*12)%(n-j);

    shuffled_left.push(left_col[node0]); //add random number to shuffled array
    shuffled_right.push(right_col[node1]);
    
    left_col.splice(node0, 1); // remove number from array
    right_col.splice(node1, 1);
  } 

  // Checks for same image in same row
  for(var k = 0; k < n; k++){
    if(shuffled_left[k] == shuffled_right[k]){
      var temp = shuffled_right[k]; 
      shuffled_right[k] = shuffled_right[(k+1)%n];
      shuffled_right[(k+1)%n] = temp;
    }
  }

  //creates table
  var tableRef = document.getElementById("tbl");
  var firstRow = tableRef.insertRow(0);
  var secondRow = tableRef.insertRow(-1);
  var thirdRow = tableRef.insertRow(-1);

  secondRow.setAttribute("colspan", n);
  secondRow.setAttribute("id", "midCol");
  var width = n * 100
  if(screen.height >= 768)
    $('#midCol').html('<canvas id="cvs" width="' +  width + '" height="300" ;"></canvas>');
  else
    $('#midCol').html('<canvas id="cvs" width="' +  width + '" height="100" ;"></canvas>');

  for(var i = 0; i <n; i++){
    var cell1 = firstRow.insertCell(-1);
    cell1.setAttribute("class", "up " + i + " col-xs-4 col-sm-4 col-md-4"); 

    var newImg = document.createElement("IMG");
    newImg.setAttribute("src", "penguin/" + shuffled_left[i] + ".png");
    newImg.setAttribute("class", "big");

    cell1.appendChild(newImg);
    cell1.setAttribute("id", shuffled_left[i]);

    var cell2 = thirdRow.insertCell(-1);
    cell2.setAttribute("class", "down " + i + " col-xs-12 col-sm-12 col-md-12"); 

    newImg = document.createElement("IMG");
    newImg.setAttribute("src", "penguin/" + shuffled_right[i] + ".png");
    newImg.setAttribute("class", "big");

    cell2.appendChild(newImg);
    cell2.setAttribute("id", shuffled_right[i]);
  }
}


// Code for Processing the Game
function processGame(n){
    $("td").on("click", function(){
      var first_id, first_class;
      var second, second_id, second_class;

      if(!($(this).hasClass('matched'))){

          if(appState.firstClick == 0){
              $(this).addClass("selected");
              first = $(this);
              appState.firstClick = 1;
              $("#msg").html("Now match it with...");
            }

          else{
              second = $(this);
              second_id = $(this).attr("id");
              second_class = $(this).attr('class').split(/\s+/)[0];
              
              var row2 = $(this).attr('class').split(/\s+/)[1]; //getting row

              first_id = first.attr("id");
              first_class = first.attr('class').split(/\s+/)[0];

              var row1 = first.attr('class').split(/\s+/)[1];//

              if(first_id == second_id && (first_class != second_class))
              {
                appState.numRounds++;
                first.addClass('matched');
                second.addClass('matched');
                $("#msg").html("Congratulations. A match.");
                
                if(first_class == "left" || first_class == "up"){
                  match[row1] = row2;
                }
                else{
                  match[row2] = row1;
                }

                // if(screen.width > screen.height)
                //   drawLinesWide(match);
                // else
                  drawLines(match);
              }
              else if(first_class == second_class){
                $("#msg").html("Matching pairs should be in different columns");
              }
              else{
                $("#msg").html("Try again. Images don't match.");
              }

              first.removeClass("selected");

              if(appState.numRounds == n) {
                gameOver();
              }
               appState.firstClick = 0; 
            }
         }   
    });
}

function gameOver(){
  var n = $("#n").val();

  $("#gen").show();

  $("#msg").html("Congratulations! You're a winner! Restart?");
  $('#modmsg').html("Congratulations! You're a winner! Restart?");
  $('#myModal').modal();
}

// Functions for drawing lines
function drawLines(match){
  for(var i = 0; i < match.length; i++){
    if(match[i] != -1){
      var diff = Math.abs(i - match[i]);
      if(diff <=1){
        drawStraightLine(i, match[i]);
      }
      else{
        drawCurvyLine(i, match[i]);
      }
    } 
  }
}

function drawLinesWide(match){
  for(var i = 0; i < match.length; i++){
    if(match[i] != -1){
      var diff = Math.abs(i - match[i]);
      if(diff <=1){
        drawStraightLineWide(i, match[i]);
      }
      else{
        drawCurvyLineWide(i, match[i]);
      }
    } 
  }
}

function drawStraightLine(l, r){
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
    context.stroke();
}

function drawCurvyLine(l, r){
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
  ctx.stroke();
}

function drawStraightLineWide(u, d){
    var canvas = document.getElementById('cvs');
    var context = canvas.getContext('2d');

    context.beginPath();
    if(screen.length >= 768){
      context.moveTo(u*100 + 50, 0);
      context.lineTo(d*100 + 50, 300);
    }
    else{
      context.moveTo(u*100 + 50, 0);
      context.lineTo(d*100 + 50, 100);
    }
    context.stroke();
}

function drawCurvyLineWide(u, d){
  var c = document.getElementById("cvs");
  var ctx = c.getContext("2d");

  ctx.beginPath();
    if(screen.length >= 768){
      ctx.moveTo(u*100 + 50, 0);
      ctx.bezierCurveTo(u*100 + 50, 150, d*100 + 50, 150, d*100 + 50, 300);
   }
    else{
      ctx.moveTo(u*100 + 50, 0);
      ctx.bezierCurveTo(u*100 + 50, 50, d*100 + 50, 50, d*100 + 50, 100);
    }
  ctx.stroke();
}


