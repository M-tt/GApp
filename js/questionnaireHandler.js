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

results.push(new Result("rFreiberufler", "Freiberufler", "yey"));
results.push(new Result("rGmbH", "GmbH", "yeey"));

questions.forEach(q => q.fetchAnswers());
answers.forEach(a => a.fetchNextItem());