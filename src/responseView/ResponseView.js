import { ActionHelper, Localizer } from '../common/ActionSdkHelper';

// Fetching HTML Elements in Variables by ID.
let request;
let $root = "";
let row = {};
let actionInstance = null;
let maxQuestionCount = 0;
let currentPage = 0;
let summaryAnswerResp = [];
let actionDataRows = null;
let actionDataRowsLength = 0;
let memberIds = [];
let myUserId = [];
let contextActionId;
let answerIs = '';
let questionKey = '';
let questionsKey = '';
let startKey = '';
let noteKey = '';
let choiceAnyChoiceKey = '';
let continueKey = '';
let answerResponseKey = '';
let correctKey = '';
let yourAnswerKey = '';
let incorrectKey = '';
let correctAnswerKey = '';
let yourAnswerRightKey = '';
let yourAnswerIsKey = ''
let rightAnswerIsKey = '';
let submitKey = '';
let quizSummaryKey = '';
let nextKey = '';
let backKey = '';
let checkKey = '';
let prevKey = '';
let quizExpiredKey = '';

/* Async method for fetching localization strings */
async function getStringKeys() {
    Localizer.getString('question').then(function(result) {
        questionKey = result;
        $('.question-key').text(questionKey);
    });

    Localizer.getString('questions').then(function(result) {
        questionsKey = result;
        $('.question-key').text(questionsKey);
    });

    Localizer.getString('start').then(function(result) {
        startKey = result;
        $('#start').text(startKey);
    });

    Localizer.getString('note').then(function(result) {
        noteKey = result;
        $('.note-key').text(noteKey);
    });

    Localizer.getString('choose_any_choice').then(function(result) {
        choiceAnyChoiceKey = result;
    });

    Localizer.getString('continue').then(function(result) {
        continueKey = result;
    });

    Localizer.getString('answer_response').then(function(result) {
        answerResponseKey = result;
    });

    Localizer.getString('correct').then(function(result) {
        correctKey = result;
    });

    Localizer.getString('your_answer').then(function(result) {
        yourAnswerKey = result;
    });

    Localizer.getString('incorrect').then(function(result) {
        incorrectKey = result;
    });

    Localizer.getString('correctAnswer').then(function(result) {
        correctAnswerKey = result;
    });

    Localizer.getString('your_answer_is').then(function(result) {
        yourAnswerIsKey = result;
    });

    Localizer.getString('right_answer_is').then(function(result) {
        rightAnswerIsKey = result;
    });

    Localizer.getString('submit').then(function(result) {
        submitKey = result;
        $('.submit-key').text(submitKey);
    });

    Localizer.getString('quiz_summary').then(function(result) {
        quizSummaryKey = result;
    });

    Localizer.getString('next').then(function(result) {
        nextKey = result;
        $('.next-key').text(nextKey);
    });

    Localizer.getString('back').then(function(result) {
        backKey = result;
        $('.back-key').text(backKey);
    });

    Localizer.getString('prev').then(function(result) {
        prevKey = result;
        $('.prev-key').text(prevKey);
    });

    Localizer.getString('check').then(function(result) {
        checkKey = result;
        $('.check-key').text(checkKey);
    });

    Localizer.getString('quiz_expired').then(function(result) {
        quizExpiredKey = result;
        $('#quiz-expired-key').text(backKey);
    });

}

/* 
 * @desc Method to select theme based on the teams theme  
 * @param request context request
 */
async function getTheme(request) {
    let response = await ActionHelper.executeApi(request);
    let context = response.context;
    $("form.section-1").show();
    let theme = context.theme;
    $("link#theme").attr("href", "css/style-" + theme + ".css");

    $('div.section-1').append(`<div class="row"><div class="col-12"><div id="root"></div></div></div>`);
    $('div.section-1 div.row').prepend(`
            <div class="col-12 quiz-img-sec">
                <div class="quiz-updated-img card max-min-220 card-bg card-border cover-img upvj cursur-pointer mb--16" style="display: none">
                    <img src="" class="image-responsive w-100 quiz-template-image" style="display:none" />
                </div>
            </div>`);
    $('div.section-1').after(modal_section);
    $('div.section-1').after(modal_section2);

    $root = $("#root")

    setTimeout(() => {
        $('div.section-1').show();
        $('div.footer').show();
    }, 1000);

    ActionHelper.hideLoader();

    OnPageLoad();
}

// *********************************************** HTML ELEMENT***********************************************
/* Initiate Method */
$(document).ready(function() {
    request = ActionHelper.getContextRequest();
    getTheme(request);
});

/* Method loads the landing page */
function OnPageLoad() {
    ActionHelper
        .executeApi(request)
        .then(function(response) {
            myUserId = response.context.userId;
            contextActionId = response.context.actionId
            getResponderIds(contextActionId);

        })
        .catch(function(error) {
            console.error("GetContext - Error: " + JSON.stringify(error));
        });
}

/* 
 * @desc Method get Responder Details  
 * @param action context id
 */
async function getResponderIds(actionId) {
    ActionHelper
        .executeApi(ActionHelper.requestDataRows(actionId))
        .then(function(batchResponse) {
            actionDataRows = batchResponse.dataRows;
            actionDataRowsLength = actionDataRows == null ? 0 : actionDataRows.length;

            if (actionDataRowsLength > 0) {
                for (let i = 0; i < actionDataRowsLength; i++) {
                    memberIds.push(actionDataRows[i].creatorId);
                }
            }
            getActionInstance(actionId);
        })
        .catch(function(error) {
            console.error("Console log: Error: " + JSON.stringify(error));
        });
}

/* 
 * @desc Method get questions and options  
 * @param action context id
 */
function getActionInstance(actionId) {
    ActionHelper
        .executeApi(ActionHelper.getActionRequest(actionId))
        .then(function(response) {
            actionInstance = response.action;
            createBody();
        })
        /* .catch(function(error) {
            console.error("Error: " + JSON.stringify(error));
        }) */
    ;
}

