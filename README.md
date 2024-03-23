SBA-02: JavaScript Fundamentals
  I used an array of objects named 'data' to parse the data from LearnerSubmissions, Assignment Group, and CourseInfo into the necessary components.
  I then created a function 'formatData' to format the data in 'data' so that 'result' would output with the expected result.
  I used multiple helper functions along the way to calculate, validize, and format elements. 
    Ex: isValueIncluded checks if a learner id is already pushed to 'data'.
        calcAvg calculates the avg of all the learner's scores.
        calcPenalty calculates if a submission requires a penalty to it's score.
        formatNumber formats the assignment's score and avg so that only 3 significant digits are shown.
        formatData formats the data in 'data' to represent the expected output.
