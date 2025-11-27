import axios from "@utils/axios.js";
import { router } from "expo-router";
import { ToastAndroid } from "react-native";

import { useTeacherStore } from "@store/teacher.store.js";
import { saveStudentsCount } from "@utils/storage.ts";

export const assignRollByGroup = async ({ students, year, course }) => {
    try {
        students = students.map(st => st.students).flat();

        const res = await axios.post("/student/assignGroupedRollNo", {
            students,
            year,
            course
        });
        if (res.data?.success) {
            const updates = {},
                updated = res.data?.updated || [];
            updated.forEach(s => {
                updates[s.studentId] = s.rollno;
            });

            useTeacherStore.getState().updateStudentsBulk(updates);

            ToastAndroid.show(
                `Successfully assigned roll numbers to ${res.data?.updated?.length} students.` +
                    `${
                        res.data?.failed?.length > 0
                            ? ` Failed: ${res.data.failed.length}`
                            : ""
                    }`,
                ToastAndroid.SHORT
            );
        }
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Roll numbers assigning failed!", ToastAndroid.SHORT);
    }
};

export const assignRollAlphabetically = async ({ course, year }) => {
    try {
        const res = await axios.post(
            "/student/autoAssignRollNoAlphabetically",
            {
                course,
                year
            }
        );
        if (res.data?.success) {
            res.data?.students.forEach(s =>
                useTeacherStore
                    .getState()
                    .updateStudentRollNo(s.studentId, s.rollno)
            );
            ToastAndroid.show(
                "Roll numbers assigned successfully",
                ToastAndroid.SHORT
            );
        }
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Roll numbers assignment failed", ToastAndroid.SHORT);
    }
};

export const verifyMultipleStudents = async students => {
    try {
        const allVerified = students.every(s => s.is_verified);
        console.log(students);
        console.log(allVerified);

        if (allVerified) {
            return ToastAndroid.show(
                "Students were already verified!",
                ToastAndroid.SHORT
            );
        }

        students = students.map(s => s.studentId);
        if (!students)
            return ToastAndroid.show(
                "Currently you no students!",
                ToastAndroid.SHORT
            );

        const res = await axios.post("/student/verifyMultipleStudents", {
            students
        });

        if (res.data.success) {
            students.forEach(id => {
                useTeacherStore.getState().verifyStudent(id);
            });
            ToastAndroid.show(
                `${students.length} students verified`,
                ToastAndroid.SHORT
            );
        }
    } catch (error) {
        console.error("Error while saving Student: ", error);
        ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
    }
};

export const saveStudentDetails = async ({ studentId, rollno }) => {
    try {
        rollno = parseInt(rollno, 10);
        if (!studentId || !rollno || rollno == 0 || rollno < 0) {
            ToastAndroid.show(
                "Please Provide a valid roll number!",
                ToastAndroid.SHORT
            );
            return;
        }

        const res = await axios.post("/student/saveStudentDetails", {
            studentId,
            rollno
        });

        if (res.data.success) {
            useTeacherStore.getState().updateStudentRollNo(studentId, rollno);
            ToastAndroid.show("Saved successfuly", ToastAndroid.SHORT);
        } else {
            ToastAndroid.show(res.data?.message, ToastAndroid.LONG);
        }
    } catch (error) {
        console.error("Error while saving Student: ", error);
        ToastAndroid.show("Something went wrong!", ToastAndroid.LONG);
    }
};

export const verifyStudent = async ({ studentId }) => {
    try {
        const res = await axios.post("/student/verifyStudent", { studentId });
        if (res.data.success) {
            useTeacherStore.getState().verifyStudent(studentId);
            ToastAndroid.show("Verified successfuly", ToastAndroid.SHORT);
        }
    } catch (error) {
        console.error("Error while verifying Student: ", error);
        ToastAndroid.show("Something went wrong!", ToastAndroid.LONG);
    }
};

export const cancelStudentVerification = async ({ studentId }) => {
    try {
            ToastAndroid.show("Removing student...", ToastAndroid.SHORT);
        const res = await axios.post("/student/cancelStudentVerification", {
            studentId
        });
        if (res.data.success) {
            useTeacherStore.getState().removeStudent(studentId);
            ToastAndroid.show("Removed student", ToastAndroid.SHORT);
            
            router.back();
        }else{
            ToastAndroid.show(`Student couldn't removed: ${res.data?.message} `, ToastAndroid.SHORT);
        }
    } catch (error) {
        console.error("Error while removing student: ", error);
        ToastAndroid.show("Something went wrong!", ToastAndroid.LONG);
    }
};

export const fetchStudentsByClass = async ({ course, year }) => {
    try {
        const res = await axios.post("/student/fetchStudentsByClass", {
            course,
            year
        });
        

        const numberOfStudents = res.data?.numberOfStudents;
        console.log(numberOfStudents)
        saveStudentsCount({ count: numberOfStudents, year, course})

        return numberOfStudents
    } catch (error) {
        console.error(error);
        ToastAndroid.show("Something went wrong!", ToastAndroid.LONG);
        return 0;
    }
};

// note: use this as current user as class teacher
export const fetchStudentsByClassTeacher = async ({ teacherId, setStatus }) => {
    try {
        const { data } = await axios.post(
            "/student/fetchStudentsByClassTeacher",
            { teacherId }
        );

        if (data?.success) {
            useTeacherStore.setState({
                students: data.students,
                inCharge: {
                    course: data?.course,
                    year: data?.year
                }
            });

            setStatus("HAS_STUDENTS");
            return null;
        }

        if (!data.course || !data.year) {
            useTeacherStore.setState({ students: [] });
            setStatus("NO_CLASS_ASSIGNED");
            return null;
        }

        useTeacherStore.setState({
            students: [],
            inCharge: {
                course: data.course,
                year: data.year
            }
        });
        setStatus("CLASS_EMPTY");
        return {
            course: data.course,
            year: data.year
        };
    } catch (error) {
        console.error("fetchStudentsByClassTeacher Error: ", error);
        setStatus("ERROR");
        ToastAndroid.show("Something went wrong!", ToastAndroid.LONG);
        return null;
    }
};
