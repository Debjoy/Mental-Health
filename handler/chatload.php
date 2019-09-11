<?php
include("include/DB.php");
if(isset($_GET["chat"]) && isset($_GET["fetch"]) && isset($_GET["from"])){
    $connection;
    $chatid=mysqli_real_escape_string($connection,$_GET["chat"]);
    $fetch=mysqli_real_escape_string($connection,$_GET["fetch"]);
    $from=mysqli_real_escape_string($connection,$_GET["from"]);
    $amount=10;//CHANGE THIS TO CHANGE FETCH AMOUNT
    $offset=($amount * $fetch) - $amount;
    $sql="Select * from messages where chatid=$chatid order by msgno desc limit $amount offset $offset;";
    if($result = mysqli_query($connection, $sql)){
        $ar=array();
        while($row = mysqli_fetch_assoc($result)){
            $cont=new stdClass();
            $cont->message=$row["message"];
            $cont->from=$row["from"];
            $cont->msgno=$row["msgno"];
            $cont->mid=$row["mid"];
            array_push($ar,$cont);
        }
        /*
            MODIFY CHATINFO with seen
        */
        if($from=='S')
            mysqli_query($connection, "Update chatinfo set sidseen=0 where chatid=$chatid");
        else if($from=='T')
            mysqli_query($connection, "Update chatinfo set tidseen=0 where chatid=$chatid");
        echo json_encode(array_reverse($ar));
    }else{
        echo "error executing";
    }
}else
    echo "not accurate parameter";

sleep(1);
?>