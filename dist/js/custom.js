if (window.location.hostname == 'doclibrary.sdev') {
    var postURL = 'http://flashboard.sdev/';
} else {
    var postURL = 'https://flashboard.noodlelive.com/';
}
var auth = '';
var usersName = '';
var docData = {};

var leadId;

function tryTag(){
    loadingPage();
    var tagId = '';
    if ($.urlParam('tag') != null){
        tagId = $.urlParam('tag');
    }
    if (auth.length == 0) {
        auth = "Basic "+btoa(config.virtual_reader_id+":456");
    }
    if (tagId.length > 0) {
        $.ajax({
            url: postURL + "api/v2/swipeapp/getuserwithfolderdocs",
            type: 'post',
            data: {
                event_id: config.event_id,
                tag: tagId,
                folder: config.folderIds
            },
            cache: false,
            headers: {
                "Authorization": auth
            }
        })
        .success(function (returndata) {
            if (returndata.data) {
                usersName = returndata.data['first_name'] + ' ' + returndata.data['last_name'];
                docData = returndata.docs;
                resetHomeView();
            } else {
                showError("Card not recognised");
                swipePage();
            }
        })
        .fail(function (xhr, status) {
            showError("Card not recognised");
            swipePage();
        });
    } else {
        showError("No tag passed");
        swipePage();
    }
}

function resetHomeView(){
    $("body").removeClass();
    $("body").addClass('whiteBg');
    changeView('homePage');
}

function swipePage(){
    $("body").removeClass();
    $("body").addClass('whiteBg');
    changeView('swipePage');
}

function loadingPage(){
    $("body").removeClass();
    $("body").addClass('whiteBg');
    changeView('loadingPage');
}

function showPolicyDocs(){
    changeView('loadingPage');
    $("body").removeClass();
    $("body").addClass('blueBg');
    setDocList(0);
    $('#docPage .pageTitle').html('Policy');
    changeView('docPage');
}

function showTopicalDocs(){
    changeView('loadingPage');
    $("body").removeClass();
    $("body").addClass('greenBg');
    setDocList(1);
    $('#docPage .pageTitle').html('Topical');
    changeView('docPage');
}

function showPracticalDocs(){
    changeView('loadingPage');
    $("body").removeClass();
    $("body").addClass('yellowBg');
    setDocList(2);
    $('#docPage .pageTitle').html('Practical');
    changeView('docPage');
}

function showThanksPage(){
    $("body").removeClass();
    $("body").addClass('redBg');
    $('#usersName').html(usersName+'!');
    changeView('thanksPage');
    setTimeout(function(){
        swipePage();
    }, 3000);
}

function setDocList(folderKey){
    var docsHtml = '';
    if (docData[config.folderIds[folderKey]]) {
        $.each(docData[config.folderIds[folderKey]], function (key, docOption) {
            docsHtml += '<div class="row answerOptions mainColour" onclick="selectCheck(' + key + ')" id="radioOption_' + key + '"><span class="radioBtn"><img data-attr="' + key + '" src="dist/img/ArrowOff.png" alt="" height="40px" /></span>' + docOption + '</div>';
        });
    }
    $('#docList').html(docsHtml);
}

function selectCheck(selectedId){
    selectedAnswer = selectedId;
    if ($('#radioOption_'+selectedId).find('img').attr('src') == 'dist/img/ArrowOn.png'){
        $('#radioOption_'+selectedId).find('img').attr('src','dist/img/ArrowOff.png');
    } else {
        $('#radioOption_'+selectedId).find('img').attr('src','dist/img/ArrowOn.png');
    }
}

function sendDocuments(){
    loadingPage();
    var docs = $('.listScrollable img').map(function() {
        if ($(this).attr('src') == 'dist/img/ArrowOn.png'){
            return $(this).attr('data-attr');
        }
    }).get();
    var tagId = '';
    if ($.urlParam('tag') != null){
        tagId = $.urlParam('tag');
    }
    if (docs.length != 0) {
        $.post(postURL + "api/swipeapp/documents/" + config.event_id + "/" + config.virtual_reader_id + "/send-docs", {
            tag: tagId,
            docs: docs
        })
            .done(function (data) {
                $("body").removeClass();
                $("body").addClass('whiteBg');
                changeView('successPage');
            })
            .fail(function (xhr, status) {
                swipePage();
                showError("Could not reach the server.");
            });
    } else {
        $("body").removeClass();
        $("body").addClass('whiteBg');
        changeView('successPage');
    }
}

function showError(error){
	$('#alertMessage').html("");
    $('#alertMessage').append("Error: "+error);
    $("#alertMessage").fadeTo(2000, 500).slideUp(500, function(){
    	$("#alertMessage").alert();
		$("#alertMessage").slideUp(500);
	});
}

function changeView(showView){
	$("#homePage, #docPage, #successPage, #thanksPage, #loadingPage").addClass('hidden');
    $("#"+showView).removeClass('hidden');
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}


$(function(){
    $('#alertMessage').hide();

    tryTag();

    $("#policySelection").click(function() {
        showPolicyDocs();
    });
    $("#topicalSelection").click(function() {
        showTopicalDocs();
    });
    $("#practicalSelection").click(function() {
        showPracticalDocs();
    });
	
	$("#sendDocs").click(function() {
		sendDocuments();
	});

    $("#selectMore").click(function() {
        resetHomeView();
    });

    $("#selectDone").click(function() {
        showThanksPage();
    });
});