/* Method for creating the response view structure and initialize value */
function createBody() {

    /*  Check Expiry date time  */
    let current_time = new Date().getTime();
    if (actionInstance.expiryTime <= current_time) {
        let $card = $('<div class="card"></div>');
        let $spDiv = $('<div class="col-sm-12"></div>');
        let $sDiv = $(`<div class="form-group" id="quiz-expired-key">${quizExpiredKey}</div>`);
        $card.append($spDiv);
        $spDiv.append($sDiv);
        $root.append($card);
        getStringKeys();

    } else {
        getStringKeys();

        let $card = $('<div class=""></div>');
        let $title = $(`<h4 class="mb--8"> ${actionInstance.displayName} </h4>`);
        let $description = $(`<p class="mb--24 text-justify text-break">${actionInstance.customProperties[0].value}</p>`);
        $card.append($title);
        $card.append($description);
        $root.append($card);

        let counter = actionInstance.dataTables[0].dataColumns.length
        $root.append(text_section1);

        if ($.inArray(myUserId, memberIds) > -1) {
            calculateScore();
        } else {
            if (counter > 1) {
                Localizer.getString('questions').then(function(result) {
                    Localizer.getString('totalQuestionQuiz', counter, result).then(function(res) {
                        $('div.text-counter-ques:last').find('.text-description').text(res);
                    });
                });
            } else {
                Localizer.getString('question').then(function(result) {
                    Localizer.getString('totalQuestionQuiz', counter, result).then(function(res) {
                        $('div.text-counter-ques:last').find('.text-description').text(res);
                    });
                });
            }
            $root.after(footer_section1);
        }

        getStringKeys();

        console.log('actionInstance: ' + JSON.stringify(actionInstance));

        if (actionInstance.customProperties[4].value != "") {

            let req = ActionHelper.getAttachmentInfo(null, actionInstance.customProperties[4].value);
            // let req = ActionHelper.getAttachmentInfo("17a1abe5-bdc6-4ccd-8937-cf33314cfe77", "e813b1d9-4cb0-47a9-b44e-d294f37b8622");
            console.log('req1: ' + JSON.stringify(req));
            ActionHelper.executeApi(req).then(function(response) {
                    console.info("Attachment - Response: " + JSON.stringify(response));
                    $('.quiz-template-image').attr("src", response.attachmentInfo.downloadUrl);
                    $('.quiz-template-image').show();
                    $('.quiz-updated-img').show();
                })
                /* .catch(function(error) {
                    console.error("AttachmentAction - Error: " + JSON.stringify(error));
                }); */
        }
        return;
    }
}

/**
 * @description Calculate User Score
 */

function calculateScore() {
    let total = 0;
    let score = 0;
    actionInstance.dataTables.forEach((dataTable) => {
        total = Object.keys(dataTable.dataColumns).length;
        dataTable.dataColumns.forEach((question, ind) => {
            let ansCorrAnsArr = [];
            question.options.forEach((option, optind) => {
                /* User Responded */
                let userResponse = [];
                let userResponseAnswer = "";
                for (let i = 0; i < actionDataRowsLength; i++) {
                    if (actionDataRows[i].creatorId == myUserId) {
                        userResponse = actionDataRows[i].columnValues;
                        let userResponseLength = Object.keys(userResponse).length;

                        for (let j = 1; j <= userResponseLength; j++) {
                            if (ActionHelper.isJson(userResponse[j])) {
                                let userResponseAns = JSON.parse(userResponse[j]);
                                let userResponseAnsLen = userResponseAns.length;
                                if (userResponseAnsLen > 1) {
                                    for (let k = 0; k < userResponseAnsLen; k++) {
                                        if (userResponseAns[k] == option.name) {
                                            userResponseAnswer = userResponseAns[k];
                                        } else {
                                            continue;
                                        }
                                    }
                                } else {
                                    userResponseAnswer = userResponseAns;
                                }
                            } else {
                                if (userResponse[j] == option.name) {
                                    userResponseAnswer = userResponse[j];
                                }
                            }
                        }
                    }
                }
                /* Correct Answer */
                let correctResponse = JSON.parse(
                    actionInstance.customProperties[5].value
                );
                let correctResponseLength = Object.keys(correctResponse).length;
                let correctAnswer = "";
                for (let j = 0; j < correctResponseLength; j++) {
                    let correctResponseAns = correctResponse[j];
                    let correctResponseAnsLen = correctResponseAns.length;
                    for (let k = 0; k < correctResponseAnsLen; k++) {
                        if (correctResponseAns[k] == option.name) {
                            correctAnswer = correctResponseAns[k];
                        }
                    }
                }

                let optName = JSON.parse(option.displayName).name
                let $radioOption = getOptions(
                    optName,
                    question.name,
                    option.name,
                    userResponseAnswer,
                    correctAnswer
                );
                ansCorrAnsArr[optind] = answerIs;
            });

            if (ansCorrAnsArr.includes('Incorrect') == false) {
                score++;
            }
        });

        console.log(`score: `);
        console.log(`${score} / ${total}`);
        let scorePercentage = 0;
        if (score > 0) {
            scorePercentage = Math.round((score / total) * 100);
        }

        Localizer.getString("score", ":").then(function(result) {
            $('div.text-counter-ques:last').find('.text-description').html(`<p class="text-description bold">${result} ${scorePercentage}%</p>`);
        });
    })
}

/* 
 * @desc Method for Question view based on user id  
 * @param text String contains correct and incorrect message
 * @param name String contains option name
 * @param id String contains option id
 * @param userResponse String contains user response data
 * @param correctAnswer String contains correct answer 
 */
function getOptions(text, name, id, userResponse, correctAnswer) {
    /*  If answer is correct  and answered */
    if ($.trim(userResponse) == $.trim(id) && $.trim(correctAnswer) == $.trim(id)) {
        if (answerIs == "") {
            answerIs = "Correct";
        }
    } else if ($.trim(userResponse) != $.trim(id) && $.trim(correctAnswer) == $.trim(id)) {
        /* If User Response is incorrect and not answered */

    } else if ($.trim(userResponse) == $.trim(id) && $.trim(correctAnswer) != $.trim(id)) {
        /* If User Response is incorrect and answered */
        answerIs = "Incorrect";
    }

}

/* Click Event on start button and loads first question */
$(document).on('click', '#start', function() {
    $root.html('');
    maxQuestionCount = actionInstance.dataTables[0].dataColumns.length;
    getStringKeys();

    createQuestionView();
})

/* Click Event on submit quiz and loads summary view */
$(document).on('click', '.submit-form', function() {
    summarySection();
});

