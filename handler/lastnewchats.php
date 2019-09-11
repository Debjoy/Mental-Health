<?php
include("include/DB.php");

if(isset($_GET["mid"]) && isset($_GET["chat"])  && isset($_GET["sid"])){
    $mid=mysqli_real_escape_string($connection,$_GET["mid"]);
    $sid=mysqli_real_escape_string($connection,$_GET["sid"]);
    $chatid=mysqli_real_escape_string($connection,$_GET["chat"]);
    $sql="Select * from messages where chatid in (Select chatid from chatinfo where sid=$sid) and mid>$mid;";
    //$sql="Select * from messages where chatid=$chatid AND msgno>$last;";
    $limit=58;
   while(true){
        if($result = mysqli_query($connection, $sql)){
            $ar=array();
            $newchatmsg=0;
            $lastmid=-1;
            while($row = mysqli_fetch_assoc($result)){
                $lastmid=$row["mid"];
                if($row["chatid"]!=$chatid){
                    $newchatmsg=1;
                    continue;}
                $cont=new stdClass();
                $cont->message=$row["message"];
                $cont->from=$row["from"];
                $cont->msgno=$row["msgno"];
                $cont->chatid=$row["chatid"];
                
                array_push($ar,$cont);
            }
            $object=new stdClass();
            $object->lastmid=$lastmid;
            $object->messages=$ar;

            //MODIFY Chat_info
            if(sizeof($ar)||$newchatmsg==1){
               mysqli_query($connection, "Update chatinfo set sidseen=0 where chatid=$chatid");
               echo json_encode($object);
               break;
            }
        }else{
            echo "fetch error! ".mysqli_error($connection);
        } 
       $limit--;
       if($limit<=0){
           $obj=new stdClass();
            $obj->lastmid=-1;
            $obj->messages=array();
           echo  json_encode($obj);
          break; 
       }
        
       usleep(500000);
    }
}else if(isset($_GET["mid"]) && isset($_GET["chat"])  && isset($_GET["tid"])){
    $mid=mysqli_real_escape_string($connection,$_GET["mid"]);
    $tid=mysqli_real_escape_string($connection,$_GET["tid"]);
    $chatid=mysqli_real_escape_string($connection,$_GET["chat"]);
    $sql="Select * from messages where chatid in (Select chatid from chatinfo where tid=$tid) and mid>$mid;";
    //$sql="Select * from messages where chatid=$chatid AND msgno>$last;";
    $limit=58;
   while(true){
        if($result = mysqli_query($connection, $sql)){
            $ar=array();
            $newchatmsg=0;
            $lastmid=-1;
            while($row = mysqli_fetch_assoc($result)){
                $lastmid=$row["mid"];
                if($row["chatid"]!=$chatid){
                    $newchatmsg=1;
                    continue;}
                $cont=new stdClass();
                $cont->message=$row["message"];
                $cont->from=$row["from"];
                $cont->msgno=$row["msgno"];
                $cont->chatid=$row["chatid"];
                array_push($ar,$cont);
            }
            $object=new stdClass();
            $object->lastmid=$lastmid;
            $object->messages=$ar;

            //MODIFY Chat_info
            if(sizeof($ar)||$newchatmsg==1){
                mysqli_query($connection, "Update chatinfo set tidseen=0 where chatid=$chatid");
               echo json_encode($object);
               break;
            }
        }else{
            echo "fetch error! ".mysqli_error($connection);
        } 
       $limit--;
       if($limit<=0){
           $obj=new stdClass();
            $obj->lastmid=-1;
            $obj->messages=array();
           echo  json_encode($obj);
          break; 
       }
        
       usleep(500000);
    }
}
// sid/tid, chatid, mid
?>