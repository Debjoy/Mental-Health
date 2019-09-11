<?php
include("include/DB.php");
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
if(isset($request->chat) && isset($request->msg) && isset($request->from) && isset($request->last)){
    $connection;
    $chatid=mysqli_real_escape_string($connection,$request->chat);
    $msg=mysqli_real_escape_string($connection,$request->msg);
    $from=mysqli_real_escape_string($connection,$request->from);
    $last=mysqli_real_escape_string($connection,$request->last);
    $sql="Insert into messages values (NULL, $chatid,(select * from (select max(msgno)+1 from messages where chatid=$chatid)as X), '$from', '$msg');";
    if(mysqli_query($connection, $sql)){
        $sql="Select * from messages where chatid=$chatid AND msgno>$last;";
        if($result = mysqli_query($connection, $sql)){
            $ar=array();
             while($row = mysqli_fetch_assoc($result)){
                $cont=new stdClass();
                $cont->message=$row["message"];
                $cont->from=$row["from"];
                $cont->msgno=$row["msgno"];
                array_push($ar,$cont);
            }
            $datevalue=time();
            //Update chatinfo with seen
            if($from=='S')
                mysqli_query($connection, "Update chatinfo set tidseen=1, timestamp='$datevalue' where chatid=$chatid");
            else if($from=='T')
                mysqli_query($connection, "Update chatinfo set sidseen=1, timestamp='$datevalue' where chatid=$chatid");
            echo json_encode($ar);
            
        }else{
            echo "fetch error! ".mysqli_error($connection);
        } 
    }else{
        echo "insert error! ".mysqli_error($connection);
    }
}else if(isset($request->msg) ){
 
    echo "some correct arguments";
}else{
    echo "not correct arguments";
}

sleep(1);


?>