/* Method for creating Question */
function createQuestionView() {
    $('.footer.section-1-footer').remove();
    $root.after(pagination_footer_section);

    if (currentPage > 0) {
        $('#previous').removeClass('disabled');
    } else {
        $('#previous').addClass('disabled');
    }

    $('#previous').attr('data-prev-id', (parseInt(currentPage) - 1));
    $('#next').attr('data-next-id', (parseInt(currentPage) + 1));
    $('#check').attr('data-next-id', (parseInt(currentPage) + 1));

    Localizer.getString('xofy', parseInt(currentPage) + 1, maxQuestionCount).then(function(result) {
        $('#xofy').text(result);
        nextButtonName();
    });

    actionInstance.dataTables.forEach((dataTable) => {
        let question = dataTable.dataColumns[currentPage];
        if ($('.quiz-img-sec').length > 0) {
            $('.quiz-img-sec').remove();
        }
        let count = parseInt(currentPage) + 1;
        $root.append(question_section);
        $('#root div.card-box-question:visible .question-number-title').html(`
            <label class="font-12">
                <span class="question-number">Question # ${count}</span>
            </label>
        `);

        if (JSON.parse(question.displayName).attachmentId != "") {
            // let req = ActionHelper.getAttachmentInfo(actionInstance.id, JSON.parse(question.displayName).attachmentId);
            let req = ActionHelper.getAttachmentInfo(null, JSON.parse(question.displayName).attachmentId);
            ActionHelper.executeApi(req).then(function(response) {
                    console.info("Attachment - Response: " + JSON.stringify(response));
                    $('#root div.card-box-question:visible .question-template-image').attr("src", response.attachmentInfo.downloadUrl);
                    $('#root div.card-box-question:visible .question-template-image').show();
                    $('#root div.card-box-question:visible .quiz-updated-img').show();
                })
                .catch(function(error) {
                    console.error("AttachmentAction - Error: " + JSON.stringify(error));
                });
        }

        $('#root div.card-box-question:visible .question-title').html(`<p class="text-justify">${JSON.parse(question.displayName).name}</p>`);
        let choice_occurance = 0;
        /* Check multichoice or single choice options  */
        if (question.valueType == "SingleOption") {
            choice_occurance = 1;
        } else {
            choice_occurance = 2;
        }

        console.log('question.options: ');
        console.log(question.options);

        //add checkbox input
        if (choice_occurance > 1) {
            question.options.forEach((option) => {
                let displayName = JSON.parse(option.displayName).name;
                let attachmentId = JSON.parse(option.displayName).attachmentId;
                let $radioOption = getCheckboxButton(
                    displayName,
                    question.name,
                    option.name,
                    attachmentId
                );
                $('div.card-box-question:visible > .option-sec').append($radioOption);
            });
        } else {
            //add radio input
            question.options.forEach((option) => {
                let displayName = JSON.parse(option.displayName).name;
                let attachmentId = JSON.parse(option.displayName).attachmentId;
                let $radioOption = getRadioButton(
                    displayName,
                    question.name,
                    option.name,
                    attachmentId
                );
                $('div.card-box-question:visible > .option-sec').append($radioOption);
            });
        }
    });
}

/* 
 *@desc Method for creating Radio button for single select type question 
 *@param text label for radio button
 *@param name column id fo question
 *@param id unique identifier
 */
function getRadioButton(text, name, id, attachmentId) {
    if (attachmentId != "") {
        let req = ActionHelper.getAttachmentInfo(null, attachmentId);
        ActionHelper.executeApi(req).then(function(response) {
                console.info("Attachment - Response: " + JSON.stringify(response));
                $('div.custom-radio-outer#' + id + ' .custom-radio').prepend(`<div class="option-image-section cover-img max-min-220 mb--8">
                        <img src="${response.attachmentInfo.downloadUrl}" class="opt-image img-responsive"/>
                    </div>`)
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error: " + JSON.stringify(error));
            });
    }
    return $(`<div class="card-box card-bg card-border mb--8">
                <div class="radio-section custom-radio-outer" id="${id}" columnId="${name}"> 
                    <label class="custom-radio d-block font-14 cursor-pointer selector-inp">
                        <input type="radio" name="${name}" id="${id}">
                        <span class="radio-block"></span> 
                        <div class="pr--32 text-justify check-in-div">${text}</div>
                    </label>
                </div>
            </div>`);
}

/*
 *@desc Method for creating checkbox button for single select type question 
 *@param text label for radio button
 *@param name column id fo question
 *@param id unique identifier
 */
function getCheckboxButton(text, name, id, attachmentId) {
    if (attachmentId != "") {
        let req = ActionHelper.getAttachmentInfo(null, attachmentId);
        ActionHelper.executeApi(req).then(function(response) {
                console.info("Attachment - Response: " + JSON.stringify(response));
                $('div.radio-section#' + id + ' .custom-radio').prepend(`
                    <label class="custom-radio d-block font-14 cursor-pointer selector-inp">
                        <div class="option-image-section updated-img cover-img max-min-220 mb--8">
                            <img src="${response.attachmentInfo.downloadUrl}" class="opt-image img-responsive"/>
                        </div>
                    </label>        
                `);
            })
            .catch(function(error) {
                console.error("AttachmentAction - Error: " + JSON.stringify(error));
            });
    }
    return $(`<div class="card-box card-bg card-border mb--8">
                <div class="radio-section custom-check-outer selector-inp" id="${id}" columnId="${name}" >
                    <label class="custom-check form-check-label d-block">
                        <input type="checkbox" class="radio-block" name="${name}" id="${id}">
                        <span class="checkmark"></span> 
                        <div class="pr--32 text-justify check-in-div">${text}
                        </div>
                    </label>
                </div>
            </div>`);
}

/* Method handles button text */
function nextButtonName() {
    let currentPage = $('#next').attr('data-next-id');
    console.log(`${parseInt(currentPage)} >= ${maxQuestionCount}`)
    if (parseInt(currentPage) >= maxQuestionCount) {
        setTimeout(function() {
            $('.section-1-footer').find('.next-key').text('Done');
        }, 100);
    } else {
        setTimeout(function() {
            $('.section-1-footer').find('.next-key').text('Next');
        }, 100);
    }
}

/* Click event handles the radio is selcct as correct answer */
$(document).on('click', 'div.radio-section', function() {
    radiobuttonclick();
})

