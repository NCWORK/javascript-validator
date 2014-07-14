<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="/js/JV.js"></script>
<script>
jv_errors['file_format'] = 'File must be "$" format.';
jv.file_format = function(format)
{
    var match = $(jv_cur_check).val().match(/\.\w+$/);
    if(!match || match[0].substr(1) != format)
        return jv_errors["file_format"].replace("$", format);
}
</script>
</head>
<body>
<?php
if(sizeof($_POST))
    echo "form submitted";
?>
<form method="post">
<input type="text" name="any_name" data-jv="file_format(mp3)">
<input type="submit" value="submit">
</form>
</body>
</html>