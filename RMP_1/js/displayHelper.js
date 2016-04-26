/**
 * Created by monkey_d_asce on 16-4-17.
 */

/**
 * 提示信息
 * @param msg
 * @param showFlag
 */
function message(msg,showFlag){
   if(showFlag == 0)
        alert(msg);
}

var singlePaper = "";
/**
 * 根据paper的json数组来更改页面的值,方式是jquery
 * @param str
 * @param paperArray
 */
function displayPapers(str,paperArray)
{
    //init
    var papersDoc = $("#papers");
    //var singlePaper = papersDoc.find(".space-block");
    singlePaper = singlePaper=="" ? papersDoc.html() : singlePaper;

    //alert(singlePaper.html());

    //clear
    papersDoc.html("");


    //create N empty html code for N papers

    var len =0;
    if(paperArray!=undefined)
        len=paperArray.length;
    for (var i =0; i < len; i++)
    {
        papersDoc.append(singlePaper);
    }

    //set attributes
    //var paperHtml = papersDoc.first("."+str);

    for (i=0; i < len; i++ )
    {
        var paperHtml = papersDoc.find("."+str).eq(i);
        //var tt=paperArray[i].title;
        paperHtml.find(".title").html(paperArray[i].title);
        paperHtml.find(".id").html("论文编号："+paperArray[i].id);
        paperHtml.find(".author").html("作者："+paperArray[i].author);
        paperHtml.find(".status").html("审核结果："+paperArray[i].status);
        paperHtml.find(".date").html("投稿日期："+paperArray[i].date);
        paperHtml.find(".tag").html("标签："+paperArray[i].tag);
        paperHtml.find(".outline").html("简介："+paperArray[i].outline);
       
        //paperHtml = paperHtml.next(); // next paper
    }


}
/**
 * 修改对应的页面跳转
 * @param str
 * @param paperArray
 */
function changeHref(str,paperArray) {
    var papersDoc = $("#papers");
    //var paperHtml = papersDoc.first(".space-block");
    var len =0;
    if(paperArray!=undefined)
        len=paperArray.length;
    for (var i=0; i < len; i++ ) 
    {
        var paperHtml = papersDoc.find(".space-block").eq(i);
        paperHtml.find("#"+str+"href").attr("href", str+"_01.html?id=" + paperArray[i].id);
    }
}
/**
 * 从url中获取id
 * @param name
 * @returns {null}
 */
function getQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
/**
 * 获取数据库中的suggestion,转化为对应的字符串显示
 * @param sugSum
 * @returns {string}
 */
function suggestion2Str(sugSum) {
    var suggest="";
    if(sugSum==4) suggest="Strong Accept";
    else if(sugSum==3) suggest="Accept";
    else if(sugSum==2) suggest="Weak Accept";
    else if(sugSum==1) suggest="Borderline Paper";
    else if(sugSum==0) suggest="Weak Reject";
    return suggest;

}
/**
 * 获取数据库中的confidence，转化为对应的字符串显示
 * @param conSum
 * @returns {string}
 */
function confidence2Str(conSum) {
    var confidence="";
    if(conSum==4) confidence="Expert";
    else if(conSum==3) confidence="High";
    else if(conSum==2) confidence="Medium";
    else if(conSum==1) confidence="Low";
    else if(conSum==0) confidence="null";
    return confidence;
}

/**
 * 在页面显示最终的审核结果
 * @param resArray
 */
function displayRes(resArray) {
    var papersDoc = $("#papers");
    var paperHtml = papersDoc.first(".space-detail-block");
    var len =0;var sugSum=0.0;var conSum=0.0;
    if(resArray==undefined) return;
    len=resArray.length;
    for (var i=0; i < len; i++ )
    {
        sugSum+=resArray[i].suggestion;
        conSum+=resArray[i].confidence;
    }
    sugSum=Math.round(sugSum/len);
    conSum=Math.round(conSum/len);
    var suggest=suggestion2Str(sugSum);
    var confidence=confidence2Str(conSum);

    paperHtml.find(".suggest").html("审稿意见: "+suggest);
    paperHtml.find(".confi").html("信任度: "+confidence);
   // paperHtml.find(".result").html("最终决定| "+)
}

/**
 * 在页面显示已有的审核意见
 * @param paperArray
 */
function displaySuggestion(paperArray) {
    var papersDoc = $("#others");
    //var singlePaper = papersDoc.find(".space-block");
    var singlePaper = papersDoc.html();

    //alert(singlePaper.html());

    //clear
    papersDoc.html("");


    //create N empty html code for N papers

    var len =0;
    if(paperArray!=undefined)
        len=paperArray.length;
    var count=0;
    //set attributes

    for (var i=0; i < len; i++ )
    {
        //alert(paperArray[i].suggestion);
        if(paperArray[i].suggestion==undefined) continue;
        papersDoc.append(singlePaper);
        var paperHtml = papersDoc.find(".other-suggest").eq(count++);
        get("User",paperArray[i].user_id,function (json) {
           // var jsonArr=getFirstAttr(json);
            paperHtml.find(".username").html(json.username);
            paperHtml.find(".suggestion").html("审稿意见："+suggestion2Str(paperArray[i].suggestion));
            paperHtml.find(".confidence").html("信任度："+confidence2Str(paperArray[i].confidence));
        },defaultError,false);

    }

}
/**
 * 根据输入的关键词搜索已发布的论文
 */
function searchFooterFunc() {
    
    var search=$("#search").val();
    var choose=$("#chose").val();
    var paperArr=new Array();
    var index=0;
    get("Paper","",function (json) {
        var jsonArr=getFirstAttr(json);
        var len=0;
        if(jsonArr!=undefined) len=jsonArr.length;
        for(var i=0;i<len;i++)
        {
            if(jsonArr[i].status=="Accept")
            {
                if(choose=="0")
                {
                    if(jsonArr[i].title.indexOf(search)>=0)
                        paperArr[index++]=jsonArr[i];
                }
                else if(choose=="1")
                {
                    if(jsonArr[i].date.indexOf(search)>=0)
                        paperArr[index++]=jsonArr[i];
                }
                else if(choose=="2")
                {
                    if(jsonArr[i].author.indexOf(search)>=0)
                        paperArr[index++]=jsonArr[i];
                }
                else if(choose=="3")
                {
                    if(jsonArr[i].tag.indexOf(search)>=0)
                        paperArr[index++]=jsonArr[i];
                }
            }
        }
        displayPapers("space-block",paperArr);

    },defaultError,false);


}