/* Click event handles next questions */
$(document).on("click", '#next', function() {
    let answerKeys = JSON.parse(actionInstance.customProperties[5].value);
    let correctAnsArr = [];
    let selectedAnswer = [];
    let checkCounter = 0;
    let correctAnswer = false;
    let attrName = '';
    let pagenumber = $(this).attr('data-next-id');
    currentPage = pagenumber;

    getStringKeys();

    if (parseInt(currentPage) > 0) {
        $('#previous').removeClass('disabled');
        $('#previous').attr('data-prev-id', parseInt(currentPage) - 1);
    }

    /* Check if radio or checkbox is checked */
    let isChecked = false;
    $('div.card-box-question:visible').find("input[type='checkbox']:checked").each(function(ind, ele) {
        if ($(ele).is(':checked')) {
            checkCounter++;
            selectedAnswer.push($.trim($(ele).attr('id')));
            attrName = $(ele).attr('name');
            isChecked = true;
        }
    });

    $('div.card-box-question:visible').find("input[type='radio']:checked").each(function(ind, ele) {
        if ($(ele).is(':checked')) {
            checkCounter++;
            selectedAnswer.push($.trim($(ele).attr('id')));
            attrName = $(ele).attr('name');
            isChecked = true;
        }
    });

    if (isChecked == true) {
        isChecked = false;
        let ans_res = [];
        $.each(selectedAnswer, function(i, selected_subarray) {
            if ($.inArray(selected_subarray, answerKeys[(attrName - 1)]) !== -1) {
                ans_res.push("true");
            } else {
                ans_res.push("false");
            }
        });

        if ((answerKeys[(attrName - 1)].length == ans_res.length) && ($.inArray("false", ans_res) == -1)) {
            correctAnswer = true
        } else {
            correctAnswer = false;
        }

        summaryAnswerResp.push(correctAnswer);

        $.each(answerKeys[(attrName - 1)], function(ii, subarr) {
            correctAnsArr.push($.trim($('#' + subarr).text()));
        });

        let correct_value = correctAnsArr.join();
        nextButtonName();
        if (actionInstance.customProperties[3].value == 'Yes') {

            if ($(this).find('span').attr('class') == 'check-key') {
                if (correctAnswer == true) {
                    $('div.card-box-question:visible').find('.result-status').html(`<span class="text-success semi-bold">${correctKey}</span>`);

                    $('input[type="radio"]:visible, input[type="checkbox"]:visible').each(function(optindex, opt) {
                        if ($(opt).is(':checked')) {
                            let optId = $(opt).attr('id');
                            $(opt).parents('.card-box').addClass('alert-success');
                            $(`div#${optId}`).find('div.pr--32.text-justify.check-in-div').append(`
                                <i class="success-with-img"> 
                                    <svg version="1.1" id="Layer_1" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" xml:space="preserve">
                                        <rect x="22.695" y="-6" fill="none" width="16" height="16"></rect>
                                        <path id="Path_594" d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005 c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z "></path>
                                    </svg> 
                                </i>`);
                        }
                        $(opt).parents("div.card-box").addClass('disabled');
                    });
                } else {
                    $('div.card-box-question:visible').find('.result-status').html(`<span class="text-danger semi-bold">${incorrectKey}</span>`);

                    $('input[type="radio"]:visible, input[type="checkbox"]:visible').each(function(optindex, opt) {
                        $(opt).parents("div.card-box").addClass('disabled');
                        let optval = $(opt).attr('id');
                        let ansKey = [];
                        if (answerKeys[(attrName - 1)].indexOf(',') > -1) {
                            ansKey = answerKeys[(attrName - 1)].split(',');
                        } else {
                            ansKey = answerKeys[(attrName - 1)];
                        }
                        console.log(`${ansKey}).includes(${optval})`)
                        console.log(`${ansKey}`)
                        console.log(`${optval}`)
                        if ($(opt).is(':checked') && ansKey.includes(optval)) {
                            if ($(opt).parents('label.selector-inp').length > 0) {
                                $(opt).parents('label.selector-inp').find('div.check-in-div').append(`
                                    <i class="success-with-img"> 
                                        <svg version="1.1 " id="Layer_1 " x="0px " y="0px " width="16px " height="16px " viewBox="0 0 16 16 " xml:space="preserve ">
                                            <rect x="22.695 " y="-6 " fill="none " width="16 " height="16 "></rect>
                                            <path id="Path_594 " d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005 c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z "></path>
                                        </svg> 
                                    </i>`);
                            } else {
                                $(opt).parents('label.d-block').find('div.check-in-div').append(`
                                    <i class="success-with-img"> 
                                        <svg version="1.1 " id="Layer_1 " x="0px " y="0px " width="16px " height="16px " viewBox="0 0 16 16 " xml:space="preserve ">
                                            <rect x="22.695 " y="-6 " fill="none " width="16 " height="16 "></rect>
                                            <path id="Path_594 " d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005 c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z "></path>
                                        </svg> 
                                    </i>`);
                            }
                            // $(opt).parents('.card-box').addClass('alert-success');
                        } else if ($(opt).is(':checked') && ansKey.includes(optval) == false) {
                            $(opt).parents('.card-box').addClass('alert-danger');
                        } else if (ansKey.includes(optval)) {
                            console.log('correct not selected');
                            // $(opt).parents('.card-box').addClass('alert-success');
                            if ($(opt).parents('label.selector-inp').length > 0) {
                                $(opt).parents('label.selector-inp').find('div.check-in-div').append(`
                                    <i class="success-with-img"> 
                                        <svg version="1.1 " id="Layer_1 " x="0px " y="0px " width="16px " height="16px " viewBox="0 0 16 16 " xml:space="preserve ">
                                            <rect x="22.695 " y="-6 " fill="none " width="16 " height="16 "></rect>
                                            <path id="Path_594 " d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005 c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z "></path>
                                        </svg> 
                                    </i>`);
                            } else {
                                $(opt).parents('label.d-block').find('div.check-in-div').append(`
                                    <i class="success-with-img"> 
                                        <svg version="1.1 " id="Layer_1 " x="0px " y="0px " width="16px " height="16px " viewBox="0 0 16 16 " xml:space="preserve ">
                                            <rect x="22.695 " y="-6 " fill="none " width="16 " height="16 "></rect>
                                            <path id="Path_594 " d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005 c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z "></path>
                                        </svg> 
                                    </i>`);
                            }
                        }
                    });
                }
                $('.check-key').addClass('next-key');
                $('.check-key').removeClass('check-key');
            } else {
                $root.find('.card-box-question').hide();
                if ((parseInt(currentPage) == $root.find('div.card-box-question').length) && (parseInt(currentPage)) < maxQuestionCount) {
                    createQuestionView();
                } else if (parseInt(currentPage) == maxQuestionCount) {
                    /*  Submit your question  */
                    let addDataRowRequest = ActionHelper.addDataRow(
                        getDataRow(contextActionId)
                    );
                    ActionHelper
                        .executeApi(addDataRowRequest)
                        .then(function(batchResponse) {
                            console.info("BatchResponse: " + JSON.stringify(batchResponse));
                            summarySection();
                        })
                        /* .catch(function(error) {
                            console.log("Error: " + JSON.stringify(error));
                        }) */
                    ;

                } else {
                    $('#previous').attr('data-prev-id', (parseInt(currentPage) - 1));
                    Localizer.getString('xofy', parseInt(currentPage) + 1, maxQuestionCount).then(function(result) {
                        $('#xofy').text(result);
                        nextButtonName();
                        console.log('nextButtonName:')
                    });
                    $('#check').attr('data-next-id', (parseInt(currentPage) + 1));
                    $('#next').attr('data-next-id', (parseInt(currentPage) + 1));
                    $root.find('div.card-box-question:nth-child(' + (parseInt(currentPage) + 1) + ')').show();

                    if ($('div.card-box-question:nth-child(' + (parseInt(currentPage) + 1 + ')')).find('.card-box.disabled:first').length == 0) {
                        // $('.section-1-footer').find('#next').attr('id', 'check');
                        $('.section-1-footer').find('.next-key').addClass('check-key');
                        $('.section-1-footer').find('.next-key').removeClass('next-key');
                        $('.section-1-footer').find('.check-key').text(checkKey);
                    }
                    $('#previous').removeClass('disabled');
                }
            }

            if (currentPage >= maxQuestionCount) {
                $('#next').removeClass('disabled')
            }

        } else {
            $root.find('.card-box-question').hide();

            if ((parseInt(currentPage) == $root.find('div.card-box-question').length) && (parseInt(currentPage)) < maxQuestionCount) {
                createQuestionView();
            } else if (parseInt(currentPage) == maxQuestionCount) {
                /*  Submit your question  */
                let addDataRowRequest = ActionHelper.addDataRow(
                    getDataRow(contextActionId)
                );
                ActionHelper
                    .executeApi(addDataRowRequest)
                    .then(function(batchResponse) {
                        console.info("BatchResponse: " + JSON.stringify(batchResponse));
                        summarySection();
                    })
                    .catch(function(error) {
                        console.log("Error: " + JSON.stringify(error));
                    });
            } else {
                $root.find('.card-box-question:nth-child(' + (parseInt(currentPage) + 1) + ')').show();
                $('#previous').attr('data-prev-id', (parseInt(currentPage) - 1));
                Localizer.getString('xofy', parseInt(currentPage) + 1, maxQuestionCount).then(function(result) {
                    $('#xofy').text(result);
                    console.log('nextButtonName1');
                    nextButtonName();
                });
                $('#check').attr('data-next-id', (parseInt(currentPage) + 1));
                $('#next').attr('data-next-id', (parseInt(currentPage) + 1));
                $('#previous').removeClass('disabled');
                if ($('div.card-box-question:nth-child(' + (parseInt(currentPage) + 1 + ')')).find('.card-box.disabled:first').length == 0) {
                    // $('.section-1-footer').find('#next').attr('id', 'check');
                    $('.section-1-footer').find('.next-key').addClass('check-key');
                    $('.section-1-footer').find('.next-key').removeClass('next-key');
                    $('.section-1-footer').find('.check-key').text(checkKey);
                }

            }

            if (currentPage >= maxQuestionCount) {
                $('#next').removeClass('disabled')
            }
        }

    } else {
        $('.choice-required-err').remove();
        $('.card-box-question:visible').append(`<p class="mt--32 text-danger choice-required-err"><font>${choiceAnyChoiceKey}</font></p>`);


        /* $('#exampleModalCenter2').find('#exampleModalLongTitle').html(`<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve" class="gt gs mt--4"><g><g><g><path d="M507.113,428.415L287.215,47.541c-6.515-11.285-18.184-18.022-31.215-18.022c-13.031,0-24.7,6.737-31.215,18.022L4.887,428.415c-6.516,11.285-6.516,24.76,0,36.044c6.515,11.285,18.184,18.022,31.215,18.022h439.796c13.031,0,24.7-6.737,31.215-18.022C513.629,453.175,513.629,439.7,507.113,428.415z M481.101,449.441c-0.647,1.122-2.186,3.004-5.202,3.004H36.102c-3.018,0-4.556-1.881-5.202-3.004c-0.647-1.121-1.509-3.394,0-6.007L250.797,62.559c1.509-2.613,3.907-3.004,5.202-3.004c1.296,0,3.694,0.39,5.202,3.004L481.1,443.434C482.61,446.047,481.748,448.32,481.101,449.441z"/><rect x="240.987" y="166.095" width="30.037" height="160.197" /><circle cx="256.005" cy="376.354" r="20.025" /></g></g></g > <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg > <span class="note-key">${noteKey}</span>`);
        $('#exampleModalCenter2').find('.modal-body').html(`<label>${choiceAnyChoiceKey}<label>`);
        $('#exampleModalCenter2').find('.modal-footer').html(`<button type="button" class="btn btn-primary btn-sm" data-dismiss="modal">${continueKey}</button>`);
        $('#exampleModalCenter2').find('#save-changes').hide();
        $('#exampleModalCenter2').modal('show');

        $("#exampleModalCenter2").on("hidden.bs.modal", function() {
            $('#next').removeClass('disabled');
        }); */
    }
});

