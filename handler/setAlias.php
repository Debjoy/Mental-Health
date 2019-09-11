<?php
include("include/DB.php");
if(isset($_GET["chat"]) && isset($_GET["new"])){
    $connection;
    $alias=mysqli_real_escape_string($connection,$_GET["new"]);
    $chat=mysqli_real_escape_string($connection,$_GET["chat"]);
    if(mysqli_query($connection, "Update chatinfo set alias='$alias' where chatid=$chat")){
        echo $alias;
    }else{
        echo -1;
    }
}

?>