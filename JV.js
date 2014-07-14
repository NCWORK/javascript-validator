var jv_cur_check = null;
var jv_err_open = '<p style="color:red;clear:both" id="jv_error">';
var jv_err_close = '</p>';
var waiting = false;
var jv_errors = {
    "required": "This field is required.",
    "uint": "Please enter only numerical letters here.",
    "no_trim": "No spaces at beginning and end of field allowed.",
    "email": "Please enter a valid e-mail.",
    "min_length": "This field needs to be atleast $ characters long.",
    "max_length": "This field must have no more than $ characters in it.",
    "max_val": "Value must be no more then $.",
    "min_val": 'Value must be more then $.',
    "invalid_chars_in_url": '"$" is invalid symbol for an URL',
    "url_must_have_dots": "An URL must contain atleast one dot (.).",
    "facility_url": 'This does not appear to be a valid facility url.',
    "shop_url": 'This does not appear to be a valid shop url.'};
function urlType1(val, obj)
{
    if (!val)
        return;
    var split = val.split(site_url + "/");
    if (split.length != 2 || split[0] != "")
        return jv_errors[obj + "_url"];
    split = split[1].split("/");
    if (split[0] != obj)
        return jv_errors[obj + "_url"];
}
function queryType1(el, obj)
{
    if (!el.val())
        return;
    $.ajax({
        type: 'POST',
        url: "/" + obj + "_owner_q",
        data: $(el).attr('name') + "=" + $(el).val(),
        success: function(data) {
            $("#owner_div").css("border-color", "rgba(82, 168, 236, 0.8)");
            $("#owner_div").css("box-shadow", "0 1px 1px rgba(0, 0, 0, 0.075) inset, 0 0 8px rgba(82, 168, 236, 0.6)")
        }
    })
}
var jv =
        {
            format: function(formats) {
                if (!$(jv_cur_check).val())
                    return;
                var split = $(jv_cur_check).val().split(".");
                var format = split[split.length - 1].toLowerCase();
                formats = formats.split(",");
                if (formats.indexOf(format) == -1)
                    return "File formats allowed: " + formats.join(", ");
            },
            facility_owner_q: function() {
                queryType1($(jv_cur_check), "facility")
            },
            shop_owner_q: function() {
                queryType1($(jv_cur_check), "shop")
            },
            team_url: function() {
                return urlType1($(jv_cur_check).val(), "team")
            },
            facility_url: function() {
                return urlType1($(jv_cur_check).val(), "facility")
            },
            shop_url: function() {
                return urlType1($(jv_cur_check).val(), "shop")
            },
            uint: function() {
                if ($(jv_cur_check).val() && !$(jv_cur_check).val().match(/^[0-9]+$/))
                    return jv_errors["uint"];
            },
            url: function()
            {
                var chk = $(jv_cur_check).val();
                if (chk)
                {
                    var error = chk.match(/(?![0-9a-zA-Z-_/\.])./);
                    if (error)
                        return jv_errors['invalid_chars_in_url'].replace('$', $('<div/>').text(error).html());
                    var chk_arr = chk.split("/");
                    chk = chk_arr[0];
                    if ($(jv_cur_check).val().search(/\./) == -1)
                        return jv_errors["url_must_have_dots"];
                }
            },
            ufloat: function() {
                var error = "Invalid value. Example for a valid value 5, 6.7, 8.2";
                var parts = $(jv_cur_check).val().split(".");
                if ($(jv_cur_check).val() && (parts.length > 2 || !parts[0].match(/^[0-9]+$/) || (parts.length == 2 && !parts[1].match(/^[0-9]+$/))))
                    return error;
            },
            img: function() {
                if (!$(jv_cur_check).val())
                    return;
                var allowed_ext = Array("gif", "png", "jpg");
                var splitted = $(jv_cur_check).val().split(".");
                if (!inArray(splitted[splitted.length - 1].toLowerCase(), allowed_ext))
                    return "Please only upload gif, png and jpg files";
            },
            required: function() {
                if (!$(jv_cur_check).val())
                    return jv_errors["required"];
            },
            no_trim: function() {
                if ($(jv_cur_check).val() && ($(jv_cur_check).val().charAt(0) == " " || $(jv_cur_check).val().charAt($(jv_cur_check).val().length - 1) == " "))
                    return jv_errors["no_trim"];
            },
            email: function() {
                var re = /^[_\.0-9a-zA-Z-]+@([0-9a-zA-Z][0-9a-zA-Z-]+\.)+[a-zA-Z]{2,6}$/i;
                if ($(jv_cur_check).val() && !re.test($(jv_cur_check).val()))
                    return jv_errors["email"];
            },
            file: function(file) {
                var element = jv_cur_check;
                waiting = true;
                $.ajax({
                    type: 'POST',
                    url: "/" + file,
                    data: $(element).attr('name') + "=" + $(element).val(),
                    success: function(data) {
                        if (data && jvGetErrorOn(element) && jvGetErrorOn(element) != data)
                            return;
                        if ($(element).next().attr("id") == "jv_error")
                            $(element).next().remove();
                        if (data && $(element).val())
                            $(element).after(jv_err_open + data + jv_err_close);
                        waiting = false;
                    }
                })
                return "";
            },
            max_val: function(len) {
                if (parseInt($(jv_cur_check).val()) > parseInt(len))
                    return jv_errors["max_val"].replace("$", len);
            },
            min_length: function(len) {
                if ($(jv_cur_check).val().length < len)
                    return jv_errors["min_length"].replace("$", len);
            },
            max_length: function(len) {
                if ($(jv_cur_check).val().length > len)
                    return jv_errors["max_length"].replace("$", len);
            },
            username: function()
            {
                if (!$(jv_cur_check).val())
                    return;
                if (!$(jv_cur_check).val().match(/^[a-zA-Z0-9._-]+$/))
                    return 'Please use only symbols from a to z, A to Z, 0 - 9, hyphens (-), underscores (_) and dots (.)';
            },
            slug: function(file)
            {
                if (!$(jv_cur_check).val().match(/^[a-zA-Z0-9-\/]+$/))
                    return 'Please only use upper and lowercase letters, numbers, hyphens (-) and \\';
                else
                {
                    var element = jv_cur_check;
                    waiting = true;
                    $.post("/" + file, "slug=" + $(jv_cur_check).val(), function(data) {
                        waiting = false;
                        if ($(element).next().attr("id") == "jv_error")
                            $(element).next().remove();
                        if (data && $(element).val())
                            $(element).after(jv_err_open + data + jv_err_close);
                    })
                }
            }
        }
