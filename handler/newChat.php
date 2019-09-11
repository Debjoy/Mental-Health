<?php
include("include/DB.php");
if(isset($_GET["msg"]) && isset($_GET["sid"]) && isset($_GET["tid"])){
    $connection;
    $msg=mysqli_real_escape_string($connection,$_GET["msg"]);
    $sid=mysqli_real_escape_string($connection,$_GET["sid"]);
    $tid=mysqli_real_escape_string($connection,$_GET["tid"]);
    if(!mysqli_fetch_assoc(mysqli_query($connection,"Select chatid from chatinfo where sid=$sid and tid=$tid"))){
        $rand="#".dechex(rand(0,15)).dechex(rand(0,15)).dechex(rand(0,15));
        $datevalue=time();
        if(mysqli_query($connection,"Insert into chatinfo values (NULL,1,0,$tid,$sid,'$rand','$datevalue');")){
            //$sql="Insert into messages values (NULL, $chatid,(select * from (select max(msgno)+1 from messages where chatid=$chatid)as X), '$from', '$msg');";
            $row = mysqli_fetch_assoc(mysqli_query($connection,"Select chatid from chatinfo where sid=$sid and tid=$tid"));
            $chatid=$row["chatid"];
            $sql="Insert into messages values (NULL, $chatid,1, 'S', '$msg');";
            if(mysqli_query($connection,$sql)){
                echo 7;
            }
            else echo -3;
        }else{
            echo -2;
        }
    }else{
        echo -1;
    }
}else{
    echo "parameters incorrect";
}
?>