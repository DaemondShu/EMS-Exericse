/**
 * Created by monkey_d_asce on 16-4-17.
 */

/**
 * 根据paper的json数组来更改页面的值,方式是jquery,教程可以参看http://www.runoob.com/jquery/jquery-tutorial.html里面的
 * @param paperArray : paper数组的对象集合
 */
function message(msg,showFlag){
   //if(showFlag == 0)
        alert(msg);
}
function displayPapers(paperArray)
{
    //init
    var papersDoc = $("#papers");
    //var singlePaper = papersDoc.find(".space-block");
    var singlePaper = papersDoc.html();

    //alert(singlePaper.html());

    //clear
    papersDoc.html("");


    //create N empty html code for N papers

    var len = paperArray.length;
    for (var i =0; i < len; i++)
    {
        papersDoc.append(singlePaper);
    }

    //set attributes
    var paperHtml = papersDoc.first(".space-block");

    for (i=0; i < len; i++ )
    {
        var paperHtml = papersDoc.find(".space-block").eq(i);
        paperHtml.find(".title").html(paperArray[i].title);
        paperHtml.find(".id").html("论文编号："+paperArray[i].id);
        paperHtml.find(".author").html("作者："+paperArray[i].author);
        paperHtml.find(".status").html("状态："+paperArray[i].status);
        paperHtml.find(".date").html("投稿日期："+paperArray[i].date);
        paperHtml.find(".tag").html("标签："+paperArray[i].tag);

        //paperHtml = paperHtml.next(); // next paper
    }


}