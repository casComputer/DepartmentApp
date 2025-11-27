import { createMMKV } from "react-native-mmkv";

export const storage = createMMKV();

export const bulkAssignRollNumbers = ({ assignedList, key }) => {
    const raw = storage.getString(key);
    if (!raw) return false;

    let students = JSON.parse(raw);

    const assignedMap = {};
    assignedList.forEach(item => {
        assignedMap[item.studentId] = item.rollno;
    });

    students = students.map(st => ({
        ...st,
        rollno: assignedMap[st.studentId] ?? null
    }));

    storage.set(key, JSON.stringify(students));
    return true;
};

export const saveStudentsCount = ({ count, course, year }) => {
    if (!course || !year) return;
    storage.set(`${year}-${course}-count`, count.toString());
    console.log(`[save] ${year}-${course}: ${count}`);
};

export const getStudentCount = ({ course, year }) => {
    if (!course || !year) return 0;
    const value = parseInt(storage.getString(`${year}-${course}-count`), 10);
    return Number.isNaN(value) ? 0 : value;
};

/*
=======
common
=======
userId
fullname
role
course
year_of_study

========
TEACHER
========
students
in_charge


*/
