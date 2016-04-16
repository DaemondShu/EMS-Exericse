/**
 * Created by monkey_d_asce on 16-4-16.
 */

function post()
{

    $.ajax({

        type: "POST",

        url: "http://202.120.40.73:28080/Entity/U98eae8340730a/Paper/Paper/",

        dataType: "json",
        data:JSON.stringify({title:"kk", date:"1999_9_9" }),

        contentType: "application/json; charset=utf-8",
        headers: {passwd: "mistake"},
        success: function(json) { alert(json.Value) },

        error: function(error) {

            alert("调用出错" + error.responseText);

        }
    });
}