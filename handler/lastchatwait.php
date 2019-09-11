<?php
include("include/DB.php");

if(isset($_GET["last"]) && isset($_GET["chat"])){
    $last=mysqli_real_escape_string($connection,$_GET["last"]);
    $chatid=mysqli_real_escape_string($connection,$_GET["chat"]);
    $sql="Select * from messages where chatid=$chatid AND msgno>$last;";
    $limit=58;
   while(true){
        if($result = mysqli_query($connection, $sql)){
            $ar=array();
            while($row = mysqli_fetch_assoc($result)){
                $cont=new stdClass();
                $cont->message=$row["message"];
                $cont->from=$row["from"];
                $cont->msgno=$row["msgno"];
                array_push($ar,$cont);
            }

            //MODIFY Chat_info
            if(sizeof($ar)){
               echo json_encode($ar);
               break;
            }
        }else{
            echo "fetch error! ".mysqli_error($connection);
        } 
       $limit--;
       if($limit<=0){
           echo  json_encode(array());
          break; 
       }
        
       usleep(500000);
    }
}

?>