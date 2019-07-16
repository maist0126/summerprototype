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
let myTimer;
let start_status = 0;

firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('order').once('value').then(function(snapshot) {
    innerUsername(snapshot);
});
firebase.database().ref().child('order').on('value', function(snapshot) {
    innerUsername(snapshot);
});

firebase.database().ref().child('now').once('value').then(function(snapshot) {
    now_user = snapshot.val().now_user;     
});

firebase.database().ref().child('now').on('value', function(snapshot) {
    now_user = snapshot.val().now_user;     
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
    if (now_user != username){
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
    myTimer = setTimeout(function() {
        el.style.backgroundColor = '#e6e6e6';
        el.style.color = '#000000';
        }, 1000);
}