<?php
include("include/DB.php");
if(isset($_GET["sid"]) && isset($_GET["rand"])){
    $connection;
    $sid=mysqli_real_escape_string($connection,$_GET["sid"]);
    $rand=mysqli_real_escape_string($connection,$_GET["rand"]);
    $sql="Select * from student where sid=$sid and checksum=$rand";
    
    if($result=mysqli_query($connection,$sql)){
        if($row=mysqli_fetch_assoc($result)){
            $cont=new stdClass();
            $cont->sid=$row["sid"];
            $cont->name=$row["name"];
            $cont->email=$row["email"];
            $cont->regno=$row["regno"];
            $cont->contact=$row["contact"];
            $cont->rand=$row["checksum"];
            echo json_encode($cont);
        }
        else
            echo -1;
        
    }
}else if(isset($_GET["tid"]) && isset($_GET["rand"])){
    $connection;
    $tid=mysqli_real_escape_string($connection,$_GET["tid"]);
    $rand=mysqli_real_escape_string($connection,$_GET["rand"]);
    $sql="Select * from teacher where tid=$tid and checksum=$rand";
   
    if($result=mysqli_query($connection,$sql)){
        if($row=mysqli_fetch_assoc($result)){
            $cont=new stdClass();
            $cont->tid=$row["tid"];
            $cont->name=$row["name"];
            $cont->email=$row["email"];
            $cont->contact=$row["contact"];
            $cont->dept=$row["dept"];
            $cont->rand=$row["checksum"];
            echo json_encode($cont);
        }
        else
            echo -1;
        
    }
}else{
    echo "lel";
}

?>