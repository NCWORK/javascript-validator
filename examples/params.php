<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="/js/JV.js"></script>
</head>
<body>
<?php
if(sizeof($_POST))
    echo "form submitted";
?>
<form method="post">
<input type="text" name="any_name" data-jv="min_length(6) file(example.php)">
<input type="submit" value="submit">
</form>
</body>
</html>