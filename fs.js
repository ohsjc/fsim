
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
"Jeff","David","George","Richard","Charles"," Steven","Joseph",
"Edward","Thomas","Brian","Cameron","Isaiah","Malik","Xavier",
"Jake","Connor","Wyatt","Luke","Jack","Logan","Lucas","Jacob",
"Maxwell","Brett","Colin","Andre","Terrell","Tyrone","Willy",
"Maurice","Jalen","Terrance","Darryl","Carlos","Samuel","Pedro",
"Luis"];

var positionList = ["Quarterback", "Halfback", "Wide Reciever", "Tight End",
"O-Line", "D-Line", "Linebacker", "Cornerback", "Safety", "Kicker"];

function Player (fName,lName, position, stat){//player constructor
  this.fName = fName;
  this.lName = lName;
  this.position = position;
  this.stat = stat;
  this.fullName = fName + " " + lName;
  this.pName = positionList[position];
}

Player.prototype.details = function (){//displays info about player
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

var ball = {//MASTER OBJECT ball stores variables like position, possesion
  pos: 0, // location on field (0 - 100 or ?)
  hold: true, // true = home team, false = away
  down: 1, //one through four
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
    if (this.hold === true){
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
  ballStatus: function(){//for debug only please
    console.log("Ball is at: ", this.pos,"\n"+
                "Home team has the ball: ", this.hold,"\n"+
                "The down is: ", this.down,"\n");
  },
  reset: function(){//refine this to take hold maybe?
    this.pos = 0;
    this.hold = true;
    this.down = 1;
  }
};

function Team (name, colors, town, roster){//team constructior
  this.name = name;
  this.homeTown = town;
  this.colors = colors;
  this.roster = roster;
}

Team.prototype.details = function(){//displays team info, viewing purposes only
  var aRoster = [];
  for (var x = 0; x < this.roster.length; x++){
    aRoster.push([("\n\n" + this.roster[x]["fullName"]),
    ("\n" + this.roster[x]["pName"]),
    ("\n" + this.roster[x]["stat"])]);
  }
  //was going to have this return but JSON returns roster as [object Object]
  return "\n"+"Team name: " + this.homeTown + " " + this.name +"\n"+
         "Colors: " + this.colors + "\n"+
         "Active Player Roster: " + aRoster;

};

/////////////////////below this is testing code////////////////////////////////
var blueTeamRoster = [];

for (var x = 0; x < 30; x++){
  blueTeamRoster.push(genPlayer());
}

var theBlues = new Team("Blues", "Blue and White", "Kalispell", blueTeamRoster);

console.log(theBlues.details());
