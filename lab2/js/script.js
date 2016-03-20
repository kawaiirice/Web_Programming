appState = {
	firstClick : 0,
	numRounds : 0, 
  numWrongMatches: 0,
  timeRemain: 90
};

$(document).ready(function(){
    $("#btn").click(onClick);
});

function onClick(){
	var n = $("#n").val();
	//debugger; //stops code to see value of variables in code (look in scope far right)

	if (n>=2 && n <=12){
        $("#gen").hide();
        $("#score").hide();
        $("#correct").hide();
        $("#incorrect").hide();
        $("#msg").html("Now match cell on left with one on right. You have 90 seconds and a maximum of 3 wrong matches.");
        makeTable(n);
        timer = setTimeout(gameOver, 90000);
        $('#countdown').html("Time left: 90").show();
        interval = setInterval(countdown, 1000);
        processGame(n);
        }	

     else
     	$("#msg").html("Please select a worksheet size between 2 and 12.");
}

function countdown(){
   appState.timeRemain--;
   if(appState.timeRemain >= 0)
    $('#countdown').html("Time left: " + appState.timeRemain);
}

function gameOver(num){
  var n = $("#n").val();
  var score = 0;

  $("td").addClass('matched');
  $("#gen").show();

  if(num == 1){
    $("#msg").html("Congratulations! You're a winner! Restart?");
    clearTimeout(timer);
  }
  else if(num == 2){
    $("#msg").html("Game Over: You ran out of moves. Restart?");
    clearTimeout(timer);
  }  
  else{
    $("#msg").html("Game Over: You ran out of time. Restart?");
  }  

  clearInterval(interval);
  score = appState.numRounds*20 - appState.numWrongMatches*5 - (90-appState.timeRemain); //scoring

  $("#score").html("Score: " + score).show(); 
  $('#correct').html("Correct Matches: " + appState.numRounds).show(); 
  $('#incorrect').html("Incorrect Matches: " + appState.numWrongMatches).show();

  appState.firstClick = 0;
  appState.numRounds = 0;
  appState.numWrongMatches = 0;
  appState.timeRemain = 90;
}

function processGame(n){
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


              if(first_id == second_id && (first_class != second_class))
              {
                appState.numRounds++;
                first.addClass('matched');
                second.addClass('matched');
                $("#msg").html("Congratulations. A match.");
              }
              else if(first_class == second_class){
                $("#msg").html("Matching pairs should be in different columns");
                appState.numWrongMatches++;
              }
              else{
                $("#msg").html("Try again. Images don't match.");
                appState.numWrongMatches++;
              }

              first.removeClass("selected");

              if(appState.numWrongMatches == 3){
                gameOver(2)
              }

              if(appState.numRounds == n) {
                gameOver(1);
              }
               appState.firstClick = 0; 
            }
         }   
    });
}

function makeTable(n){	

	$("#tbl").empty() //empty table contents

  var left_col = [];
  var right_col = [];

  var shuffled_left = [];
  var shuffled_right = [];

	for(var x = 0; x < n; x++){
		left_col.push(x);
		right_col.push(x);
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
		var newRow = tableRef.insertRow(0);
		
    var cell1  = newRow.insertCell(0);
		cell1.setAttribute("class", "left");

		var newImg = document.createElement("IMG");
  	newImg.setAttribute("src", "penguin/" + shuffled_left[i] + ".png");
  	
    cell1.appendChild(newImg);
  	cell1.setAttribute("id", shuffled_left[i]);

  	var cell2  = newRow.insertCell(1);
  	cell2.setAttribute("class", "right");

		newImg = document.createElement("IMG");
  	newImg.setAttribute("src", "penguin/" + shuffled_right[i] + ".png");
  	
    cell2.appendChild(newImg);
  	cell2.setAttribute("id", shuffled_right[i]);
	}
}