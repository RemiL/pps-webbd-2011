<?php
header("Content-Type: text/plain");
header("Content-disposition: attachment; filename=".$_GET['name'].".txt");
echo file_get_contents("../data/".$_GET['id']."/"."docs/".$_GET['name'].".txt");
?>