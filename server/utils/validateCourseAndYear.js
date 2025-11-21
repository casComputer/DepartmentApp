import { YEAR, COURSES } from "../constants/YearAndCourse.js";

export const validateCourseAndYear = (course, year) => {
    const isValidCourse = COURSES.some(c=> c.id===course);
    const isValidYear = YEAR.some(y=> y.id === year);

    return isValidYear && isValidCourse;
};

 