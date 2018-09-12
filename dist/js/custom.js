if (window.location.hostname == 'doclibrary.sdev') {
    var postURL = 'http://flashboard.sdev/';
} else {
    var postURL = 'https://flashboard.noodlelive.com/';
}
var auth = '';

var leadId;

function tryTag(){
    loadingPage();
    var tagId = '';
    if ($.urlParam('tag') != null){
        tagId = $.urlParam('tag');
    }
    if (auth.length == 0) {
        auth = "Basic "+btoa("00-00-00-00-00-00:456");
    }
    if (tagId.length > 0) {
        $.ajax({
            url: postURL + "api/v2/swipeapp/getuser",
            type: 'post',
            data: {
                event_id: config.event_id,
                tag: tagId
            },
            cache: false,
            headers: {
                "Authorization": auth
            }
        })
        .success(function (returndata) {
            if (returndata.data) {
                var pageContent = {};
                returndata.data['full_name'] = returndata.data['first_name'] + ' ' + returndata.data['last_name'];
                if (field1 && returndata.data[field1]) {
                    pageContent['name'] = escapeHtml(returndata.data[field1]);
                }
                if (field2 && returndata.data[field2]) {
                    if (returndata.data[field2] != null) pageContent['lastText'] = escapeHtml(returndata.data[field2]);
                }
                if (textThankYou != '') pageContent['lastText'] = textThankYou;
                resetHomeView();
                setTimeout(function () {
                    swipePage();
                }, lastPageTimeout);
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
    $('#docPage .pageTitle').html('Policy');
    changeView('docPage');
}

function showTopicalDocs(){
    changeView('loadingPage');
    $("body").removeClass();
    $("body").addClass('greenBg');
    $('#docPage .pageTitle').html('Topical');
    changeView('docPage');
}

function showPracticalDocs(){
    changeView('loadingPage');
    $("body").removeClass();
    $("body").addClass('yellowBg');
    $('#docPage .pageTitle').html('Practical');
    changeView('docPage');
}

function showThanksPage(){
    $("body").removeClass();
    $("body").addClass('redBg');
    changeView('thanksPage');
    setTimeout(function(){
        resetHomeView();
    }, 3000);
}

/*function sendLead(){
	if (validateForm() == true){
		changeView('loadingPage');
	    var user_event_id = $('#attendeeList').val();
	    var email = $('#inputEmail').val();
	    var name = $('#inputName').val();
	    var company = $('#inputCompany').val();
	    var position = $('#inputPosition').val();
		$.post( postURL+"lead/"+config.event_key+"/store-lead", { user_event_id: user_event_id, email: email, name: name, company: company, position: position })
			.done(function(data) {
				leadId = data.lead.id;
				$('#documentList tbody').empty();
				$('#emailBody').val(config.emailBody);
				$.each(data.documents, function (key,documentChoice){
					var printDocName = documentChoice.title.replace('.'+documentChoice.document,'')
					$('#documentList > tbody').append('<tr><td>'+printDocName+'</td><td><input type="checkbox" name="document[]" value="'+documentChoice.id+'" /></td></tr>');
				});
				changeView('docPage');
			})
			.fail(function(xhr, status) {
	    		changeView('homePage');
				showError("Could not send to the server");
			});
	} else {
		changeView('homePage');
		if($("#homeAlert").length == 0) {
			$('#homeWarningArea').append('<div class="alert alert-danger fade in" id="homeAlert">Please complete all fields.</div>');
		}
	}
}*/

function sendDocuments(){
    loadingPage();
    $("body").removeClass();
    $("body").addClass('whiteBg');
    changeView('successPage');



    // var user_event_id = $('#attendeeList').val();
    // var docs = $('input[type="checkbox"][name="document\\[\\]"]:checked').map(function() { return this.value; }).get();
	// var emailBody = $('#emailBody').val();
	// $.post( postURL+"lead/"+config.event_key+"/store-lead-document", { user_event_id: user_event_id, lead_id: leadId, docs: docs, email_subject: config.emailSubject, email_body: emailBody })
	// 	.done(function(data) {
	// 		$('#setEmail').html($('#inputEmail').val());
	// 		var docNames = $('input[type="checkbox"][name="document\\[\\]"]:checked').map(function() { return $(this).parent().parent().children('td:first').text(); }).get();
	// 		if (docNames.length == 0){
	// 			$('#setDocuments').html('None selected');
	// 		} else {
	// 			$('#setDocuments').html('');
	// 			$.each(docNames, function (key,documentName){
    	// 			$('#setDocuments').append(documentName+'<br />');
    	// 		});
	// 		}
	// 		changeView('thanksPage');
	// 	})
	// 	.fail(function(xhr, status) {
	// 		showError("Could not send to the server");
	// 	});
}

/*function setAttendees(){
	$.post( postURL+"event-data/"+config.event_key+"/attendee-list", {})
		.done(function(data) {
			var defaultUser = ''
			if ($.urlParam('user') != null){
				defaultUser = $.urlParam('user');
			}
			data.forEach( function(data) {
				$('#attendeeList').append($("<option/>", {
			        value: data.id,
			        text: data.name+" ("+data.company+")"
			    }));
			    if (data.uniquekey == defaultUser){
			    	$('select option[value="'+data.id+'"]').attr("selected",true);
			    }
	        });
		})
		.fail(function(xhr, status) {
			showError("A problem has occured");
		});
}*/

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
