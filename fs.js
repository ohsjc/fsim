/* NOTES:

add age to player

*/

var lNames = ["Smith", "Anderson", "Clark","Wright","Mitchell","Johnson",
"Thomas","Rodrick","Lopez","Peterson","Williams","Jackson",
"Lewis","Hill","Roberts","Jones","White","Lee","Scott","Turner",
"Brown","Harris","Walker","Green","Phillips","Davis","Martin",
"Hall","Adams","Campbell","Miller","Thompson","Allen","Baker",
"Parker","Wilson","Garcia","Young","Gonzalez","Evans","Moore",
"Martinez","Jordan","Nelson","Edwards","Taylor","Robinson",
"King","Carter","Collins"];

var fNames = ["James","Christopher","Ronald","John","Daniel","Anthony",
"Robert","Kevin","Michael","Mark","Jason","William","Donald",
"Jeff","David","George","Richard","Charles","Steven","Joseph",
"Edward","Thomas","Brian","Cameron","Isaiah","Malik","Xavier",
"Jake","Connor","Wyatt","Luke","Jack","Logan","Lucas","Jacob",
"Maxwell","Brett","Colin","Andre","Terrell","Tyrone","Willy",
"Maurice","Jalen","Terrance","Darryl","Carlos","Samuel","Pedro",
"Luis"];

var positionList = ["Quarterback", "Halfback", "Wide Reciever", "Tight End",
"O-Line", "D-Line", "Linebacker", "Cornerback", "Safety", "Kicker"];

/*function askUser(questionString){//unused because it's broken
  console.log(questionString);
  process.stdin.setEncoding('utf8');
  var userInput;
  process.stdin.on('readable', function() {
    userInput  = process.stdin.read();
      if (userInput !== null) {
          process.exit();
        }
  });
  return userInput;
}
*/

var ball = {//MASTER OBJECT ball stores variables like position, possesion
  pos: 0, // location on field (0 - 100 or ?)
  hold: true, // true = home team, false = away
  down: 1, //one through four
  hScore: 0,
  aScore: 0,

  setPos: function (newPos){
    this.pos = newPos;
  },
  nextDown: function(){
    if (this.down < 4){
      this.down++;
    }
    else{
      this.flipHold();
    }
  },
  flipHold: function () {
    if (this.hold){
      this.hold = false;
    }
    else {
      this.hold = true;
    }
    this.down = 1;
  },
  setHold: function (bool){
    this.hold = bool;
    },
  giveScore: function (bool, points){
    if (bool){
      this.hScore += points;
    }
    else{
      this.aScore += points;
    }
  },

  ballStatus: function(){//for debug only please
    console.log("Ball is at: ", this.pos,"\n"+
                "Home team has the ball: ", this.hold,"\n"+
                "The down is: ", this.down,"\n"+
                "The home team has: ", this.hScore,"\n"+
                "The away team has: ", this.aScore);
  },
  reset: function(){//refine this to take hold maybe?
    this.pos = 0;
    this.hold = true;
    this.down = 1;
    this.hScore = 0;
    this.aScore = 0;
  }
};

function Player (fName,lName, position, stat){//player constructor
  this.fName = fName;
  this.lName = lName;
  this.position = position;
  this.stat = stat;
  this.fullName = fName + " " + lName;
  this.pName = positionList[position];
}

Player.prototype.details = function (){//displays info about player (debug)
  return "\n"+"Name: " + this.fullName +"\n"+
         "Position: " + this.pName + "\n"+
         "Ovr: " + this.stat + "\n";
};

function genPlayer(){//creates generic player
  function nameMaker(nameset){//function that random picks name
    return nameset[(Math.floor(Math.random() * nameset.length))];
  }
  function positionMaker(){
    return (Math.floor(Math.random() * 10));
  }
  function statMaker(){
    var stat = (Math.floor(Math.random() * 100));
    if (stat < 58){
      return statMaker();
    }
    else{
      return stat;
    }
  }
  return new Player (nameMaker(fNames),nameMaker(lNames),positionMaker(),
  statMaker());
}

function Team (name, colors, town, roster){//team constructior
  this.name = name;
  this.homeTown = town;
  this.colors = colors;
  this.roster = roster;
}

Team.prototype.arrange = function(){ //sort the team by position and stat
  function removeEmpty (roster){
    var empty = roster.indexOf("empty");
    console.log(empty)
    if (empty !== -1){
      roster.splice(empty, 1);
      removeEmpty(roster);
    }
  }
  this.roster.sort(function(a,b){
    return (a.position - b.position) || (b.stat - a.stat);
  });
  removeEmpty(this.roster);
};

Team.prototype.details = function(){//displays team info, (debug)
  this.arrange();
  var aRoster = [];
  for (var x = 0; x < this.roster.length; x++){
    aRoster.push([("\n\n" + this.roster[x]["fullName"]),
    ("\n" + this.roster[x]["pName"]),
    ("\n" + this.roster[x]["stat"]), ("\nID NO: " + x)]);
  }
  var tStat = this.stat();

Team.prototype.limits = function(){//checks team has correct sizes/players

  function checkSize (min, max){
    if 
    this.roster.length <
  }
}

  //was going to have this return but JSON returns roster as [object Object]
  return ("\n"+"Team name: " + this.homeTown + " " + this.name +"\n"+
         "Colors: " + this.colors + "\n"+
         "Stat: " + tStat + "\n" +
         "Active Player Roster: " + aRoster);
};

Team.prototype.stat = function(){
  var sumStat = 0;
  for (var x = 0; x < this.roster.length; x++){
    var curObj = this.roster[x];
    sumStat += curObj.stat;
  }
  return(sumStat / this.roster.length);
};