function haveErrors(form)
{
    var found = false;
    $(form).find('#jv_error:visible, .jv_error:not(:empty):visible').each(function() {
        found = true;
        return false;
    })
    return found;
}
function jvAddErrorOn(el, err)
{
    jvRemoveErrorOn(el)
    $(el).after(jv_err_open + err + jv_err_close);
}
function jvGetErrorOn(el)
{
    if ($(el).next().attr("id") == "jv_error")
        return $(el).next().html();
    return "";
}
function jvRemoveErrorOn(el)
{
    if ($(el).next().attr("id") == "jv_error")
        $(el).next().remove();
}
function doSubmit(form, triggered)
{
    if (triggered)
    {
        $(form).find('[data-jv]').each(function() {
            jv_check_field(this, {});
        })
    }
    if (waiting)
    {
        setTimeout(function() {
            doSubmit(form, false)
        }, 1000);
        return;
    }

    var found = false;
    $(form).find("#jv_error:visible, .jv_error:not(:empty):visible").each(function() {
        found = this;
    })
    if (found)
    {
        $('html, body').animate({
            scrollTop: $(found).offset().top
        }, "fast");
        return;
    }
    //for(i in jv_events)
    if ($(form).data("on_ready"))
        $(form).data("on_ready").call(form);
    if (!$(form).attr("data-no-submit"))
        form.submit();
}
$(document).ready(function() {
    /*$("form").each(function(i, el){
     var form = this;
     if($._data(el, 'events'))
     for(i in $._data(el, 'events')['submit'])
     {
     var events = new Array()
     events.push(new Array(form, $._data(el, 'events')['submit'][i].handler));
     $(el).unbind($._data(el, 'events')['submit'][i]);
     }
     })*/
    $('select[data-jv]').change(function() {
        jv_check_field(this, {});
    })
    $('form').submit(function(event) {
        failed = false;
        if ($(this).data("before_checks")) {
            if($(this).data("before_checks")() === false) {
                failed = true;
            }
        }
        if (failed || event.isDefaultPrevented())
        {
            event.preventDefault();
            $(this).find('[data-jv]').each(function() {
                jv_check_field(this, {});
            });
            waiting = false;
            return;
        }
        event.preventDefault();
        doSubmit(this, true);
    })
    $("[data-jv][type='file']").change(function() {
        jv_check_field(this, {});
    })
    $(document).on("change keyup paste textInput input", "[data-jv]", function() {
        var cache = $(this).data("cache");
        if (cache && cache[1] + 1000 > new Date().getTime() && cache[0] == $(this).val())
            return;
        var new_cache = Array();
        new_cache.push($(this).val());
        new_cache.push(new Date().getTime());
        $(this).data("cache", new_cache);
        jv_check_field(this, {});
        $(this).data("prev-val", $(this).val())
    })
})
function jv_add_check(el, check)
{
    if ($(el).attr("data-jv"))
        $(el).attr("data-jv", $(el).attr("data-jv") + " " + check);
    else
        $(el).attr("data-jv", check);
}
function jv_check_field(check, args)
{
    jv_cur_check = check;
    if ($(jv_cur_check).next().attr("id") == "jv_error")
        $(jv_cur_check).next().remove();
    if (!$(jv_cur_check).is(':visible'))
        return;
    var check_arr = $(jv_cur_check).attr('data-jv').split(" ")
    for (i in check_arr)
    {
        if (args && args['skip'] && args['skip'].indexOf(check_arr[i]) != -1)
            continue;
        var error = "";
        var func_name = check_arr[i].match(/^\w+/);
        var params = check_arr[i].substr(String(func_name).length + 1);
        params = params.substr(0, params.length - 1);
        if (error = eval("jv." + func_name).call(undefined, eval("params")))
        {
            $(jv_cur_check).after(jv_err_open + error + jv_err_close);
            return;
        }
    }
}