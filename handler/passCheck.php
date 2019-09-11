<?php
include("include/DB.php");
if(isset($_GET["smail"]) && $_GET["pass"]){
    $connection;
    $mail=mysqli_real_escape_string($connection,$_GET["smail"]);
    $pass=mysqli_real_escape_string($connection,$_GET["pass"]);
    $sql="select * from student where email='$mail' and pass='$pass'";
    if($execute=mysqli_query($connection,$sql)){
        if($row=mysqli_fetch_assoc($execute)){
            $cont=new stdClass();
            $cont->id=$row["sid"];
            $cont->rand=$row["checksum"];
            $cont->identity='S';
            echo json_encode($cont);
        }else{
            echo -1;
        }
    } 
}else if(isset($_GET["tmail"]) && $_GET["pass"]){
    $connection;
    $mail=mysqli_real_escape_string($connection,$_GET["tmail"]);
    $pass=mysqli_real_escape_string($connection,$_GET["pass"]);
    $sql="select * from teacher where email='$mail' and pass='$pass'";
    if($execute=mysqli_query($connection,$sql)){
        if($row=mysqli_fetch_assoc($execute)){
            $cont=new stdClass();
            $cont->id=$row["tid"];
            $cont->rand=$row["checksum"];
            $cont->identity='T';
            echo json_encode($cont);
        }else{
            echo -1;
        }
    } 
}
?>