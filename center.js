const speech_start = document.getElementById('speech_start');
const speech_stop = document.getElementById('speech_stop');

const firebaseConfig = {
    apiKey: "AIzaSyDqrxVLbCj9D1NyPziKNyrmzhegXNpCI6A",
    authDomain: "summer-iw.firebaseapp.com",
    databaseURL: "https://summer-iw.firebaseio.com",
    projectId: "summer-iw",
    storageBucket: "",
    messagingSenderId: "939837361800",
    appId: "1:939837361800:web:b2f180e51fcf2dce"
};

let alarm_state = 1;
let RemainDate = 60000;
let start_status = 0;
let tid;

let myTimer;

firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('order').once('value').then(function(snapshot) {
    innerUsername(snapshot);
});

firebase.database().ref().child('order').on('value', function(snapshot) {
    innerUsername(snapshot);
});

firebase.database().ref().child('add').once('value').then(function(snapshot) {
    if (start_status == 1){
        let add = 0;
        for (let key in snapshot.val()) {
            add = add + 1;
        }
        RemainDate = RemainDate + add*5000;
        changecolor('#0060ff');
        firebase.database().ref().child('add').set(null);
    }
});

firebase.database().ref().child('add').on('value', function(snapshot) {
    if (start_status == 1){
        let add = 0;
        for (let key in snapshot.val()) {
            add = add + 1;
        }
        RemainDate = RemainDate + add*5000;
        changecolor('#0060ff');
        firebase.database().ref().child('add').set(null);
    }
});

firebase.database().ref().child('subtract').once('value').then(function(snapshot) {
    if (start_status == 1){
        let subtract = 0;
        for (let key in snapshot.val()) {
            subtract = subtract + 1;
        }
        RemainDate = RemainDate - subtract*5000;
        changecolor('#ff3e98');
        firebase.database().ref().child('subtract').set(null);
    }
});

firebase.database().ref().child('subtract').on('value', function(snapshot) {
    if (start_status == 1){
        let subtract = 0;
        for (let key in snapshot.val()) {
            subtract = subtract + 1;
        }
        RemainDate = RemainDate - subtract*5000;
        changecolor('#ff3e98');
        firebase.database().ref().child('subtract').set(null);
    }
});

firebase.database().ref().child('start_status').once('value').then(function(snapshot) {
    console.log(snapshot.val().start_status);
    if (snapshot.val().start_status == 1){
        start_status = 1;
        RemainDate = 60000;
        tid=setInterval('msg_time()',100);
    } else if (snapshot.val().start_status == 0) {
        clearInterval(tid);
        start_status = 0;
    }
});

firebase.database().ref().child('start_status').on('value', function(snapshot) {
    console.log(snapshot.val().start_status);
    if (snapshot.val().start_status == 1){
        start_status = 1;
        RemainDate = 60000;
        tid=setInterval('msg_time()',100);
    } else if (snapshot.val().start_status == 0) {
        clearInterval(tid);
        start_status = 0;
    }
});

function innerUsername(snapshot){
    let order = [];
	for (let key in snapshot.val()) {
		order.push(snapshot.val()[key].username);
    }
    let number = order.length - 3;
    if (order[0] != undefined){
        document.getElementById("current").innerHTML="유저 " + order[0];
    } else{
        document.getElementById("current").innerHTML="없음";
    }
    if (order[1] != undefined){
        document.getElementById("next").innerHTML="유저 " + order[1];
    } else{
        document.getElementById("next").innerHTML="없음";
    }
    if (order[2] != undefined){
        document.getElementById("more").innerHTML="유저 " + order[2];
    } else{
        document.getElementById("more").innerHTML="없음";
    }
    if (number>0){
        document.getElementById("number").innerHTML="+ " + number;
    } else{
        document.getElementById("number").innerHTML="+ 0";
    }
}

function reset(){
    firebase.database().ref().set(null);
    order = [];
}

function msg_time() {
	var hours = Math.floor((RemainDate % (1000 * 60 * 60 * 24)) / (1000*60*60));
	var minutes = Math.floor((RemainDate % (1000 * 60 * 60)) / (1000*60));
	var seconds = Math.floor((RemainDate % (1000 * 60)) / 1000);

	m = hours + ":" +  minutes + ":" + seconds ; // 남은 시간 text형태로 변경
	  
    document.all.timer.innerHTML = m;
    
	if (RemainDate <= 0) {      
        clearInterval(tid);
        start_status = 0;
        firebase.database().ref('/start_status').set({
            start_status: 0,
        });
	} else if (RemainDate >= 1000*16) {
		alarm_state = 1;
		RemainDate = RemainDate - 100;
	} else if (RemainDate <= 1000*15) {
		if (alarm_state == 1){
            console.log("what");
		    play();
		    alarm_state = 0;
		}
		RemainDate = RemainDate - 100;
	}
	else{
	    RemainDate = RemainDate - 100;
    }
}

function play() { 
    var audio = document.getElementById('audio_play'); 
    if (audio.paused) { 
        audio.play(); 
    }else{ 
        audio.pause(); 
        audio.currentTime = 0;
    } 
}

function changecolor(color){
    clearTimeout(myTimer);
    var el = document.getElementById('timer');
    el.style.backgroundColor = `${color}`;
    el.style.color = '#ffffff';
    myTimer = setTimeout(function() {
        el.style.backgroundColor = '#e6e6e6';
        el.style.color = '#000000';
        }, 1000);
}