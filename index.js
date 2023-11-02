function isChecked(){
    if(document.getElementById("my-checkbox").checked){
    document.getElementById("message").textContent = "Enabled";}
    else{
    document.getElementById("message").textContent = "Disabled";
    }
}