/**
 * @description On change radio or check box
 */
$(document).on("change", "input[type='radio'], input[type='checkbox']", function() {
    $(this).each(function(ind, opt) {
        if (actionInstance.customProperties[3].value == 'Yes' && $('div.card-box:visible').find("label.custom-radio").hasClass('disabled') !== "disabled") {
            if ($(opt).is(":checked")) {
                $('.choice-required-err').remove();
                $('.check-key').parents('button').attr('id', 'next');
                return false;
            } else {
                $('.choice-required-err').remove();
                $('.next-key').text(`${checkKey}`);
                $('.next-key').parents('button').attr('id', 'check');
                return false;
            }
        } else {
            if ($(opt).is(":checked")) {
                $('.choice-required-err').remove();
                $('.check-key').text(`${nextKey}`);
                $('.check-key').parents('button').attr('id', 'next');
                return false;
            }
        }
    })

});

/**
 * @description On click check button
 */
$(document).on("click", "#check", function() {
    $('.choice-required-err').remove();
    $('.card-box-question').append(`<p class="mt--32 text-danger choice-required-err"><font>${choiceAnyChoiceKey}</font></p>`);
    $([document.documentElement, document.body]).animate({
        scrollTop: $(".text-danger:first").offset().top - 200
    }, 2000);
});

/* Click event handles previous questions */
$(document).on("click", '#previous', function() {
    $('.check-key').addClass('next-key');
    $('.check-key').removeClass('check-key');
    $('.next-key').text(nextKey);
    $('#check').attr('id', 'next');
    $('.choice-required-err').remove();

    let pagenumber = $(this).attr('data-prev-id');
    currentPage = pagenumber;
    getStringKeys();

    $root.find('.card-box-question').hide();
    $root.find('.card-box-question:nth-child(' + (parseInt(currentPage) + 1) + ')').show();
    $('#previous').attr('data-prev-id', (parseInt(currentPage) - 1));
    $('#next').attr('data-next-id', (parseInt(currentPage) + 1));
    $('#check').attr('data-next-id', (parseInt(currentPage) + 1));
    Localizer.getString('xofy', parseInt(currentPage) + 1, maxQuestionCount).then(function(result) {
        $('#xofy').text(result);
        nextButtonName();
        console.log('nextButtonName3');
    });

    if (currentPage <= 0) {
        $('#previous').addClass('disabled');
    }


});

// *********************************************** HTML ELEMENT END***********************************************

// *********************************************** SUBMIT ACTION***********************************************

