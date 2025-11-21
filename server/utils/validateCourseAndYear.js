import { YEAR, COURSES } from "../constants/YearAndCourse.js";

export const validateCourseAndYear = (course, year) => {
    const isValidCourse = COURSES.includes(course);
    const isValidYear = YEAR.includes(year);

    return isValidYear && isValidCourse;
};

 