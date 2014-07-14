java-validator
==============

Written in JavaScript/jQuery, this plugin will help you dynamically validate HTML fields. I made this plugin long ago and now decided to share it.
            You just include "JV.js" the same way you include any JS file in your website. Something like:
            <script src="/JV.js"></script>
            With that and jQuery included you have the ability to set restrictions to your field. To do that, you simply need to add the "data-jv" attribute to the field, with the restrictions in separated by a space.
            
            See this example that makes the field required and also requires that there are no spaces at beginning and end:
            <input type="text" name="any_name" data-jv="required no_trim">
Some checks like for maximum, minumum length and file queries require parameters. You pass those parameters like in functions. Example:
            <input type="text" name="any_name" data-jv="min_length(6) file(example.php)">
example.php:
Custom checks
If none of the checks suite your needs, you can create a custom check. To do that, you need to:

1. Extend the "jv" object with a function that performs the check
2. Extend the "jv_errors" array with the error you want to show

You can do that anywhere in your JavaScript code.
Example:
            <script type="text/javascript">
            jv_errors[\'file_format\'] = \'File must be "$" format.\';
            jv.file_format = function(format)
            {
                var match = $(jv_cur_check).val().match(/\.\w+$/);
                if(!match || match[0].substr(1) != format)
                    return jv_errors["file_format"].replace("$", format);
            }
            </script>
You use custom checks the same way:
            <input type="text" name="any_name" data-jv="file_format(mp3)">
jv object in "JV.js" has the validations as independant functions and you can look in it to get more ideas on validation functions.
To change the __error messages__ you can edit the __jv_errors__ class in __JV.js__. You can add php stuff to add __multi-language__ support there.
__Multi-templating__ is also supported. See
            var jv_err_open = '<span style="color:red" id="jv_error">';
in JV.js
