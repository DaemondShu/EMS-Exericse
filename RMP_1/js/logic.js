/**
 * Created by monkey_d_asce on 16-4-17.
 */
//document.write("<script language=\"javascript\" src=\"dataAccess.js\"></script>");
//------signUp------
function signUp() {
    var username=$("#username").val();
    var password1=$("#password1").val();
    var password2=$("#password2").val();
    var contact=$("#contact").val();
    if(password1 != password2) 
    {
        alert("两次输入的密码不一致");
        return;
    }
    //alert("mmm");
    // get("User","",function(json)
    // {
    //     //alert("kkkk");
    //     var len=json.length;
    //     for(var i=0;i<len;i++)
    //     {
    //         if(json[i].username == username)
    //         {
    //             alert("用户名已被注册");
    //             return ;
    //         }
    //     }
    // });
    get("User","");
    // alert(username);
    // var userTemp="{username: "+username+", password:"+password1+", contact: "+contact+"}";
    // alert(userTemp);
    //post("User",userTemp);

    
}