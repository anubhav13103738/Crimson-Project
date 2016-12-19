/**
 * Created by Annu on 12/19/2016.
 */
var idu;
function reply_clicked(reply_id){
    idu=reply_id;
    localStorage.clear();
    localStorage.setItem("idx",reply_id);
    console.log(localStorage.getItem("idx"));
    //console.log(reply_id);
    //window.my_App={"myid":reply_id};
}