/* Method creates Summary page after finish quiz */
function summarySection() {
    getStringKeys();

    $root.find('.card-box-question').hide();

    $('#root').append(summary_section);
    let $mb16Div = $(`<div class="mb--16"></div>`);
    Localizer.getString('quiz_summary').then(function(result) {
        $mb16Div.prepend(`<h4>${result}</h4>`);
    });
    $('.summary-section').append($mb16Div);
    let $mb16Div2 = $(`<div class="mb--16"></div>`);
    $('.summary-section').append($mb16Div2);
    $('div.section-1').after(summary_footer);

    let $cardQuestionDiv = $(`<div class="card-box-quest"></div>`);
    $('.summary-section').append($cardQuestionDiv);

    /*  Check Show Correct Answer  */
    if (Object.keys(row).length > 0) {
        let correctAnswer = $.parseJSON(actionInstance.customProperties[5].value);
        let count = 0;
        let score = 0;
        $('#root').find('div.card-box-question').each(function(i, val) {
            let question = $(val).find('.question-title').text();
            let imageSrc = $(val).find('.question-template-image').attr('src');
            let answerIs = $(val).find('.result-status span').hasClass('text-danger') ? 'Incorrect' : 'Correct';
            let $dTablediv = $(`<div class="d-table mb--4 mt--16 pre-none"></div>`);
            $cardQuestionDiv.append($dTablediv);

            let $fontDiv = $(`<label class="font-12"></label>`);
            $dTablediv.append($fontDiv);
            let $questionNumberDiv = $(`<strong class="question-number-title semi-bold">
                                                <label class="font-12">
                                                    <span class="question-number">${questionKey} # ${i+1}</span>
                                                </label>
                                        </strong>`)
            $fontDiv.append($questionNumberDiv);
            let $blankDiv = $(`<div></div>`);
            $cardQuestionDiv.append($blankDiv);
            if (imageSrc.length > 0) {
                $blankDiv.prepend(`
                    <div class="quiz-updated-img cover-img max-min-220 mb--8">
                        <img src="${imageSrc}" class="image-responsive question-template-image">
                    </div>
                `);
            }
            $blankDiv.append(`
                        <div class="semi-bold font-14 mb--16 question-title">
                            <p class="text-justify">${question}</p>
                        </div>
                    `);

            let $optionSecDiv = $(`<div class="option-sec"></div>`);
            $blankDiv.append($optionSecDiv);

            if (answerIs == 'Correct') {
                /*  Answer is correct  */
                score = score + 1;
                Localizer.getString('correct').then(function(result) {
                    $dTablediv.append(`<label class="float-right result-status" id="status-${i}">
                            <span class="text-success semi-bold">${result}</span>
                        </label>`);
                });

                $(val).find('label.custom-radio, label.custom-check').each(function(opt_ind, opt_val) {
                    let $cardBoxDiv = $(`<div class="card-box card-bg card-border mb--8"></div>`);
                    $optionSecDiv.append($cardBoxDiv);
                    let opt_id = $(opt_val).find('input').attr('id');
                    let optImage = $(opt_val).find('.opt-image').attr('src');

                    if ($.inArray(opt_id, correctAnswer[count]) !== -1) {
                        if ($(opt_val).find('input').prop('checked') == true) {
                            if ($(opt_val).hasClass('custom-check')) {
                                $cardBoxDiv.append(`
                                    <div class="radio-section custom-check-outer selector-inp" id="${opt_id}" columnid="${opt_ind}">
                                        <label class="custom-check form-check-label d-block font-14">
                                            <span class="checkmark selected"></span>
                                            <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                <i class="success-with-img">
                                                    <svg version="1.1" id="Layer_1" x="0px" y="0px" width="16px"
                                                        height="16px" viewBox="0 0 16 16" xml:space="preserve">
                                                        <rect x="22.695" y="-6" fill="none" width="16" height="16">
                                                        </rect>
                                                        <path id="Path_594"
                                                            d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352
                                                            c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477
                                                            l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005
                                                            c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z">
                                                        </path>
                                                    </svg>
                                                </i>
                                            </div>
                                        </label>
                                    </div>
                                `);
                            } else {
                                $cardBoxDiv.append(`
                                    <div class="radio-section custom-radio-outer selector-inp" id="${opt_id}" columnid="${opt_ind}">
                                        <label class="custom-radio d-block font-14">
                                            <span class="radio-block selected"></span>
                                            <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                <i class="success-with-img">
                                                    <svg version="1.1" id="Layer_1" x="0px" y="0px" width="16px"
                                                        height="16px" viewBox="0 0 16 16" xml:space="preserve">
                                                        <rect x="22.695" y="-6" fill="none" width="16" height="16">
                                                        </rect>
                                                        <path id="Path_594"
                                                            d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352
                                                            c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477
                                                            l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005
                                                            c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z">
                                                        </path>
                                                    </svg>
                                                </i>
                                            </div>
                                        </label>
                                    </div>
                                `);
                            }
                            $cardBoxDiv.addClass('alert-success');
                        } else {
                            if ($(opt_val).hasClass('custom-check')) {
                                $cardBoxDiv.append(`
                                        <div class="radio-section custom-check-outer selector-inp" id="${opt_id}" columnid="${opt_ind}">
                                        <label class="custom-check form-check-label d-block font-14 cursor-pointer selector-inp">
                                            <span class="checkmark"></span>
                                            <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                <i class="success-with-img">
                                                    <svg version="1.1" id="Layer_1" x="0px" y="0px" width="16px"
                                                        height="16px" viewBox="0 0 16 16" xml:space="preserve">
                                                        <rect x="22.695" y="-6" fill="none" width="16" height="16">
                                                        </rect>
                                                        <path id="Path_594"
                                                            d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352
                                                            c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477
                                                            l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005
                                                            c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z">
                                                        </path>
                                                    </svg>
                                                </i>
                                            </div>
                                        </label>
                                    </div>
                                `);
                            } else {
                                $cardBoxDiv.append(`
                                        <div class="radio-section custom-radio-outer" id="${opt_id}" columnid="${opt_ind}">
                                        <label class="custom-radio d-block font-14 cursor-pointer selector-inp">
                                            <span class="radio-block"></span>
                                            <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                <i class="success-with-img">
                                                    <svg version="1.1" id="Layer_1" x="0px" y="0px" width="16px"
                                                        height="16px" viewBox="0 0 16 16" xml:space="preserve">
                                                        <rect x="22.695" y="-6" fill="none" width="16" height="16">
                                                        </rect>
                                                        <path id="Path_594"
                                                            d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352
                                                            c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477
                                                            l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005
                                                            c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z">
                                                        </path>
                                                    </svg>
                                                </i>
                                            </div>
                                        </label>
                                    </div>
                                `);
                            }
                        }
                    } else {
                        if ($(opt_val).find('input').prop('checked') == true) {
                            if ($(opt_val).hasClass('custom-check')) {
                                $cardBoxDiv.append(`
                                    <div class="radio-section custom-check-outer" id="${opt_id}" columnid="1">
                                        <label class="custom-check form-check-label d-block font-14 cursor-pointer selector-inp">
                                            <span class="checkmark"></span>
                                            <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}</div>
                                        </label>
                                    </div>
                                `);
                            } else {
                                $cardBoxDiv.append(`
                                    <div class="radio-section custom-radio-outer" id="${opt_id}" columnid="1">
                                        <label class="custom-radio d-block font-14 cursor-pointer selector-inp">
                                            <span class="radio-block"></span>
                                            <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}</div>
                                        </label>
                                    </div>
                                `);
                            }
                        } else {
                            if ($(opt_val).hasClass('custom-check')) {
                                $cardBoxDiv.append(`
                                    <div class="radio-section custom-check-outer selector-inp" id="${opt_id}" columnid="1">
                                        <label class="custom-check form-check-label d-block font-14 cursor-pointer selector-inp">
                                            <span class="checkmark"></span>
                                            <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}</div>
                                        </label>
                                    </div>
                                `);
                            } else {
                                $cardBoxDiv.append(`
                                    <div class="radio-section custom-radio-outer" id="${opt_id}" columnid="1">
                                        <label class="custom-radio d-block font-14 cursor-pointer selector-inp">
                                            <span class="radio-block"></span>
                                            <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}</div>
                                        </label>
                                    </div>
                                `);
                            }
                        }
                    }
                });

            } else {
                /* Answer is Incorrect */
                Localizer.getString('incorrect').then(function(result) {
                    $dTablediv.append(`<label class="float-right result-status" id="status-${i}">
                            <span class="text-danger semi-bold">${result}</span>
                        </label>`);
                });
                $(val).find('label.custom-radio, label.custom-check').each(function(opt_ind, opt_val) {
                    let $cardBoxDiv = $(`<div class="card-box card-bg card-border mb--8"></div>`);
                    $optionSecDiv.append($cardBoxDiv);
                    let opt_id = $(opt_val).find('input').attr('id');
                    if ($.inArray(opt_id, correctAnswer[count]) !== -1) {
                        if ($(opt_val).find('input').prop('checked') == true) {
                            if ($(opt_val).hasClass('custom-check')) {
                                /* Checkbox */
                                $cardBoxDiv.append(`
                                        <div class="radio-section custom-check-outer selector-inp" id="${opt_id}" columnid="${opt_ind}">
                                            <label class="custom-check form-check-label d-block font-14">
                                                <span class="checkmark selected"></span>
                                                <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                    <i class="success-with-img">
                                                        <svg version="1.1 " id="Layer_1 " x="0px " y="0px "
                                                            width="16px " height="16px " viewBox="0 0 16 16 "
                                                            xml:space="preserve ">
                                                            <rect x="22.695 " y="-6 " fill="none " width="16 "
                                                                height="16 "></rect>
                                                            <path id="Path_594 "
                                                                d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005 c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z ">
                                                            </path>
                                                        </svg>
                                                    </i>
                                                </div>
                                            </label>
                                        </div>
                                    `);
                            } else {
                                /* Radio */
                                $cardBoxDiv.append(`
                                        <div class="radio-section custom-radio-outer" id="${opt_id}" columnid="${opt_ind}">
                                            <label class="custom-radio d-block font-14 cursor-pointer selector-inp">
                                                <span class="radio-block selected"></span>
                                                <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                    <i class="success-with-img">
                                                        <svg version="1.1 " id="Layer_1 " x="0px " y="0px "
                                                            width="16px " height="16px " viewBox="0 0 16 16 "
                                                            xml:space="preserve ">
                                                            <rect x="22.695 " y="-6 " fill="none " width="16 "
                                                                height="16 "></rect>
                                                            <path id="Path_594 "
                                                                d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005 c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z ">
                                                            </path>
                                                        </svg>
                                                    </i>
                                                </div>
                                            </label>
                                        </div>
                                    `);
                            }
                            $cardBoxDiv.addClass('alert-success');
                        } else {
                            if ($(opt_val).hasClass('custom-check')) {
                                /* checkbox */
                                $cardBoxDiv.append(`
                                    <div class="radio-section custom-check-outer selector-inp" id="${opt_id}" columnid="${opt_ind}">
                                        <label class="custom-check form-check-label d-block font-14">
                                            <span class="checkmark"></span>
                                            <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                <i class="success-with-img">
                                                    <svg version="1.1 " id="Layer_1 " x="0px " y="0px "
                                                        width="16px " height="16px " viewBox="0 0 16 16 "
                                                        xml:space="preserve ">
                                                        <rect x="22.695 " y="-6 " fill="none " width="16 "
                                                            height="16 "></rect>
                                                        <path id="Path_594 "
                                                            d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005 c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z ">
                                                        </path>
                                                    </svg>
                                                </i>
                                            </div>
                                        </label>
                                    </div>
                                `);

                            } else {
                                /* radio */
                                $cardBoxDiv.append(`
                                    <div class="radio-section custom-radio-outer" id="${opt_id}" columnid="${opt_ind}">
                                        <label class="custom-radio d-block font-14 cursor-pointer selector-inp">
                                            <span class="radio-block"></span>
                                            <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                <i class="success-with-img">
                                                    <svg version="1.1 " id="Layer_1 " x="0px " y="0px "
                                                        width="16px " height="16px " viewBox="0 0 16 16 "
                                                        xml:space="preserve ">
                                                        <rect x="22.695 " y="-6 " fill="none " width="16 "
                                                            height="16 "></rect>
                                                        <path id="Path_594 "
                                                            d="M14.497,3.377c0.133-0.001,0.26,0.052,0.352,0.148c0.096,0.092,0.15,0.219,0.148,0.352 c0.002,0.133-0.053,0.26-0.148,0.352l-8.25,8.248c-0.189,0.193-0.5,0.196-0.693,0.006C5.904,12.48,5.902,12.479,5.9,12.477 l-4.75-4.75c-0.193-0.19-0.196-0.501-0.006-0.694C1.146,7.031,1.148,7.029,1.15,7.027c0.189-0.193,0.5-0.196,0.693-0.005 c0.002,0.001,0.004,0.003,0.006,0.005l4.4,4.391l7.9-7.891C14.239,3.432,14.365,3.377,14.497,3.377z ">
                                                        </path>
                                                    </svg>
                                                </i>
                                            </div>
                                        </label>
                                    </div>
                                `);
                            }
                        }
                    } else {
                        if ($(opt_val).find('input').prop('checked') == true) {

                            $cardBoxDiv.addClass('alert-danger');
                            if ($(opt_val).hasClass('custom-check')) {
                                /* checkbox */
                                $cardBoxDiv.append(`
                                        <div class="radio-section custom-check-outer selector-inp" id="${opt_ind}" columnid="${opt_id}">
                                            <label class="custom-check form-check-label d-block font-14">
                                                <span class="checkmark selected"></span>
                                                <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                </div>
                                            </label>
                                        </div>
                                    `);
                            } else {
                                $cardBoxDiv.append(`
                                        <div class="radio-section custom-radio-outer" id="${opt_ind}" columnid="${opt_id}">
                                            <label class="custom-radio d-block font-14 cursor-pointer selector-inp">
                                                <span class="radio-block selected"></span>
                                                <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                </div>
                                            </label>
                                        </div>
                                    `);
                            }
                        } else {
                            if ($(opt_val).hasClass('custom-check')) {
                                /* checkbox */
                                $cardBoxDiv.append(`
                                        <div class="radio-section custom-check-outer selector-inp" id="${opt_ind}" columnid="${opt_id}">
                                            <label class="custom-check form-check-label d-block font-14">
                                                <span class="checkmark selected"></span>
                                                <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                </div>
                                            </label>
                                        </div>
                                    `);
                            } else {
                                /* radio */
                                $cardBoxDiv.append(`
                                        <div class="radio-section custom-radio-outer" id="${opt_ind}" columnid="${opt_id}">
                                            <label class="custom-radio d-block font-14 cursor-pointer selector-inp">
                                                <span class="radio-block"></span>
                                                <div class="pr--32 text-justify check-in-div">${$(opt_val).text()}
                                                </div>
                                            </label>
                                        </div>
                                    `);
                            }
                        }
                    }
                    /* Option image */
                    if ($(opt_val).find('.option-image-section').length > 0 && $(opt_val).find('.opt-image').attr('src').length > 0) {
                        let $imageSection = $(opt_val).find('custom-radio .option-image-section').clone();
                        $cardBoxDiv.find('.custom-radio').prepend($imageSection);
                    }
                });
            }
            count++;
        });
        let score_is = Math.round((score / correctAnswer.length) * 100);
        Localizer.getString('score', ':').then(function(result) {
            $($mb16Div2).append(`
                        <label>
                            <strong class="semi-bold">${result} </strong>${score_is}%
                        </label>
                        <hr>
                    `);
        });
    }
}

