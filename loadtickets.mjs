import fs from 'node:fs';

var isWin = process.platform === "win32";

const readFileLines = filename =>
    fs
      .readFileSync(filename)
      .toString('UTF8')
      .split(isWin?'\r\n':'\n');


let questionList = [];
function Ticket(t, q) {
    return {
        Ticket: t,
        Questions: q,
    };
}

export let qlist = (filename) => {
    let ticket;
    let qq=[];
    let plainQuestions=readFileLines(filename);

// console.log(plainQuestions);

    plainQuestions.forEach(el => {
        if (el.toUpperCase().includes("БИЛЕТ")){
            if (qq.length > 0){
                questionList.push(new Ticket(ticket, qq));
                ticket = Number(el.substring(5));
                qq=[];
            }
            else
                ticket = el.substring(5);
        }
        else{
            qq.push(el);
        }
    });
    questionList.push(new Ticket(ticket, qq)); // последний объект из файла
    return questionList;
}

// console.log(qlist('questions1.txt'));