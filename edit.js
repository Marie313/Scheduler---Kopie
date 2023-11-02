function nameFunction() {
    let name = prompt("Please enter the new name", "new name");
    if (name != null) {
      document.getElementById("name").innerHTML =
      "name: " + name ;
    }
  }
function runFunction() {
    let run = prompt("Please enter the time interval at which the system should run", "new time interval");
    if (run != null) {
      document.getElementById("run").innerHTML =
      "run: " + run ;
    }
}
function showInput(){
  
}
  
