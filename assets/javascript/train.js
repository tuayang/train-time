

// 1. Initialize Firebase
var config = {
  apiKey: "AIzaSyDHwv8WNUUvAb9bbGL5ifdCip1WhKw0_mw",
  authDomain: "my-firebase-project-25723.firebaseapp.com",
  databaseURL: "https://my-firebase-project-25723.firebaseio.com",
  projectId: "my-firebase-project-25723",
  storageBucket: "my-firebase-project-25723.appspot.com",
  messagingSenderId: "249752507621"
};
firebase.initializeApp(config);

var database = firebase.database();
var currentTime = moment();

// 2. Button for adding trains
$("#add-train-btn").on("click", function(event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim(); 
  var trainTime = moment($("#first-train-input").val().trim(), "minutes").format("HH:mm a");
  var trainFreq = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding train data
  var newTrain = {
    train: trainName,
    destination: trainDestination,
    firstTrain: trainTime,
    frequency: trainFreq
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.train);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  alert("Train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#frequency-input").val("");
  $("#first-train-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().train;
  var trainDestination = childSnapshot.val().destination;
  var trainTime = childSnapshot.val().firstTrain;
  var trainFreq = childSnapshot.val().frequency;

  // train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainTime);
  console.log(trainFreq);

  // math calculations for next train arrival and mins away

  var firstTraincalc = moment(trainTime, "hh:mm").subtract("1, years");
    var difference = currentTime.diff(moment(firstTraincalc), "minutes");
    var remainder = difference % trainFreq;
    var minAway = trainFreq - remainder;
    var nextTrain = moment().add(minAway, "minutes").format("HH:mm a");

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDestination),
    $("<td>").text(trainFreq),
    $("<td>").text(nextTrain),
    $("<td>").text(minAway),
    // $("<td>").text(remainder)
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});
