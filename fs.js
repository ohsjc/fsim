/* NOTES:

add age to player

function initialize (){
console.log("Initializing in limits");
var fLoc = positionCorrect.indexOf(false);
if (fLoc !== -1){
 for (var x = 0; x < roster.length; x++){
   var currentPlayer = roster[x];
   var currentPos = currentPlayer.position;
   if (currentPos === fLoc){
     // this isn't working!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     console.log("Got to currentPos floc pusshing or splicing now");
       if (positionCount[fLoc] < constraints[fLoc][0]){
         roster.push(new Player ("John", "Doe", fLoc, 75));
         positionCorrect[fLoc] = true;
       }
       else{
         roster.splice(x, 1);
         roster.splice(x, 0, "empty");
         positionCorrect[fLoc] = true;
       }
     }
   }
   initialize();
 }
}
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

var league = {
  north: [],
  south: [],
  week: 1,
  nWild: [],
  sWild: [],
  nPlayoffs: [],
  sPlayoffs: [],
  champs: [],
  champion: [],


  endWeek: function(){
    if (this.week === 12){
      this.north.sort(function(a,b){
        return b.record[0] - a.record[0];
      });
      this.south.sort(function(a,b){
        return b.record[0] - a.record[0];
      });
      this.nPlayoffs.push(this.north[0], this.north[1]);
      console.log(this.north[0]["name"] + " and " + this.north[1]["name"] +
      " have made the Playoffs");
      this.sPlayoffs.push(this.south[0], this.south[1]);
      console.log(this.south[0]["name"] + " and " + this.south[1]["name"] +
      " have made the Playoffs");
    }
      this.week++;
  },

  getStandings: function(div){
    var stands = [];
    for (var x = 0; x < 4; x++){
      var curTeam = div[x];
      stands.push([curTeam.name,curTeam.record, stat(curTeam.starters())]);
    }
    stands.sort(function(a,b){
      return b[1][0] - a[1][0];
    });

    function fixText(team){
      var name = team[0];
      var record = team[1];
      var start = team[2];
      return "\n   (" + Math.floor(start) + ") " + name + "  "+ record[0] + " - " + record[1];
    }

    for (var y = 0; y < 4; y++){
      stands[y] = fixText(stands[y]);
    }
    return stands[0] + stands [1] + stands[2] + stands [3];
  }

};

function playWeek(playfunc, week, north, south){

  function schedule(week){
    var x = (week % 3) + 1;
    var y = (x + 1) % 3;
    var z = (x + 2) % 3;
    if (y === 0){
      y = 3;
    }
    if (z === 0){
      z = 3;
    }

    return [0,x,y,z];
  }


  function singleMatch (playfunc, div, week){
    var sched = schedule(week);
    var g1 = playfunc(div[sched[0]], div[sched[1]]);
    div[sched[0]].game(g1[0]);
    div[sched[1]].game(g1[1]);
    var g2 = playfunc(div[sched[2]], div[sched[3]]);
    div[sched[2]].game(g2[0]);
    div[sched[3]].game(g2[1]);
  }
  singleMatch(playfunc, north, week);
  singleMatch(playfunc, south, week);
  league.endWeek();
}//prolly return something uh

var ball = {//MASTER OBJECT ball stores variables like position, possesion
  pos: 0, // location on field (0 - 100 or ?)
  hold: true, // true = home team, false = away
  down: 1, //one through four
  hScore: 0,
  aScore: 0,
  fDown: 0,

  setPos: function (newPos){
    this.pos = newPos;
  },
  setDown: function (newDown){
    this.down = newDown;
  },
  nextDown: function(){
    if (this.pos >= 100){
        ball.giveScore(ball.hold, 7);
        ball.setPos(80);
        ball.flipHold();
    }
    else if (this.pos < (this.fDown + 10)){
      if (this.down < 4){
        this.down++;
      }
      else{
        //console.log("Fourth Down! Turnover on downs");
        this.flipHold();

      }
    }
    else{
      //console.log("FIRST DOWN!!");
      this.setFirst(this.pos);
    }
  },
  setFirst: function(firstPos){
    this.fDown = firstPos;
    this.setDown(1);
  },
  flipHold: function () {
    if (this.hold){
      this.hold = false;
      this.setPos(100 - this.pos);
      this.setFirst(this.pos);
    }
    else {
      this.hold = true;
      this.setPos(100 - this.pos);
      this.setFirst(this.pos);
    }
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
                "First down at: ", (this.fDown + 10), "\n"+
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

function genPlayer(position, fName, lName, stat){//creates generic player
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
  if (arguments.length === 4){
    return new Player (fName, lName, position, stat);
  }
  else if (arguments.length === 3){
    return new Player (fName, lName, position, statMaker());
  }
  else if (arguments.length === 1){
    return new Player (nameMaker(fNames), nameMaker(lNames), position, statMaker());
  }
  else{
    return new Player (nameMaker(fNames),nameMaker(lNames),positionMaker(),
    statMaker());
  }
}

function Team (name, colors, town, roster, tID){//team constructior
  this.name = name;
  this.homeTown = town;
  this.colors = colors;
  this.roster = roster;
  this.record = [0,0];
  this.tID = tID;
}

Team.prototype.game = function (gameDetail){
  if (gameDetail.won === true){
    this.record[0]++;
  }
  else{
    this.record[1]++;
  }
};

Team.prototype.arrange = function(){ //sort the team by position and stat
  function removeEmpty (roster){
    var empty = roster.indexOf("empty");
    //console.log(empty);
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
  var starterStat = Math.floor(stat(this.starters()));
  var tStat = Math.floor(stat(this.roster));
  //was going to have this return but JSON returns roster as [object Object]
  return ("\n"+"Team name: " + this.homeTown + " " + this.name +"\n"+
         "Colors: " + this.colors + "\n"+
         "Stat: " + tStat + "\n" +
         "Starter Stat: " + starterStat + "\n" +
         "Active Player Roster: " + aRoster);
};

function stat(roster){
  var sumStat = 0;
  for (var x = 0; x < roster.length; x++){
    if (typeof roster[x] === 'undefined'){
      console.log("Undefined hole in roster");
    }
    else{
      var curObj = roster[x];
      sumStat += curObj.stat;
    }
  }
  return(sumStat / roster.length);
}

Team.prototype.cut = function(idNo, freeAgent){
    this.roster.splice(idNo, 1);
    if(freeAgent){
      this.roster.splice(idNo, 0, genPlayer());
    }
    else{
      this.roster.splice(idNo, 0, "empty");
    }
};

Team.prototype.limits = function(){//checks team has correct sizes/players
  var length = this.roster.length;
  var roster = this.roster;
  var constraints = [[2,3],[2,3],[3,5],[1,2],[4,6],[4,6],[3,5],[3,5],[2,4],[1,2]];
  var positionVal = [];
  var positionCount = [];
  var positionCorrect = [];

  function cFilt(a){
      return a === y;
    }

  function checkSize (position, positionCount, min, max){
    if (position === "all"){
      if  (positionCount < min || positionCount > max){
        console.log("Team size is " + positionCount+ ". Needs to be between " +
        min + " and " + max);
        return false;
      }
      else{
        return true;
      }
    }
    if (positionCount < min || positionCount > max){
      console.log("Position " + positionList[position] + " is " +
      positionCount + ". Needs to be between " + min + " and " + max);
      return false;
    }
    else{
      return true;
    }
  }

  for (var x = 0; x < roster.length; x++){
    var currentPlayer = roster[x];
    var currentPos = currentPlayer.position;
    positionVal.push(currentPos);
  }
  for (var y = 0; y < positionList.length; y++){
    var thisPos = positionVal.filter(cFilt);
    positionCount.push(thisPos.length);
  }

  for (var z = 0; z < positionList.length; z++){
    positionCorrect.push(checkSize(
      z,positionCount[z],constraints[z][0], constraints[z][1]));
  }

  positionCorrect.push(checkSize("all", length, 32, 35));

  return (positionCorrect.every(function (x){
    return x === true;
    }));
};

Team.prototype.starters = function(){
  this.arrange();
  var roster = this.roster;
  var startingArray = [];
  var mult = [2,4,5,6,7];

  function thisPos (player){
    return player.position === x;
  }

  for (var x = 0; x < positionList.length; x++){
    var currentPos = roster.filter(thisPos);
    if (mult.indexOf(x) === -1){
      startingArray.push(currentPos[0]);
    }
    else if (x === 4 || x === 5){
      startingArray.push(currentPos[0],currentPos[1],currentPos[2]);
    }
    else {
      startingArray.push(currentPos[0],currentPos[1]);
    }
  }

  //return new Team (this.name, this.colors, this.homeTown, startingArray);
  return startingArray;
  //return an array of starting players for team
};

function genTeam(name, colors, town, rosterSize){//creates/populates new team{}
  var roster = [];
  function pushPlayer (poArray){
    for (var y = 0; y < rosterSize; y++ ){
      for(var z = 0; z < poArray[y]; z++){
        roster.push(genPlayer(y));
      }
    }
  }

  pushPlayer([3,3,4,2,5,5,4,4,3,1]);

  if (roster.length < rosterSize){
    while (roster.length !== rosterSize){
      roster.push(genPlayer());
    }
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
  var gameDetailsHT = {};
  var gameDetailsAT = {};

  var hStart = homeTeam.starters();
  var aStart = awayTeam.starters();

  var hStat = Math.floor(stat(hStart));
  var aStat = Math.floor(stat(aStart));
  var playVal = 0;
  var oStat = 0;
  var dStat = 0;
  var oDiff = 0;
  var dDiff = 0;
  var rand = 0;
  var bigPlay = 0;
  var turnover = false;

  //console.log("Today we have a match between the " + homeTeam.homeTown + " " +
  //homeTeam.name + " and the " + awayTeam.homeTown + " " + awayTeam.name);
  //console.log("The Home rating is " + hStat + " and the Away rating is " + aStat);

  function quarter(qNum){
    if (qNum === 1){
      ball.setPos(20);
      ball.setHold(true);
      ball.setFirst(20);

    }
    if (qNum === 3){
      ball.setPos(20);
      ball.setHold(false);
      ball.setFirst(20);
    }

    for (var x = 0; x < 16; x++){
      runPlay();
      //console.log("Quarter: " + qNum + " Play count: " + x);

      if (qNum === "OT" && ball.hScore !== ball.aScore){
        x = 99;
      }
    }
  }

  function runPlay(){
    if (ball.hold === true){
      oStat = hStat;
      dStat = aStat;
    }
    else{
      oStat = aStat;
      dStat = hStat;
    }
    oDiff = oStat - dStat;
    if (oDiff <= 2){
      oDiff = 3;
    }
    dDiff = dStat - oStat;
    if (dDiff < 1){
      dDiff = 2;
    }

    rand = Math.floor(Math.random() * (oStat + dStat + 1));
    bigPlay  = (Math.floor(Math.random() * 8));

    if (rand <= oStat){
      playVal = Math.floor((((Math.random() * 100) * 2) * oStat)/1000);
      if (bigPlay === 0){
        playVal = playVal * oDiff;
        //console.log("Nice play by that player!");
      }
      //console.log("Play Success! Gained yards: " + playVal);
    }
    else{
      //console.log("Play Fail!");
      if (bigPlay === 0){
        playVal = Math.floor(((Math.random() * 100) * dStat)/1000);
        playVal = (0 - playVal);
        //console.log("Play Fail - loss of yards: " + playVal);
      }
      else if(bigPlay === 1){
        playVal = 0;
        //console.log("TURNOVER!!");
        turnover = true;
      }
      else{
        //console.log("Play Fail - incomplete");
        playVal = 0;
      }
    }
    ball.setPos(ball.pos + playVal);
    if (turnover === false){
      ball.nextDown();
    }
    else{
      ball.flipHold();
      turnover = false;
    }

    //console.log("Ball Status after play: ");
  //  ball.ballStatus();
  }

  for (var x = 1; x <=4; x++){
    //console.log("Playing quarter" + x);
    quarter(x);
  }

  while (ball.hScore === ball.aScore){
    //alert("Overtime!");
    ball.setPos(20);
    ball.setHold(true);
    ball.setDown(1);
    quarter("OT");

  }

  if (ball.hScore > ball.aScore){
    gameDetailsHT.won = true;
    gameDetailsAT.won = false;
  }
  else{
    gameDetailsHT.won = false;
    gameDetailsAT.won = true;
  }

  console.log(" " + homeTeam.name + " " + ball.hScore + " - " +
  awayTeam.name + " " + ball.aScore);
  ball.reset();
  var gameDetails = [gameDetailsHT, gameDetailsAT];
  return gameDetails;
  //return //game detail object
}

/////////////////////below this is initializing code////////////////////////////
var playerTeam = genTeam("Goats  ", "Grey and White", "Glensburg", 35, 0);
var oTeam1 = genTeam("Bees   ", "Black and Yellow", "Bizton", 35, 1);
var oTeam2 = genTeam("Cosmos ", "Blue and Black", "Highgate", 35, 2);
var oTeam3 = genTeam("Hunters", "Orange and Camo", "Cording", 35, 3);

var oTeam4 = genTeam("Wagons ", "Green and Black", "Wood Springs", 35, 0);
var oTeam5 = genTeam("Demons ", "Red and White", "Blackbridge", 35, 1);
var oTeam6 = genTeam("Colossi", "Blue and Silver", "Lilston", 35, 2);
var oTeam7 = genTeam("Petals ", "Pink and Yellow", "Pelmore", 35, 3);

league.north = [playerTeam,oTeam1,oTeam2,oTeam3];
league.south = [oTeam4,oTeam5,oTeam6,oTeam7];

var freeAgents = genTeam("Free Agents", "", "", 50, 99);

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
      //console.log(opponentTeam.details());
      break;
    case 5://play a match... a lot to do here
      if (playerTeam.limits(false)){
        console.log("\nWeek " + league.week + " Scores: ");
        playWeek(playMatch, league.week, league.north, league.south);
        console.log("\n\n North Standings:\n   " + league.getStandings(league.north) +
        "\n\n South Standings:\n   " + league.getStandings(league.south));
      }
      break;
    case 6://quit
      playing = false;
      break;
    default:
      console.log("Not found");
  }

}while(playing === true);
console.log("Thank you for playing");
