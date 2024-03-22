function learnerData() {};
learnerData.prototype.setID = function(student_id) {
    this.id = student_id;
};
learnerData.prototype.setAvg = function() {
    this.avg = calcAvg();
}
learnerData.prototype.setAssignments = function(assignments) {
    this.assignments = assignments;
}

learnerData.prototype.calcAvg = function() {
    let avg = 0;
    for (let i = 0; i < this.assignments.length; i++) {
        avg += this.assignments[i];
    }
    avg /= this.assignments.length;
    return avg;
}

function isValueIncluded(array, value) {
    for (let i = 0; i < array.length; i++) {
        if (array[i].id === value) {
            return true;
        } else { //else statement not necessary. Was used to fulfill requirement of SBA
            continue; //used to fullfil requirement
        }
    }
    return false;
}

const calcPenalty = (score, points_possible, dueDate, subDate) => {
    let finalScore;
    let percentage;
    if (subDate > dueDate) {
        percentage = points_possible * .10;
        finalScore = score - percentage;
        return finalScore;
    }
    return score;
}

const getLearnerDataHelper = (course, ag, submissions, myObj) => {
    let assigns = [];
    console.log(myObj.id);
    for (let i = 0; i < submissions.length; i++) {
        if (myObj.id === submissions[i].learner_id) {
            let assign = {};
            for (let j = 0; j < ag.assignments.length; j++) {
                if (ag.assignments[j].id === submissions[i].assignment_id) {
                    let dueDate = new Date(ag.assignments[j].due_at);
                    let subDate = new Date(submissions[i].submission.submitted_at);
                    let currentDate = new Date();
                    if (dueDate <= currentDate) {
                        assign.assignment_id = submissions[i].assignment_id;
                        assign.score = calcPenalty(submissions[i].submission.score, ag.assignments[j].points_possible, dueDate, subDate);
                        assign.points_possible = ag.assignments[j].points_possible;
                    }
                } else {
                    continue;
                }
            }
            if (Object.keys(assign).length !== 0) assigns.push(assign);
        } else {
            continue;
        }
    }
    return assigns;
}

// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [{
            id: 1,
            name: "Declare a Variable",
            due_at: "2023-01-25",
            points_possible: 50
        },
        {
            id: 2,
            name: "Write a Function",
            due_at: "2023-02-27",
            points_possible: 150
        },
        {
            id: 3,
            name: "Code the World",
            due_at: "3156-11-15",
            points_possible: 500
        }
    ]
};

// The provided learner submission data.
const LearnerSubmissions = [{
        learner_id: 125,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-25",
            score: 47
        }
    },
    {
        learner_id: 125,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-02-12",
            score: 150
        }
    },
    {
        learner_id: 125,
        assignment_id: 3,
        submission: {
            submitted_at: "2023-01-25",
            score: 400
        }
    },
    {
        learner_id: 132,
        assignment_id: 1,
        submission: {
            submitted_at: "2023-01-24",
            score: 39
        }
    },
    {
        learner_id: 132,
        assignment_id: 2,
        submission: {
            submitted_at: "2023-03-07",
            score: 140
        }
    }
];

function getLearnerData(course, ag, submissions) {
    // here, we would process this data to achieve the desired result.
    /*const result = [{
            id: 125,
            avg: 0.985, // (47 + 150) / (50 + 150)
            1: 0.94, // 47 / 50
            2: 1.0 // 150 / 150
        },
        {
            id: 132,
            avg: 0.82, // (39 + 125) / (50 + 150)
            1: 0.78, // 39 / 50
            2: 0.833 // late: (140 - 15) / 150
        }
    ];*/
    const result = [];
    for (let i = 0; i < LearnerSubmissions.length; i++) {
        if (!isValueIncluded(result, LearnerSubmissions[i].learner_id)) {
            let myObj = new learnerData();
            myObj.setID(LearnerSubmissions[i].learner_id);
            myObj.setAssignments(getLearnerDataHelper(course, ag, submissions, myObj)); //to get the assignments and avg
            //console.log(getLearnerDataHelper(course, ag, submissions, myObj));
            result.push(myObj);
        } else { //else statement not necessary. Was used to fulfill requirement of SBA
            continue; //used to fullfil requirement
        }
    }
    return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
const util = require('util');
console.log(util.inspect(result, { depth: null }));

//console.log(result);