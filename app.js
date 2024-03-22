const calcAvg = (learnerData) => {
    let total_points = 0;
    let total_possible = 0;
    for (let i = 0; i < learnerData.assignments.length; i++) {
        total_points += learnerData.assignments[i].score;
        total_possible += learnerData.assignments[i].points_possible;
    }
    try {
        if (total_possible === 0) {
            throw new Error('Divison by zero error');
        }
        return total_points / total_possible;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

const isValueIncluded = (array, value) => {
    let i = 0;
    while (i < array.length) { //While loop used as per requirement of using two different types of loops. For loop is better here.
        if (array[i].id === value) {
            return true;
        }
        i++;
    }
    return false;
}

const calcPenalty = (score, points_possible, dueDate, subDate) => {
    let penalizedScore;
    let percentage;
    if (subDate > dueDate) {
        percentage = points_possible * .10;
        penalizedScore = score - percentage;
        return penalizedScore;
    }
    return score;
}

const getLearnerDataHelper = (course, ag, submissions, myObj) => {
    let assigns = [];
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

const formatData = (data, result) => {
    for (let i = 0; i < data.length; i++) {
        delete data.learnerData;
        const learner = data[i];
        for (let j = 0; j < learner.assignments.length; j++) {
            const assignment = learner.assignments[j];
            const assignmentKey = `${assignment.assignment_id}`;
            learner[assignmentKey] = assignment.score / assignment.points_possible;
        }
        // Now remove the 'assignments' property from the learner object
        delete learner.assignments;
        result.push(learner);
    }
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
    const data = [];
    for (let i = 0; i < LearnerSubmissions.length; i++) {
        if (!isValueIncluded(data, LearnerSubmissions[i].learner_id)) {
            let learnerData = {};
            learnerData.id = LearnerSubmissions[i].learner_id;
            learnerData.assignments = getLearnerDataHelper(course, ag, submissions, learnerData); //to get the assignments and avg
            learnerData.avg = learnerData.assignments.length > 0 ? calcAvg(learnerData) : 0;
            data.push(learnerData);
        } else { //else statement not necessary. Was used to fulfill requirement of SBA
            continue; //used to fullfil requirement
        }
    }

    formatData(data, result);
    return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
console.log(result);