import axios from "@utils/axios.js";
import { router } from "expo-router";
import { ToastAndroid } from "react-native";

import { useTeacherStore } from "@store/teacher.store.js";
import { storage } from "@utils/storage.ts";

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
            res.data?.students.forEach((s) =>
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
    }
};

export const verifyMultipleStudents = async students => {
    try {
        students = students.map(s => s.studentId);
        if (!students) return;

        const res = await axios.post("/student/verifyMultipleStudents", {
            students
        });

        if (res.data.success) {
            students.forEach(id => {
                useTeacherStore.getState().verifyStudent(id);
            });
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
            ToastAndroid.show("Saved", ToastAndroid.LONG);
        } else {
            ToastAndroid.show(res.data?.message, ToastAndroid.LONG);
        }
    } catch (error) {
        console.error("Error while saving Student: ", error);
        ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
    }
};

export const verifyStudent = async ({ studentId }) => {
    try {
        const res = await axios.post("/student/verifyStudent", { studentId });
        if (res.data.success) {
            useTeacherStore.getState().verifyStudent(studentId);
        }
    } catch (error) {
        console.error("Error while verifying Student: ", error);
        ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
    }
};

export const cancelStudentVerification = async ({ studentId }) => {
    try {
        const res = await axios.post("/student/cancelStudentVerification", {
            studentId
        });
        if (res.data.success) {
            useTeacherStore.getState().removeStudent(studentId);
            router.back();
        }
    } catch (error) {
        console.error("Error while removing student: ", error);
        ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
    }
};

export const fetchStudentsByClass = async ({ course, year, setStudents }) => {
    try {
        const res = await axios.post("/student/fetchStudentsByClass", {
            course,
            year
        });
        const numberOfStudents = res.data.numberOfStudents;

        const studentsArray = Array.from(
            { length: numberOfStudents },
            (_, index) => ({
                id: index + 1,
                isSelected: false
            })
        );

        setStudents(studentsArray);
    } catch (error) {
        console.error(error.response.data);
        ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
        return false;
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

            storage.set("students", JSON.stringify(data.students));
            storage.set(
                "in_charge",
                JSON.stringify({ course: data?.course, year: data?.year })
            );

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
        ToastAndroid.show("Something went wrong!", ToastAndroid.SHORT);
        return null;
    }
};
