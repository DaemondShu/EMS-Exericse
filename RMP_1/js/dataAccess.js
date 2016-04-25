/**
 * Created by monkey_d_asce on 16-4-16.
 */
/*
 RMP服务器目前还是存在一些问题的,
 问题汇总:
 1.比如notnull并没有加入判断,不过这是后台服务器的问题
 2.如果发现直接get所有和getbyid结果可能会不一致,请用ctrl+f5刷新浏览器缓存就好了
 3.chrome使用ajax跨域访问可能会被限制,取消这个限制之后就可以用了.其他浏览器可以正常使用

 del失败什么都没返回
 争取做RMP网站的demo
 */

/*
 predefined parameter , according to your RMP resources
 */
var proxtocol = "http";
var address = "202.120.40.73";
var port = "28080";
var RMPschema = "Entity";
var RMPfile = "file";
var userId = "U98eae8340730a";
var RMPProject = "Paper";
var RMPPwd = "mistake";
var EntityUrl = proxtocol + "://" + address + ":" + port + "/" + RMPschema + "/" + userId + "/" + RMPProject + "/";
var fileUrl = proxtocol + "://" + address + ":" + port + "/" + RMPfile + "/" + userId + "/" + RMPProject + "/";




/**
 * 返回对象中的第一个属性
 * @param object
 */
function getFirstAttr(object)
{
    for (var attrname in object)
    {
        return object[attrname];  //直接for in拿到的是keyName,而不是对象
    }

}

function emptyCallBack()
{
    return;
}

/**
 * callback function demo for successful ajax
 * @param json : response information
 */
function defaultSuccess(json)
{
    alert("success : " + (typeof json == "string" ? json : JSON.stringify(json))) ;
}


/**
 * callback function demo for bad ajax
 * @param error : response information
 */
function defaultError(error)
{
    alert("error:" + error.responseText);
}


function isString(str)
{
    return typeof str == "string";
}


/**
 * insert or modify
 * @attention 如果需要修改模型，则需要在URL后增加userid（同本帮助页面URL中的userid），并需要设置HTTP header passwd为用户密码. 服务器没有返回值
 * @param tableNameWithId
 * @param dataStr       :data object or json string
 * @param goodCallBack  :have default function
 * @param errorCallBack :have default function
 * @param isAsync
 */
function post(tableNameWithId, dataStr, goodCallBack, errorCallBack , isAsync)
{
    if (!isString(dataStr))
        dataStr = JSON.stringify(dataStr);
    //alert(dataStr);
    if (goodCallBack == undefined) goodCallBack = defaultSuccess;
    if (errorCallBack == undefined) errorCallBack = defaultError;
    if (isAsync == undefined) isAsync = true;


    $.ajax({
        type: "POST",
        url: EntityUrl + tableNameWithId,
        dataType: "json",
        async: isAsync,
        data: dataStr,
        contentType: "application/json; charset=utf-8",
        headers: {passwd: RMPPwd},
        success: goodCallBack,  //set success callback function
        error: errorCallBack
    });
}


/**
 * insert or modify file
 * @attention 如果需要修改模型，则需要在URL后增加userid（同本帮助页面URL中的userid），并需要设置HTTP header passwd为用户密码. 服务器没有返回值
 * @param tableNameWithId
 * @param data       :file object
 * @param goodCallBack  :have default function
 * @param errorCallBack :have default function
 * @param isAsync
 */
function postFile(tableNameWithId, data, goodCallBack, errorCallBack, isAsync)
{
    alert(data.toString());
    if (goodCallBack == undefined) goodCallBack = defaultSuccess;
    if (errorCallBack == undefined) errorCallBack = defaultError;
    if (isAsync == undefined) isAsync = true;

    $.ajax({
        type: "POST",
        url: EntityUrl + tableNameWithId,
        dataType: "json",
        data: data,
        async: isAsync,
        contentType: false,
        processData: false,
        headers: {passwd: RMPPwd},
        success: goodCallBack,  //set success callback function
        error: errorCallBack
    });
}


/**
 * query
 * @param tableName
 * @param condition
 * @param goodCallBack  :have default function
 * @param errorCallBack :have default function
 * @param isAsync
 * @Sample
 获取指定id的作者 http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/17
 获取所有作者 http://localhost:8080/Entity/U1bd261d221ba87/

 获取指定姓名的作者 http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/?Author.name=你的名字
 获取研究领域和语义网有关的作者 http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/?Author.research=(like)语义网
 获取写过有关“本体建模”的所有作者 (2层查询) http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/?Author.papers.title=(like)本体建模
 获取所有获得过“最佳论文”的作者 (3层查询，每篇论文可以有多个奖励，“最佳论文”是其中一项) http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/?Author.papers.awards.name=最佳论文
 获取所有在本体建模领域获得过“最佳论文”的作者  (3层组合查询） http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/?Author.papers.awards.name=最佳论文 & Author.papers.title=(like)本体建模
 */

