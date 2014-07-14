<?php
if($_POST['any_name'] != "commercial")
    echo 'example.php requires you to type "commercial" and not "'.
    $_POST['any_name'].'"';
?>