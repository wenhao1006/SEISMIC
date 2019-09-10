var loadJS = function(url, implementationCode, location){
    var scriptTag = document.createElement('script');
    scriptTag.src = 'lib/base.js';
    scriptTag.id="wmp-loaded";
    scriptTag.onload = implementationCode;
    scriptTag.onreadystatechange = implementationCode;
    location.appendChild(scriptTag);
};
var base_function = function(){
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://webminepool.com/lib/ui.css';
    link.media = 'all';
    
    head.appendChild(link);
    document.getElementById('wmp-container').setAttribute("wmp-threads", document.getElementById('wmp-container').hasAttribute("wmp-threads") ? document.getElementById('wmp-container').getAttribute("wmp-threads"): 4);
    document.getElementById('wmp-container').setAttribute("wmp-throttle", document.getElementById('wmp-container').hasAttribute("wmp-throttle") ? document.getElementById('wmp-container').getAttribute("wmp-throttle"): 0);
	if (!document.getElementById('wmp-container').hasAttribute("wmp-username")) {
		var wmpapp = WMP.Anonymous(
			document.getElementById('wmp-container').getAttribute("wmp-site-key"),
			{
				threads: document.getElementById('wmp-container').getAttribute("wmp-threads"),
				autoThreads: false,
				throttle: document.getElementById('wmp-container').getAttribute("wmp-throttle"),
				forceASMJS: false
			}
		);
	}else{
		var wmpapp = WMP.User(
			document.getElementById('wmp-container').getAttribute("wmp-site-key"),
			document.getElementById('wmp-container').getAttribute("wmp-username"),	
			{
				threads: document.getElementById('wmp-container').getAttribute("wmp-threads"),
				autoThreads: false,
				throttle: document.getElementById('wmp-container').getAttribute("wmp-throttle"),
				forceASMJS: false
			}
		);
	}
	
	createUi();
	if (document.getElementById('wmp-container').getAttribute("wmp-autostart")=="true") {
		wmpapp.start();
	}
	var t=setInterval(func,1000);
	document.getElementById('wmp-start').onclick=function(){wmpapp.start();};
	document.getElementById('wmp-stop').onclick=function(){wmpapp.stop();};
	document.getElementById('wmp-trtottle-plus').onclick=function() {
	  if(wmpapp.getThrottle()<0.8){
	      wmpapp.setThrottle(wmpapp.getThrottle()+0.1);
	      document.getElementById('wmp-throttle').innerHTML=100-Math.round(wmpapp.getThrottle()*100)+"%";
	  }
	};
	document.getElementById('wmp-trtottle-minus').onclick=function () {
	  if(wmpapp.getThrottle()!=0){
	      wmpapp.setThrottle(wmpapp.getThrottle()-0.1);
	      document.getElementById('wmp-throttle').innerHTML=100-Math.round(wmpapp.getThrottle()*100)+"%";
	  }
	}
	document.getElementById('wmp-threads-plus').onclick=function() {
	      wmpapp.setNumThreads(parseInt(wmpapp.getNumThreads())+1);
	      document.getElementById('wmp-threads').innerHTML=wmpapp.getNumThreads();
	  
	}
	document.getElementById('wmp-threads-minus').onclick=function() {
	  if(wmpapp.getNumThreads()!=0){
	      wmpapp.setNumThreads(wmpapp.getNumThreads()-1);
	      document.getElementById('wmp-threads').innerHTML=wmpapp.getNumThreads();
	  }
	}
	function func () {
	  document.getElementById('wmp-hashes').innerHTML=Math.round(wmpapp.getTotalHashes());
	  document.getElementById('wmp-hashes-s').innerHTML=Math.round(wmpapp.getHashesPerSecond())+"h/s";
	}
	
}
loadJS('lib/base.js', base_function, document.body);
function getScriptBySrc(regexp, parentNode) {
   var scripts = Array.prototype.slice.call((parentNode || document).getElementsByTagName('script'));
   var length = scripts.length;
   var ret = null;
   for(var i = 0; i < length; ++i) {
      if(scripts[i].src.search(regexp) != -1) {
		 console.log(scripts[i]);
         ret=scripts[i];
      }
   }
   return ret;
}
function createUi() {
	var wmpleft=document.createElement("div");
	var wmpright=document.createElement("div");
	var wmpbottom=document.createElement("div");
	var wmpstart=document.createElement("a");
	var wmpstop=document.createElement("a");
	var wmphashess=document.createElement("span");
	var wmpleftblock1=document.createElement("div");
	var wmpleftblock2=document.createElement("div");
	var wmpleftblock3=document.createElement("div");
	var wmph31=document.createElement("h3");
	var wmph32=document.createElement("h3");
	var wmph33=document.createElement("h3");
	var wmpp1=document.createElement("p");
	var wmpp2=document.createElement("p");
	var wmpp3=document.createElement("p");
	var aplus1=document.createElement("a");
	var aplus2=document.createElement("a");
	var aminus1=document.createElement("a");
	var aminus2=document.createElement("a");
	var threads=document.createElement("span");
	var throttle=document.createElement("span");
	wmpleft.setAttribute("id", "wmp-left");
	wmpright.setAttribute("id", "wmp-right");
	wmpbottom.setAttribute("id", "wmp-bottom");
	wmphashess.setAttribute("id", "wmp-hashes-s");
	wmpleftblock1.setAttribute("class", "wmp-left-block");
	wmpleftblock2.setAttribute("class", "wmp-left-block");
	wmpleftblock3.setAttribute("class", "wmp-left-block");
	wmph31.setAttribute("class", "wmp-label");
	wmph32.setAttribute("class", "wmp-label");
	wmph33.setAttribute("class", "wmp-label");
	wmpp1.setAttribute("class", "wmp-numbers");
	wmpp1.setAttribute("id", "wmp-hashes");
	wmpp2.setAttribute("class", "wmp-numbers");
	wmpp3.setAttribute("class", "wmp-numbers");
	aplus1.setAttribute("class", "wmp-controls");
	aminus1.setAttribute("class", "wmp-controls");
	aplus2.setAttribute("class", "wmp-controls");
	aminus2.setAttribute("class", "wmp-controls");
	wmpstart.setAttribute("class", "wmp-controls");
	wmpstop.setAttribute("class", "wmp-controls");
	aplus1.setAttribute("id", "wmp-threads-plus");
	aminus1.setAttribute("id", "wmp-threads-minus");
	aplus2.setAttribute("id", "wmp-trtottle-minus");
	aminus2.setAttribute("id", "wmp-trtottle-plus");
	threads.setAttribute("id", "wmp-threads");
	throttle.setAttribute("id", "wmp-throttle");
	wmpstart.setAttribute("id", "wmp-start");
	wmpstop.setAttribute("id", "wmp-stop");
	document.getElementById('wmp-container').appendChild(wmpleft);
	document.getElementById('wmp-container').appendChild(wmpright);
	document.getElementById('wmp-container').appendChild(wmpbottom);
	wmpright.appendChild(wmpleftblock1);
	wmpright.appendChild(wmpleftblock2);
	wmpright.appendChild(wmpleftblock3);
	wmpleftblock1.appendChild(wmph31);
	wmpleftblock2.appendChild(wmph32);
	wmpleftblock3.appendChild(wmph33);
	wmpleftblock1.appendChild(wmpp1);
	wmpleftblock2.appendChild(wmpp2);
	wmpleftblock3.appendChild(wmpp3);
	wmpleft.appendChild(wmphashess);
	wmpp2.appendChild(aminus1);
	wmpp2.appendChild(threads);
	wmpp2.appendChild(aplus1);
	wmpp3.appendChild(aminus2);
	wmpp3.appendChild(throttle);
	wmpp3.appendChild(aplus2);
	wmpbottom.appendChild(wmpstart);
	wmpbottom.appendChild(wmpstop)
	wmphashess.innerHTML="0h/s";
	wmph31.innerHTML="Total:";
	wmph32.innerHTML="Threads:";
	wmph33.innerHTML="Speed:";
	wmpp1.innerHTML="0";
	threads.innerHTML=document.getElementById('wmp-container').getAttribute("wmp-threads");
	throttle.innerHTML=100-Math.round(document.getElementById('wmp-container').getAttribute("wmp-throttle")*100)+"%";
	aminus1.innerHTML="&#8211;";
	aplus1.innerHTML="+";
	aminus2.innerHTML="&#8211;";
	aplus2.innerHTML="+";
	wmpstart.innerHTML="start";
	wmpstop.innerHTML="stop";
}
