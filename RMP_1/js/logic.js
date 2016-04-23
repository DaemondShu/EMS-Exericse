/**
 * Created by monkey_d_asce on 16-4-17.
 */

/**
 * 设置cookie
 * @param name
 * @param value
 * @param time
 * @param path
 */
function setCookie(name,value,time,path)
{
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec*1);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString()+";path="+path;
}

/**
 * 获得cookie
 * @param name
 * @returns {*}
 */
function getCookie(name)
{
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");  //or indexof

    if(arr=document.cookie.match(reg))

        return (arr[2]);
    else
        return null;
}

function getsec(str)
{
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s")
    {
        return str1 * 1000;
    }
    else if (str2 == "h")
    {
        return str1 * 60 * 60 * 1000;
    }
    else if (str2 == "d")
    {
        return str1 * 24 * 60 * 60 * 1000;
    }
}

/**
 * 用户注册
 */
function signUp() {

    var username=$("#username").val();
    var password1=$("#password1").val();
    var password2=$("#password2").val();
    var contact=$("#contact").val();
    if(password1 != password2) 
    {
        message("两次输入的密码不一致",0);
        return;
    }
    get("User","",function(json)
    {
        //alert("注册中");
        var jsonArr = getFirstAttr(json);
        var len=jsonArr.length;
        for(var i=0;i<len;i++)
        {
            if(jsonArr[i].username == username)
            {
                message("用户名已被注册",0);
                return ;
            }
        }
        message("注册成功",0);
        var userTemp={username: username, password:password1, contact:contact};
        post("User",userTemp);

    });
    
}

/**
 * 登录
 */
function login() {
    var username=$("#username").val();
    var password=$("#pass").val();
    //alert(username,password);
    get("User","",function(json)
    {
        var jsonArr = getFirstAttr(json);
        var len = jsonArr.length;
        for(var i=0;i<len;i++)
        {
            if(jsonArr[i].username == username)
            {
                if( jsonArr[i].password == password)
                {
                    message("登录成功",0);
                    setCookie("RMPUser",username,"d1","/");
                    self.location="space.html";
                    return;
                }
                message("密码错误",0);
                return;
            }

        }
        message("用户名不存在",0);
    });

}
/**
 * 注销登录
 */
function logout() {
    var username=getCookie("RMPUser");
    if(username=="")
    {
        message("未登录用户",0);

    }
    else setCookie("RMPUser","","s0","/");
    self.location="index.html";

}

/**
 * 上传论文
 */
function upFile(str,json)
{
    get("Paper",str,function (json) {
        message("json0: "+JSON.stringify(json),1);
        var jsonArr0 = getFirstAttr(json);
        message(jsonArr0,1);
        //var paperId = jsonArr[0].id;
        //upLoadFile("Paper", paperId, getFileObject(("#File")));
    });
}
function upLoad() {
    var title=$("#title").val();
    var author=$("#author").val();
    var outline=$("#outline").val();
    //var paper={title:title,author:author,outline:outline};
    //post("Paper",paper);
    var str="?Paper.title="+title.toString()+"&Paper.author="+author.toString();
    message(str,1);
    get("Paper",str,function (json)
    {
        var jsonArr = getFirstAttr(json);
        if(jsonArr!=undefined)
        {
            message("已提交相同名称和作者的论文",0);
            return;
        }
        else
        {
            var paper={title:title,author:author,outline:outline};
            post("Paper",paper,upFile(str,json));

        }

    });

}
