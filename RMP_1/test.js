/**
 * Created by lyn on 16-4-16.
 */
/*
$("button").click(function(){
    $.post("http://202.120.40.73:28080/Entity/U9f8d43d15386c1/test/Test/",
        {
            username:"Donald Duck",
        },
        function(data,status){
            alert("Data: " + data + "nStatus: " + status);
        });
});
*/
$(document).ready(function() {
    $("button").click(function () {
        alert("kkkk");
        $.post("http://202.120.40.73:28080/Entity/U9f8d43d15386c1/test/Test/",
            {
                username: "Donald Duck",
            },
            function (data, status) {
                alert("Data: " + data + "nStatus: " + status);
            });
    });
});