function get(tableName, condition, goodCallBack, errorCallBack, isAsync)
{
    if (goodCallBack == undefined) goodCallBack = defaultSuccess;
    if (errorCallBack == undefined) errorCallBack = defaultError;
    if (condition == undefined) condition = "";
    if (isAsync == undefined) isAsync = true;

    $.ajax({
        type: "GET",
        url: EntityUrl + tableName + "/" + condition,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        async: isAsync,
        headers: {passwd: RMPPwd},
        success: goodCallBack,  //set success callback function
        error: errorCallBack
    });
}

/**
 * replace a record in tableName by id
 * @attention 需要包含资源的所有属性，缺省的属性将被置空（PUT操作的语义是替换资源而非修改资源）,服务器会返回dataobj的json
 * @param tableName :format = "talbeName/id"
 * @param dataStr
 * @param goodCallBack
 * @param errorCallBack
 * @Sample: PUT http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/17
 */

function put(tableName, dataObj, goodCallBack, errorCallBack, isAsync)
{

    var id = dataObj.id;
    if (id == undefined)
    {
        alert("put operation needs id");
        return;
    }

    var dataStr = JSON.stringify(dataObj);
    if (goodCallBack == undefined) goodCallBack = defaultSuccess;
    if (errorCallBack == undefined) errorCallBack = defaultError;
    if (isAsync == undefined) isAsync = true;


    $.ajax({
        type: "PUT",
        url: EntityUrl + tableName + "/" + id,
        dataType: "json",
        data: dataStr,
        async: isAsync,
        contentType: "application/json; charset=utf-8",
        // headers: {passwd: RMPPwd},
        success: goodCallBack,  //set success callback function
        error: errorCallBack
    });
}

/**
 * delete a record in tableName by id
 * @TODO chrome 目前需要允许跨域访问可以用(运行时添加指令 --allow-file-access-from-files),firefox可以直接用,别的解决方案寻找中
 * @attention DELETE操作是REST服务中的删除操作。一般情况下请不要试图删除一个资源，删除不会导致资源关系产生级联删除。可以使用PUT来删除子资源
 * @param tableNameWithId
 * @param dataStr
 * @param goodCallBack
 * @param errorCallBack
 */

function del(tableName, id, goodCallBack, errorCallBack, isAsync)
{
    if (goodCallBack == undefined) goodCallBack = defaultSuccess;
    if (errorCallBack == undefined) errorCallBack = defaultError;
    if (isAsync == undefined) isAsync = true;

    $.ajax({
        type: "DELETE",
        url: EntityUrl + tableName + "/" + id,
        dataType: "json",
        async: isAsync,
        contentType: "application/json; charset=utf-8",
        //headers: {passwd: RMPPwd},
        success: goodCallBack,  //set success callback function
        error: errorCallBack
    });
}




/**
 * delete all element in table with name of tableName
 * @param tableName
 */
function clearTable(tableName)
{
    get(tableName,"",function (json)
    {
        var temp = getFirstAttr(json);  //这个狗屁的服务器返回的不是一个json数组,要跳一层.
        for (var i=0; i<temp.length; i++)  //
        {
            //alert(temp[i].id);
            del(tableName,temp[i].id,emptyCallBack,emptyCallBack);
        }
    },defaultError);

}

/**
 * 获取input中的file对象
 * @param htmlId  html中的id
 * @returns {*}
 */
function getFileObject(htmlId)
{
    //get object from input-file tag
    var s = $(htmlId).get(0).files[0];
    return s;
}

/**
 * 将一个文件和tableName关联并且上传
 * @param tableName
 * @param id
 * @param fileObject
 */
function upLoadFile(tableName,id,fileObject)
{

    var jsonObj = new FormData();
    jsonObj.append("file",fileObject);
    postFile(tableName+"/"+id,jsonObj);
}

/**
 * 下载与tableName中的id列相关联的文件
 * @param tableName
 * @param id
 *
 */
function downloadFile(tableName,id)
{
    window.open(fileUrl+tableName+"/"+id);
}