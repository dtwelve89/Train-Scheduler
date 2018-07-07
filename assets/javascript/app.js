// Initialize Firebase
var config = {
    apiKey: "AIzaSyCF-JCpdPq8pj7jdB7eUcGlP6_BN71zrFg",
    authDomain: "train-scheduler-ucbx.firebaseapp.com",
    databaseURL: "https://train-scheduler-ucbx.firebaseio.com",
    projectId: "train-scheduler-ucbx",
    storageBucket: "",
    messagingSenderId: "411211305400"
  };

firebase.initializeApp(config);

var database = firebase.database();

$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    var trainName = $("#train-name-input").val().trim();
    var trainDeparture = $("#departure-input").val().trim();
    var trainDestination = $("#destination-input").val().trim();
    var trainTime = $("#first-train-input").val().trim();
    var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: trainName,
    departure: trainDeparture,
    destination: trainDestination,
    time: trainTime,
    frequency: trainFrequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.departure);
  console.log(newTrain.destination);
  console.log(newTrain.time);
  console.log(newTrain.frequency);

  // Alert
  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#departure-input").val("");
  $("#destination-input").val("");
  $("#first-train-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDeparture = childSnapshot.val().departure;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().time;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDeparture);
  console.log(trainDestination);
  console.log(trainTime);
  console.log(trainFrequency);

  var tFrequency = trainFrequency;
  var firstTime = trainTime;

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log(firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var tMinutesTillTrain = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

  // Next Train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));


  // Add each train's data into the table
  $("#train-schedule > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDeparture + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});


