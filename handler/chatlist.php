<?php
include("include/DB.php");
if(isset($_GET["sid"])){
    $sid=mysqli_real_escape_string($connection,$_GET["sid"]);
    $sql="select chatid, c.tid, sidseen, t.name, rand, timestamp from chatinfo as c , teacher as t where sid=$sid AND c.tid=t.tid order by timestamp desc";
    if($result=mysqli_query($connection,$sql)){
        $ar=array();
        while($row = mysqli_fetch_assoc($result)){
            $cont=new stdClass();
            $cont->chatid=$row["chatid"];
            $cont->tid=$row["tid"];
            $cont->name=$row["name"];
            $cont->seen=$row["sidseen"];
            $cont->ran=$row["rand"];//NAME SHOULD BE ADDED
            $cont->timestamp=$row["timestamp"];
            array_push($ar,$cont);
        }
        echo json_encode($ar);
    }else{
        echo "fetch error ".mysqli_error($connection);
    }
}else if(isset($_GET["tid"])){
    $tid=mysqli_real_escape_string($connection,$_GET["tid"]);
    $sql="select * from chatinfo where tid=$tid order by timestamp desc";
    if($result=mysqli_query($connection,$sql)){
        $ar=array();
        while($row = mysqli_fetch_assoc($result)){
            $cont=new stdClass();
            $cont->chatid=$row["chatid"];
            $cont->seen=$row["tidseen"];
            $cont->ran=$row["rand"];
            $cont->timestamp=$row["timestamp"];
            $cont->alias=$row["alias"];
            array_push($ar,$cont);
        }
        echo json_encode($ar);
    }else{
        echo "fetch error ".mysqli_error($connection);
    }
}
sleep(1);
?>