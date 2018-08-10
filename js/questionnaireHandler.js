
let cardTemplate =
    '<div id="{$id}" class="mdl-card mdl-shadow--3dp">' +
    '<div class="mdl-card__title">' +
    '<h2 class="mdl-card__title-text">{$title}</h2>' +
    '</div>' +
    '<div class="mdl-card__supporting-text">' +
    '{$text}' +
    '</div>' +
    '<div class="mdl-card__actions mdl-card--border">' +
    '<!--{$answer}-->' +
    '</div>' +
    '</div>' +
    '<div>&nbsp;</div>';

let buttonTemplate =
    '<div id="{$id}" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored" onclick="questionnaireNext(\'{$id}\')">' +
    '{$text}' +
    '</div>' +
    '<!--{$answer}-->';

function questionnaireNext(answerId) {
    //maybe clean up startup "sequence" for questionnaire

    let givenAnswer = answers.find(a => a.id === answerId);
    let qContainer = $("#questionnaireQuestionContainer");

    if (givenAnswer.nextItem instanceof Question) {
        //generate new question card
        let next = givenAnswer.nextItem;

        let qTemplate = cardTemplate;
        qTemplate = qTemplate.replace(/{\$id}/g, next.id);
        qTemplate = qTemplate.replace(/{\$title}/g, next.title);
        qTemplate = qTemplate.replace(/{\$text}/g, next.text);

        for (let i in next.answers) {
            let answer = next.answers[i];

            let aTemplate = buttonTemplate;

            aTemplate = aTemplate.replace(/{\$id}/g, answer.id);
            aTemplate = aTemplate.replace(/{\$text}/g, answer.text);

            qTemplate = qTemplate.replace(/<!--{\$answer}-->/g, aTemplate);
        }

        qTemplate = qTemplate.replace(/<!--{\$answer}-->/g, "");

        qContainer.append(qTemplate);

    } else {
        //generate result card
        let result = givenAnswer.nextItem;

        let rTemplate = cardTemplate;

        rTemplate = rTemplate.replace(/{\$id}/g, result.id);
        rTemplate = rTemplate.replace(/{\$title}/g, result.rechtsform);
        rTemplate = rTemplate.replace(/{\$text}/g, result.text);

        let bTemplate = buttonTemplate;

        bTemplate = bTemplate.replace(/questionnaireNext\('{\$id}'\)/g, "switchToView('startView')");
        bTemplate = bTemplate.replace(/{\$id}/g, "resultOK");
        bTemplate = bTemplate.replace(/{\$text}/g, "OK");
        rTemplate = rTemplate.replace(/<!--{\$answer}-->/g, bTemplate);
        rTemplate = rTemplate.replace(/<!--{\$answer}-->/g, "");

        qContainer.append(rTemplate);
    }
}

var questions = [];
var answers = [];
var results = [];

class Question {
    constructor(id, answerIds, title, text) {
        this.id = id;
        this.answerIds = answerIds;
        this.title = title;
        this.text = text;
        this.answers = [];
    }

    fetchAnswers() {
        for (let i in this.answerIds) {
            // noinspection JSUnfilteredForInLoop cause no
            let answerId = this.answerIds[i];
            let answer = answers.find((a => a.id === answerId));
            if (answer) {
                this.answers.push(answer);
            } else {
                console.error("could not find answer with id " + answerId);
            }
        }
    }
}

class Answer {
    constructor(id, nextItemId, text) {
        this.id = id;
        this.nextitemId = nextItemId;
        this.text = text;
        this.nextItem = {};
    }

    fetchNextItem() {
        let nextItemId = this.nextitemId;
        let nextItem = questions.find(q => q.id === nextItemId);
        if (!nextItem) nextItem = results.find(q => q.id === nextItemId);

        if (nextItem) {
            this.nextItem = nextItem;
        } else {
            console.error("could not find question or result with id " + nextItemId);
        }
    }
}

class Result {
    constructor(id, rechtsform, text) {
        this.id = id;
        this.rechtsform = rechtsform;
        this.text = text;
    }
}

questions.push(new Question("qStart", ["aStart1", "aStart2"], "Gründungsmitglieder", "Gründest du alleine oder hast du Mitgründer?"));
questions.push(new Question("qSoloHaftung", ["aSoloPrivat", "aSoloFirma"], "Haftung", "Für den Fall, dass deine Idee nicht funktionieren sollte oder finanzielle Probleme auftreten (wovon wir nicht ausgehen ;)), ist von der Rechtsform abghängig, ob mit dem persönlichen oder dem Gesellschaftsvermögen gehaftet wird.."));
questions.push(new Question("qTeamHaftung", ["aSoloPrivat", "aSoloFirma"], "Haftung", "Für den Fall, dass eure Idee nicht funktionieren sollte oder finanzielle Probleme auftreten (wovon wir nicht ausgehen ;)), ist von der Rechtsform abghängig, ob mit dem persönlichen oder dem Gesellschaftsvermögen gehaftet wird."));
//questions.push(new Question("", "", ""));

answers.push(new Answer("aStart1", "qSoloHaftung", "Alleine"));
answers.push(new Answer("aStart2", "qTeamHaftung", "2 oder Mehr"));
answers.push(new Answer("aSoloPrivat", "rFreiberufler", "Persönlich"));
answers.push(new Answer("aSoloFirma", "rGmbH", "Gesellschaftsvermögen"));
//answers.push(new Answer("", "", ""));

results.push(new Result("rFreiberufler", "Freiberufler", "Du bist ein Freiberufler und darfst legal Steuern hinterziehen! yey!"));
results.push(new Result("rGmbH", "GmbH", "Du bist eine GmbH! Nach mir die Sintflut! yey!"));
// results.push(new Result("", "", ""));

questions.forEach(q => q.fetchAnswers());
answers.forEach(a => a.fetchNextItem());