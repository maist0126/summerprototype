const firebaseConfig = {
    apiKey: "AIzaSyDqrxVLbCj9D1NyPziKNyrmzhegXNpCI6A",
    authDomain: "summer-iw.firebaseapp.com",
    databaseURL: "https://summer-iw.firebaseio.com",
    projectId: "summer-iw",
    storageBucket: "",
    messagingSenderId: "939837361800",
    appId: "1:939837361800:web:b2f180e51fcf2dce"
};
let now_user = undefined;
let last_user = undefined;
let myTimer;
let start_status = 0;

navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;


firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('order').once('value').then(function(snapshot) {
    innerUsername(snapshot);
});
firebase.database().ref().child('order').on('value', function(snapshot) {
    innerUsername(snapshot);
});

firebase.database().ref().child('now').once('value').then(function(snapshot) {
    if (snapshot.val().now_user != null){
        now_user = snapshot.val().now_user;  
    }   
});

firebase.database().ref().child('now').on('value', function(snapshot) {
    if (snapshot.val().now_user != null){
        now_user = snapshot.val().now_user;  
    }      
});

firebase.database().ref().child('subtract').on('value', function(snapshot) {
    if (start_status == 1){
        let subtract = 0;
        for (let key in snapshot.val()) {
            subtract = subtract + 1;
        }
        changecolor('#ff3e98');
        firebase.database().ref().child('subtract').set(null);
    }
});

firebase.database().ref().child('start_status').on('value', function(snapshot) {
    if (snapshot.val().start_status == 1){
        start_status = 1;
    } else if (snapshot.val().start_status == 0) {
        start_status = 0;
    }
});


function add(username){
    if (now_user != username){
        firebase.database().ref('/add').push({
            username: username,
        });
    }
}

function subtract(username){
    if (now_user != username){
        firebase.database().ref('/subtract').push({
            username: username,
        });
    }
}


function reserve(username){
    if (last_user != username){
        firebase.database().ref('/order').push({
            username: username,
        });
    }
}

function innerUsername(snapshot){
    let order = [];
	for (let key in snapshot.val()) {
		order.push(snapshot.val()[key].username);
	}
    let number = order.length - 3;
    last_user = order[order.length-1];
    console.log(last_user);
    if (order[0] != undefined){
        document.getElementById("current").innerHTML="유저 " + order[0];
    } else{
        document.getElementById("current").innerHTML="유저 없음";
    }
    if (order[1] != undefined){
        document.getElementById("next").innerHTML="유저 " + order[1];
    } else{
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

function changecolor(color){
    clearTimeout(myTimer);
    var el = document.getElementById(`user${now_user}`);
    el.style.backgroundColor = `${color}`;
    el.style.color = '#ffffff';
    vibrate();
    myTimer = setTimeout(function() {
        el.style.backgroundColor = '#e6e6e6';
        el.style.color = '#000000';
        vibrate_stop();
        }, 1000);
}

function vibrate() {
    if (navigator.vibrate) {
        navigator.vibrate(20000); // 진동을 울리게 한다. 1000ms = 1초
    }
    else {
    }
}

function vibrate_stop() {
    navigator.vibrate(0);
}