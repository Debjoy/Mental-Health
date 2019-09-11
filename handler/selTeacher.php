<?php
include("include/DB.php");
if(isset($_GET["dept"])){
    $dept=mysqli_real_escape_string($connection,$_GET["dept"]);
    $sql="select tid, name from teacher where dept='$dept'";
    if($result=mysqli_query($connection,$sql)){
        $ar=array();
        while($row=mysqli_fetch_assoc($result)){
            $cont=new stdClass();
            $cont->tid=$row["tid"];
            $cont->name=$row["name"];
            array_push($ar,$cont);
        }
        echo json_encode($ar);
    }
    
}

?>