import fs from 'node:fs';

const readFileLines = filename =>
    fs
      .readFileSync(filename)
      .toString('UTF8')
      .split('\r\n');


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

    console.log(plainQuestions);

    plainQuestions.forEach(el => {
        if (el.toUpperCase().includes("БИЛЕТ")){
            if (qq.length > 0){
                questionList.push(new Ticket(ticket, qq));
                ticket = el.substring(5);
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

console.log(qlist('questions1.txt'));
// import LineReader from 'line-reader';

// let ticket, question;
// let i = 0; // номер вопроса в билете
// // let Q = []; // массив вопросов

// function Ticket(t, q) {
//     return {
//         Ticket: t,
//         Questions: q,
//     };
// }

// function getQuestions() {
//     let Q = []; // массив вопросов

//     var Questions = [];
//     var qq;

//     LineReader.eachLine("questions1.txt", (line, last) => {
//             if (line.toUpperCase().includes("БИЛЕТ")) {
//                 ticket = line.trim().substring(5);
//                 if (typeof qq !== 'undefined') {
//                     qq.Questions = Questions;
//                     Q.push(qq);
//                     qq = new Ticket(ticket);
//                     Questions = [];
//                 }

//                 else
//                     qq = new Ticket(ticket);
//             }
//             else {
//                 Questions.push(line.trim());
//             }
//             if (last) {
//                 qq.Questions = Questions;
//                 Q.push(qq);
                
//                 // return Q;
//             }
//         });
//     return Q;
// }


// let B=getQuestions();
// console.log(B);