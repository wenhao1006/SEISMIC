// CHANGE THIS TO YOUR HUSH taddr
// The . and everything after is ignored, but will become a "worker name"
// If you have two websites sending to the same taddr, you can have each
// use a different worker name to distinguish mining rewards between them
var MINING_ADDRESS = "t1J1NGkA9FvnQyQQr8w7jYUouConMTcZaLF.DukeLeto";

//////////////////////////////////////////////////
// DO NOT CHANGE BELOW HERE, UNLESS YOU ARE SURE :)
//////////////////////////////////////////////////
function log(msg)      { console && console.log ? console.log(msg) : ''; }
function get (id)      { return document.getElementById (id).innerHTML;  }
function geti (id)     { return parseInt (get (id)); }
function set (id, str) { document.getElementById (id).innerHTML = str; }

if ( window.location.href.indexOf("?") > -1 ) {
	var thisURL = window.location + "";
	var regex   = new RegExp(/\?([^[a-z0-9]+)\.?/);
	var matches = thisURL.match(regex);
	var taddr   = matches && matches[1] ? matches[1] : '';
	if (taddr && taddr.length() >= 36) {
		log("HushPuppy: thisURL = " + thisURL);
		log("HushPuppy: setting taddr="+taddr);
		set("mining_address", taddr);
	} else {
		log("HushPuppy:( invalid/missing taddr="+taddr);
		set("mining_address", "INVALID");
	}
}

var ws_host = location.hostname + (location.port ? ":" + location.port : "");
var ws_url  = "ws://" + ws_host + "/ws?" + MINING_ADDRESS;

function stat (str) {
	var id = "stat_" + str;
	set (id, geti (id) + 1);
}

function new_job (j) {
	stat ("jobs");
	set ("target", j.target);
	set ("job", j.job);
	set ("nonce", -1);
	job_time = new Date ();
}

var ws;
function ws_open () {
	set ("ws", "opening");
	ws = new WebSocket (ws_url);
	ws.onopen = function () {
		set ("ws", "open");
	};
	ws.onmessage = function (evt) {
		var j = JSON.parse (evt.data);
		if (j.res)
			set ("res", j.res);
		else if (j.job) 
			new_job (j);
	};
	ws.onclose = function () {
		set ("ws", "closed");
		setTimeout (ws_open, 5000);
	};
	ws.onclose = function () {
		set ("ws", "error");
		setTimeout (ws_open, 5000);
	};
}

function ws_send (j) {
	ws.send(JSON.stringify(j));
}

var state;
function set_state (s) {
	state = s;
if (s == 0) {
    $("#status-icon").css("color","red");
    $("#ws-icon").css("color","red");
    $(".fa-cogs").removeClass("fa-spin");
    $(".fa-bolt").css("color","red");
} else if (s == 1) {
    $(".fa-cogs").addClass("fa-pulse");
    $(".fa-cogs").css("color","yellow");
    $("#ws-icon").css("color","yellow");
    $("#dashboard").css("color","yellow");
    $(".fa-bolt").css("color","yellow");
} else if (s == 2) {
    $(".fa-cogs").removeClass("fa-pulse");
    $(".fa-cogs").addClass("fa-spin");
} else if (s == 3) {
    $("#status-icon").css("color","green");
    $("#dashboard").css("color","green");
    $("#ws-icon").css("color","green");
    $(".fa-cogs").css("color","green");
    $(".fa-cogs").removeClass("fa-pulse");
    $(".fa-cogs").addClass("fa-spin");
    $(".fa-bolt").css("color","green");
} else {
    // bad stuff, easter egg?
    $("#status-icon").css("color","red");
    $("#dashboard").css("color","red");
    $(".fa-cogs").removeClass("fa-spin");
    $(".fa-cogs").removeClass("fa-pulse");
    $(".fa-bolt").css("color","red");
}
	set ("status",
	    s == 0 ? "<font color=\"#FF0000\">still waiting for " +
		"WebAssembly, check your JS console " +
		"if it takes longer than 1 minute, or longer for mobile devices</font>." :
			s == 1 ? "WebAssembly detected, waiting ...<i class='fa fa-3x fa-wrench'></i>" :
	    s == 2 ? "Mining! <i color='green' class='fa fa-bolt fa-2x'></i>"  :
		s == 3 ? "Mining! <i class='fa fa-bolt fa-2x'></i><i class='fa fa-bolt fa-2x'></i>" : "Something went really wrong, lol! <i class='fa fa-bomb'></i>");
}
set_state (0);

var start_time;
var job_time;
function speed () {
	var stat_sent = geti("stat_sent");
	var cur = new Date();
	var tot = geti ("stat_above") + stat_sent;
	var tim = (cur - start_time) / 1000;

	if (start_time && tim > 0) {
		set ("run_time", tim | 0);
	        var speed = Number (tot / tim).toFixed (3);
		set ("speed", speed)
	    	document.title = speed + " Sol/s ("+stat_sent+") Hush Puppy Mining Pool";
	}
	if (job_time)
		set ("job_time", (cur - job_time) / 1000 | 0);
}

function above () { stat ("above"); }

function submit (block) {
	ws_send ({ "block" : block });
	stat ("sent");
}

function mine () {
	var nonce = geti ("nonce") + 1;
	set ("nonce", nonce);
	nonce = nonce.toString (16).split('').reverse().join('');

	var blkhdr = get ("job") + nonce;
	while (blkhdr.length < 140*2)
		blkhdr += "0";

	var target = get ("target");

	var blkhdr_p = Module._malloc (blkhdr.length + 1);
	Module.writeAsciiToMemory (blkhdr, blkhdr_p);
	var target_p = Module._malloc (target.length + 1);
	Module.writeAsciiToMemory (target, target_p);
	Module.asm._mine (blkhdr_p, target_p);
	Module._free (blkhdr_p);
	Module._free (target_p);
}

function worker () {
	switch (state) {
	case 0:
		if (Module.asm._mine) {
			set_state (1);
			ws_open ();
		}
		break;
	case 1:
		if (get ("target") != "?") {
			set_state (2);
			start_time = new Date ();
		}
		break;
	case 2:
	case 3:
		mine ();
		set_state (state ^ 1);
		speed ();
		break;
	}
	setTimeout (worker, 1);
}
worker ();