/* Click event for finally close the quiz */
$(document).on('click', '.submit-key', function() {
    let closeViewRequest = ActionHelper.closeView();

    ActionHelper
        .executeApi(closeViewRequest)
        .then(function(batchResponse) {
            console.info("BatchResponse: " + JSON.stringify(batchResponse));
        })
        .catch(function(error) {
            console.error("Error: " + JSON.stringify(error));
        });
});

/* Method for handle radio click event and returns saved object when user respond to quiz */
function radiobuttonclick() {
    let data = [];
    row = {};
    $.each($("input[type='checkbox']:checked"), function(ind, v) {
        let col = $(this).parents("div.radio-section").attr("columnid");
        data.push($(this).attr("id"));

        if (!row[col]) row[col] = [];
        row[col] = JSON.stringify(data);
    });

    $.each($("input[type='radio']:checked"), function() {
        let col = $(this).parents("div.radio-section").attr("columnid");

        if (!row[col]) row[col] = [];
        row[col] = $(this).attr("id");
    });
}

/* Method to generate GUID */
function generateGUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        let r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/*
 *@desc Method for fetching the repomse data from creation view 
 *@param actionId contains context action id
 */
function getDataRow(actionId) {
    let data = {
        id: generateGUID(),
        actionId: actionId,
        dataTableId: "TestDataSet",
        columnValues: row,
    };
    return data;
}

