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
        if(jsonArr==undefined)
        {
            message("注册成功", 0);
            var userTemp = {username: username, password: password1, contact: contact,type:0};
            post("User",userTemp,function (json) {
                self.location="index.html";
            });
            return;
        }

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
        var userTemp={username: username, password:password1, contact:contact,type:0};
        post("User",userTemp,function (json) {
            self.location="index.html";
        });



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
                    setCookie("RMPUserId",jsonArr[i].id,"d1","/");
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
    var userId=getCookie("RMPUserId");
    if(userId=="")
    {
        message("未登录用户",0);

    }
    else setCookie("RMPUserId","","s0","/");
    self.location="index.html";

}

/**
 * 上传论文
 */
function upLoad() {
    var title=$("#title").val();
    var author=$("#author").val();
    var outline=$("#outline").val();
    var str="?Paper.title="+title.toString()+"&Paper.author="+author.toString();
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
            var date=new Date();
            var dateStr=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate();
            var userid=getCookie("RMPUserId");
            var paper={title:title,date:dateStr,outline:outline,status:"未审核",author:author,tag:"",user_id:parseInt(userid),feedback:""};
            post("Paper",paper,function (json) {
                message(JSON.stringify(json),1);
                var paperId = json.id;
                message(paperId,1);
                upLoadFile("Paper", paperId, getFileObject(("#File1")));
                //self.location="space.html";
            });


        }

    });
}
/**
 * 下载论文正文
 * @param paperId
 */
function downLoad(paperId) {
    downloadFile("Paper",paperId);

}
/**
 * 审核意见提交
 * @param paperId
 */
function checkSubmit(paperId) {
    var userid=parseInt(getCookie("RMPUserId"));
    get("Paper",paperId,function(json)
    {
        if(json.status!="审核中")
        {
            message("此论文不在审核状态，不能进行此操作",0);
            return;
        }
        get("Review","?Review.paper_id="+paperId,function (json) {
            var jsonArr=getFirstAttr(json);
            var len=jsonArr.length;
            for(var i=0;i<len;i++)
            {
                if(userid==jsonArr[i].user_id)
                {
                    var sugNum=parseInt($("#suggestion").val());
                    var conNum=parseInt($("#confidence").val());
                    var paperid=parseInt(paperId);
                    var review={id:jsonArr[i].id,suggestion:sugNum,confidence:conNum,paper_id:paperid,user_id:userid};
                    put("Review",review);
                    return;
                }
            }
            message("您不是此论文的审稿人，不能进行改操作",0);

        },defaultError,false);
    },defaultError,false);






}
/**
 * 审核人设置提交
 * @param paperId
 */
function manageSubmit(paperId) {
    var judges=new Array([5]);
    judges[0]=$("#people1").val();
    judges[1]=$("#people2").val();
    judges[2]=$("#people3").val();
    judges[3]=$("#people4").val();
    judges[4]=$("#people5").val();
    var count=0;
    var judgesId=0;
    get("User","",function (json) {
        var jsonArr = getFirstAttr(json);
        var len = jsonArr.length;
        for (var i = 0; i < 5; i++) {
            if (judges[i] != "") {
                count++;
            }
        }
        if (count < 3) {
            message("审核人数需要3-5人", 0);
            return;
        }
        for (var i = 0; i < len; i++) {
            for (var j = 0; j < 5; j++) {
                if (jsonArr[i].username == judges[j]) {
                    judgesId = jsonArr[i].id;
                    var tmp = {paper_id: parseInt(paperId), user_id: judgesId};
                    post("Review", tmp,defaultSuccess,defaultError,false);
                }
            }
        }
    });
    get("Paper",paperId,function(json)
    {
        var tmp={id:json.id,title:json.title,date:json.date,outline:json.outline,
            author:json.author,tag:json.tag,status:"审核中",user_id:json.user_id};
        put("Paper",tmp);
    });

}
/**
 * 添加标签
 * @param paperId
 */
function addTag(paperId)
{
    
    var tag=$("#labels").val();
    get("Paper",paperId,function (json) {
        var tagStr=json.tag;
        tagStr=tagStr+"#"+tag+" ";
        var tmp={id:json.id,title:json.title,date:json.date,outline:json.outline,
            author:json.author,tag:tagStr,status:json.status,user_id:json.user_id,feedback:json.feedback};
        put("Paper",tmp);
    });

}
function addFeedback(paperId)
{

    var feedback=$("#feedback").val();
    get("Paper",paperId,function (json) {

        var tmp={id:json.id,title:json.title,date:json.date,outline:json.outline,
            author:json.author,tag:json.tag,status:json.status,user_id:json.user_id,feedback:feedback};
        put("Paper",tmp);
    });

}
/**
 * 是否发表
 * @param paperId
 */
 function publish(paperId) {
    var decision=$("#decision").val();
    get("Paper",paperId,function (json)
    {
        var tmp={id:json.id,title:json.title,date:json.date,outline:json.outline,
            author:json.author,tag:json.tag,status:decision,user_id:json.user_id};
        put("Paper",tmp);

    });

 }

function delPaper(paperId) {
    del("Paper",paperId,function (json) {
        message("删除成功",0);
        self.location="space.html";
    });


}