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

firebase.initializeApp(firebaseConfig);
firebase.database().ref().child('order').once('value').then(function(snapshot) {
    innerUsername(snapshot);
    firebase.database().ref('/start_status').set({
        start_status: 0,
    });
});

firebase.database().ref().child('order').on('value', function(snapshot) {
    innerUsername(snapshot);
});

speech_start.addEventListener('click', function(event){
    firebase.database().ref().child('order').limitToFirst(1).once('value').then(function(snapshot){
        firebase.database().ref().child('order/' + Object.keys(snapshot.val())[0]).remove();
    });

    if (start_status == 0){
        start_status = 1;
        firebase.database().ref('/start_status').set({
            start_status: 1,
        });
    }
});

speech_stop.addEventListener('click', function(event){
    start_status = 0;
    firebase.database().ref('/start_status').set({
        start_status: 0,
    });
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
}