// *********************************************** SUBMIT ACTION END***********************************************
/* Footer Section HTML */
let footer_section = `<div class="footer" style="display:none;">
        <div class="footer-padd bt">
            <div class="container ">
                <div class="row">

                    <div class="col-12 text-right">
                        <button class="btn btn-primary btn-sm float-right submit-form">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

/* Modal Section for handle error and messges HTML */
let modal_section = `<div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog"
        aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title app-black-color" id="exampleModalLongTitle">Modal title</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="modal-body app-black-color">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Back</button>
                    <button type="button" class="btn btn-primary btn-sm" id="save-changes">Save changes</button>
                </div>
            </div>
        </div>
    </div>`;

/* Modal Section for handle correct and incorrect result HTML */
let modal_section2 = `<div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title app-black-color" id="exampleModalLongTitle">Modal title</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            <div class="modal-body app-black-color">
                ...
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary btn-sm" data-dismiss="modal">Back</button>
                <button type="button" class="btn btn-primary btn-sm" id="save-changes">Save changes</button>
            </div>
        </div>
    </div>
</div>`;

/* HTML section for landing page */
let text_section1 = `<div class="text-counter-ques">
                        <div class="">
                            <div class="hover-btn ">
                                <!-- <label><strong><span class="training-type question-key">${questionKey}</span></strong> </label> -->
                                <span class="float-right result"></span>
                            </div>
                            <div class="clearfix"></div>
                        </div>
                        <p class="mb--16 text-description semi-bold">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type
                            specimen book.</p>
                    </div>`;

/* HTML Footer section for start quiz */
let footer_section1 = `<div class="footer section-1-footer">
                            <div class="footer-padd bt">
                                <div class="container ">
                                    <div class="row">
                                        <div class="col-4"> </div>
                                        <div class="col-4 text-center"> </div>
                                        <div class="col-4 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right" id="start"> ${startKey}</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

/* HTML section for question area */
let question_section = `<div class="card-box-question">
                            <div class="d-table mb--8 pre-none">
                                <label class="font-12">
                                    <strong class="question-number-title semi-bold">1. ksklaskdl</strong>
                                </label>
                                <label class="float-right result-status" id="status-1">
                                </label>
                            </div>
                            <div>
                                <div class="quiz-updated-img cover-img max-min-220 mb--8" style="display: none">
                                    <img src="" class="image-responsive question-template-image" style="display: none" />
                                </div>
                                <div class="semi-bold font-14 mb--16 question-title"><p class="text-justify">How many days in a week?</p></div>
                            </div>
                            <div class="option-sec">
                                
                            </div>
                        </div>`;

/* HTML section for footer quiz area with pagination */
let pagination_footer_section = `<div class="footer section-1-footer">
            <div class="footer-padd bt">
                <div class="container ">
                    <div class="row">
                        <div class="col-4"> 
                            <button type="button" class="tpt-btn disabled" id="previous"  data-prev-id="0"> 
                                <svg role="presentation" focusable="false" viewBox="8 8 16 16" class="back-btn">
                                    <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z">
                                    </path>
                                    <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z">
                                    </path>
                                </svg> <span class="prev-key">${prevKey}/span>
                            </button>
                        </div>
                        <div class="col-4 text-center" id="xofy"> 1 of 4</div>
                        <div class="col-4 text-right"> 
                            <button type="button" class="tpt-btn pull-right" id="check" data-next-id="1"> <span class="check-key">${checkKey}</span>
                                <svg role="presentation" focusable="false" viewBox="8 8 16 16 " class="next-btn">
                                    <path class="ui-icon__outline gr" d="M16.38 20.85l7-7a.485.485 0 0 0 0-.7.485.485 0 0 0-.7 0l-6.65 6.64-6.65-6.64a.485.485 0 0 0-.7 0 .485.485 0 0 0 0 .7l7 7c.1.1.21.15.35.15.14 0 .25-.05.35-.15z"></path>
                                    <path class="ui-icon__filled" d="M16.74 21.21l7-7c.19-.19.29-.43.29-.71 0-.14-.03-.26-.08-.38-.06-.12-.13-.23-.22-.32s-.2-.17-.32-.22a.995.995 0 0 0-.38-.08c-.13 0-.26.02-.39.07a.85.85 0 0 0-.32.21l-6.29 6.3-6.29-6.3a.988.988 0 0 0-.32-.21 1.036 1.036 0 0 0-.77.01c-.12.06-.23.13-.32.22s-.17.2-.22.32c-.05.12-.08.24-.08.38 0 .28.1.52.29.71l7 7c.19.19.43.29.71.29.28 0 .52-.1.71-.29z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

/* HTML section for summary */
let summary_section = `<div class="summary-section"></div>`;

/* HTML section for summary footer */
let summary_footer = `<div class="footer section-1-footer">
                            <div class="footer-padd bt">
                                <div class="container ">
                                    <div class="row">
                                        <div class="col-4"> </div>
                                        <div class="col-4 text-center"> </div>
                                        <div class="col-4 text-right"> <button type="button" class="btn btn-primary btn-sm pull-right submit-key" id="submit"> ${submitKey}</button></div>
                                    </div>
                                </div>
                            </div>
                        </div>`;