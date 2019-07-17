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
const noSleep = new NoSleep();

let alarm_state = 1;
let start_status = 0;
let msg_state = 0;
let msg_state2 = 0;
let tid;
let RemainDate = 60000;
let arc;
let ArchiveTime = 0;
let now_user = undefined;

let myTimer;

let datatable = [
    ["Element", "Time", { role: "style" } ],
    ["유저 1", 0, "#b87333"],
    ["유저 2", 0, "gold"],
    ["유저 3", 0, "#b87333"],
    ["유저 4", 0, "gold"],
    ["유저 5", 0, "#b87333"],
    ["유저 6", 0, "gold"]
];

document.addEventListener('click', function enableNoSleep() {
    document.removeEventListener('click', enableNoSleep, false);
    noSleep.enable();
  }, false);

firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('data').once('value').then(function(snapshot) {
    datatable[1][1] = snapshot.val()[0].user1; 
    datatable[2][1] = snapshot.val()[0].user2; 
    datatable[3][1] = snapshot.val()[0].user3;    
    datatable[4][1] = snapshot.val()[0].user4; 
    datatable[5][1] = snapshot.val()[0].user5; 
    datatable[6][1] = snapshot.val()[0].user6; 
    google.charts.setOnLoadCallback(drawChart);
});
firebase.database().ref().child('now').once('value').then(function(snapshot) {
    now_user = snapshot.val().now_user;     
});

firebase.database().ref().child('now').on('value', function(snapshot) {
    now_user = snapshot.val().now_user;     
});

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

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



firebase.database().ref().child('start_status').on('value', function(snapshot) {
    console.log(snapshot.val().start_status);
    if (snapshot.val().start_status == 1){
        document.all.timer.innerHTML = "";
        start_status = 1;
        RemainDate = 60000;
        ArchiveTime = 0;
        arc=setInterval('arc_time()',100);
        if (msg_state == 1){
            if (msg_state2 == 0){
                tid=setInterval('msg_time()', 100);
                msg_state2 = 1;
            }
        }
    } else if (snapshot.val().start_status == 0) {
        clearInterval(tid);
        clearInterval(arc);
        msg_state2 = 0;
        ArchiveTime = datatable[now_user][1] + ArchiveTime/1000;
        datatable[now_user][1] = ArchiveTime;
        drawChart();
        firebase.database().ref('/data/0').set({
            user1: datatable[1][1],
            user2: datatable[2][1],
            user3: datatable[3][1],
            user4: datatable[4][1],
            user5: datatable[5][1],
            user6: datatable[6][1],
        });
        firebase.database().ref('/data/'+now_user).set({
            time: ArchiveTime,
        });
        start_status = 0;
    }
});

function innerUsername(snapshot){
    if (snapshot.val() == null){
        firebase.database().ref('/order').push({
            username: '없음',
        });
    }
    let order = [];
	for (let key in snapshot.val()) {
		order.push(snapshot.val()[key].username);
    }
    let number = order.length - 3;
    if (order[0] != undefined){
        document.getElementById("current").innerHTML="유저 " + order[0];
    } else{
        document.getElementById("current").innerHTML="유저 없음";
    }
    if (order[1] != undefined){
        msg_state = 1;
        if (start_status == 1){
            if (msg_state2 == 0){
                tid=setInterval('msg_time()', 100);
                msg_state2 = 1;
            }
        }
        document.getElementById("next").innerHTML="유저 " + order[1];
    } else{
        msg_state = 0;
        document.getElementById("next").innerHTML="유저 없음";
    }
    if (order[2] != undefined){
        document.getElementById("more").innerHTML="유저 " + order[2];
    } else{
        document.getElementById("more").innerHTML="유저 없음";
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
        msg_state2 = 0;
        start_status = 0;
        firebase.database().ref('/start_status').set({
            start_status: 0,
        });
        now_user = undefined;
        firebase.database().ref('/now').set({
            now_user: null,
        });
        firebase.database().ref().child('order').once('value').then(function(snapshot){
            firebase.database().ref().child('order/' + Object.keys(snapshot.val())[0]).set({
                username: '없음',
            });
        });
	} else if (RemainDate >= 1000*16) {
		alarm_state = 1;
		RemainDate = RemainDate - 100;
	} else if (RemainDate <= 1000*15) {
		if (alarm_state == 1){
		    play();
		    alarm_state = 0;
		}
		RemainDate = RemainDate - 100;
	}
	else{
	    RemainDate = RemainDate - 100;
    }
}

function arc_time() {
	ArchiveTime = ArchiveTime + 100;
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

function drawChart() {
    var data = google.visualization.arrayToDataTable(datatable);
    var view = new google.visualization.DataView(data);
    view.setColumns([0, 1,
                    { calc: "stringify",
                        sourceColumn: 1,
                        type: "string",
                        role: "annotation" },
                    2]);

    var options = {
        title: "발언 누적 시간 그래프",
        width: 1200,
        height: 400,
        bar: {groupWidth: "95%"},
        legend: { position: "none" },
    };
    var chart = new google.visualization.BarChart(document.getElementById("chart_div"));
    chart.draw(view, options);
}