Team.prototype.cut = function(idNo, freeAgent){
    this.roster.splice(idNo, 1);
    if(freeAgent){
      this.roster.splice(idNo, 0, genPlayer());
    }
    else{
      this.roster.splice(idNo, 0, "empty");
    }
};

function genTeam(name, colors, town, rosterSize){//creates/populates new team{}
  var roster = [];
  for (var x = 0; x < rosterSize; x++){
    roster.push(genPlayer());
  }
  return new Team (name, colors, town, roster);
}

function promptAns (varAns, addedStrPrior, addedStrAfter){
  if (arguments.length < 3){
    addedStrAfter = "";
    if (arguments.length < 2){
      addedStrPrior = "";
    }
  }
  console.log(addedStrPrior + " " + varAns + " "+ addedStrAfter);
}

function playMatch(homeTeam, awayTeam){
  //var gameDetails{}; this will eventually return

  console.log("Today we have a match between the " + homeTeam.homeTown + " " +
  homeTeam.name + " and the " + awayTeam.homeTown + " " + awayTeam.name);

  function quarter(count){//normally 4, could be 1 if OT
    var z = 1;
    var rand = 0;

    for (z; z <= count; z++){
      rand = Math.floor(Math.random() * ((homeTeam.stat() + awayTeam.stat()) + 1));
      if (rand > homeTeam.stat()){
        ball.giveScore(false, 7);
      }
      else{
        ball.giveScore(true, 7);
      }
      ball.ballStatus();
      alert("End of Quarter " + z);
    }
  }
  quarter(4);
  while (ball.hScore === ball.aScore){
    alert("Overtime!");
    quarter(1);
  }

  alert("The final score is " + homeTeam.name + " " + ball.hScore + " - " +
  awayTeam.name + " " + ball.aScore);
  ball.reset();
  //return //game detail object
}

/////////////////////below this is initializing code////////////////////////////

var playerTeam = genTeam("Goats", "Grey", "Gettysburg", 25);
var opponentTeam = genTeam("Bees", "Black and Yellow", "Buzzington", 25);
var freeAgents = genTeam("Free Agents", "", "", 50);

/////////////////////play loop (please don't put things below this)////////////

var playing = true; //for play loop - false to quit

do{//play loop. Thinking about making this a function. will revisit
  var menuChoice = 0;
  menuChoice = prompt("1.Create teams\n2.Edit team\n3.View team\n4.View Opponent" +
  "\n5.Play match\n6.Quit");
  switch (parseInt(menuChoice)){
    case 1://create a team - init w/ default if for faster testing
        var tName = prompt("Please enter team Name");
        promptAns(tName, "Team Name:");
        var tColors = prompt("Please enter team Color(s)");
        promptAns(tColors, "Team Colors:");
        var tTown = prompt("Please enter team Town");
        promptAns(tTown, "Team Colors:");
        playerTeam = genTeam(tName, tColors, tTown, 25);
        alert("Team Created!");
        /* this is to user create an opponent team - probably won't come back
        var oName = prompt("Please enter team Name");
        promptAns(oName, "Team Name:");
        var oColors = prompt("Please enter team Color(s)");
        promptAns(oColors, "Team Colors:");
        var oTown = prompt("Please enter team Town");
        promptAns(oTown, "Team Colors:");
        opponentTeam = genTeam(oName, oColors, oTown, 25);
        alert("Opponent Team Created!");
        */
        break;
    case 2://add and cut players
      var subMenu = true;
      while (subMenu){
        var choice = prompt("Do you wish to: \n1. Sign free agents" +
        "\n2. Cut Players\n3. Back to Main menu");
        switch(parseInt(choice)){
          case 1:
              console.log("Free agents availble:");
              console.log(freeAgents.details());
              do{
                var signeeNum = prompt("Enter Player ID # you wish to sign " +
                "(type 99 to exit)");//fix this
                if (signeeNum <= freeAgents.roster.length && signeeNum >= 0){
                  var player = freeAgents.roster[signeeNum];
                  console.log("You have signed: \n" + player.details());
                  playerTeam.roster.push(player);
                  freeAgents.cut(signeeNum, true);
                }
                else if(signeeNum > freeAgents.roster.length || signeeNum < 0){
                  console.log("No player found, going back to subMenu");
                  signeeNum = 99;
                }
              }while(signeeNum !== 99);
              break;
          case 2:
          console.log("Player Roster:");
          console.log(playerTeam.details());
          do{
            var cutPlayer = prompt("Enter Player ID # you wish to cut " +
            "(type 99 to exit)");//fix this
            if (cutPlayer <= playerTeam.roster.length && cutPlayer >= 0){
              var player = playerTeam.roster[cutPlayer];
              console.log("You have cut: \n" + player.details());
              freeAgents.roster.push(player);
              playerTeam.cut(cutPlayer, false);
            }
            else if(cutPlayer > freeAgents.roster.length || cutPlayer < 0){
              console.log("No player found, going back to subMenu");
              cutPlayer = 99;
            }
          }while(cutPlayer !== 99);
              break;
          case 3:
              subMenu = false;
              break;
          default:
              console.log("Not found");
        }
   	 	}
      		break;
    case 3://display team
      console.log(playerTeam.details());
      break;
    case 4://display opponent team - this will go away or be changed
      console.log(opponentTeam.details());
      break;
    case 5://play a match... a lot to do here
      playMatch(playerTeam, opponentTeam);
      break;
    case 6://quit
      playing = false;
      break;
    default:
      console.log("Not found");
  }

}while(playing === true);
console.log("Thank you for playing");
