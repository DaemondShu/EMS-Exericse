/**
 * Created by monkey_d_asce on 16-4-16.
 */
/*
 RMP服务器其实还是存在很多问题的,比如notnull并没有加入判断.
 直接get所有和getbyid结果可能会不一样
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
var userId = "U98eae8340730a";
var RMPProject = "Paper";
var RMPPwd = "mistake";
var projectUrl = proxtocol + "://" + address + ":" + port + "/" + RMPschema + "/" + userId + "/" + RMPProject + "/";


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
 * @param dataStr       :data obejct or json string
 * @param goodCallBack  :have default function
 * @param errorCallback :have default function
 */
function post(tableNameWithId, dataStr, goodCallBack, errorCallback)
{
    if (!isString(dataStr))
        dataStr = JSON.stringify(dataStr);
    if (goodCallBack == undefined) goodCallBack = defaultSuccess;
    if (errorCallback == undefined) errorCallback = defaultError;


    $.ajax({
        type: "POST",
        url: projectUrl + tableNameWithId,
        dataType: "json",
        data: dataStr,
        contentType: "application/json; charset=utf-8",
        headers: {passwd: RMPPwd},
        success: goodCallBack,  //set success callback function
        error: errorCallback
    });
}


/**
 * query
 * @param tableName
 * @param condition
 * @param goodCallBack  :have default function
 * @param errorCallback :have default function
 * @apiSample
 获取指定id的作者 http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/17
 获取所有作者 http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/
 获取指定姓名的作者 http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/?Author.name=你的名字
 获取研究领域和语义网有关的作者 http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/?Author.research=(like)语义网
 获取写过有关“本体建模”的所有作者 (2层查询) http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/?Author.papers.title=(like)本体建模
 获取所有获得过“最佳论文”的作者 (3层查询，每篇论文可以有多个奖励，“最佳论文”是其中一项) http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/?Author.papers.awards.name=最佳论文
 获取所有在本体建模领域获得过“最佳论文”的作者  (3层组合查询） http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/?Author.papers.awards.name=最佳论文 & Author.papers.title=(like)本体建模
 */

function get(tableName, condition, goodCallBack, errorCallback)
{
    if (goodCallBack == undefined) goodCallBack = defaultSuccess;
    if (errorCallback == undefined) errorCallback = defaultError;
    if (condition == undefined) condition = "";

    $.ajax({
        type: "GET",
        url: projectUrl + tableName + "/" + condition,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        // headers: {passwd: RMPPwd},
        success: goodCallBack,  //set success callback function
        error: errorCallback
    });
}

/**
 * replace
 * @attention 需要包含资源的所有属性，缺省的属性将被置空（PUT操作的语义是替换资源而非修改资源）,服务器会返回dataobj的json
 * @param tableName :format = "talbeName/id"
 * @param dataStr
 * @param goodCallBack
 * @param errorCallback
 * urlSample: PUT http://localhost:8080/Entity/U1bd261d221ba87/conference/Author/17
 */

function put(tableName, dataObj, goodCallBack, errorCallback)
{

    var id = dataObj.id;
    if (id == undefined)
    {
        alert("put operation needs id");
        return;
    }

    var dataStr = JSON.stringify(dataObj);
    if (goodCallBack == undefined) goodCallBack = defaultSuccess;
    if (errorCallback == undefined) errorCallback = defaultError;


    $.ajax({
        type: "PUT",
        url: projectUrl + tableName + "/" + id,
        dataType: "json",
        data: dataStr,
        contentType: "application/json; charset=utf-8",
        // headers: {passwd: RMPPwd},
        success: goodCallBack,  //set success callback function
        error: errorCallback
    });
}

/**
 * delete @TODO chrome 需要关掉跨域访问可以用,firefox可以直接用
 * @attention DELETE操作是REST服务中的删除操作。一般情况下请不要试图删除一个资源，删除不会导致资源关系产生级联删除。可以使用PUT来删除子资源
 * @param tableNameWithId
 * @param dataStr
 * @param goodCallBack
 * @param errorCallback
 *
 */

function dell(tableName, id, goodCallBack, errorCallback)
{
    if (goodCallBack == undefined) goodCallBack = defaultSuccess;
    if (errorCallback == undefined) errorCallback = defaultError;


    $.ajax({
        type: "DELETE",
        url: projectUrl + tableName + "/" + id,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        headers: {passwd: RMPPwd},
        success: goodCallBack,  //set success callback function
        error: errorCallback
    });
}


