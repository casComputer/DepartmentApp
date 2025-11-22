import axios from "@utils/axios.js";
import { router } from 'expo-router'

import { useTeacherStore } from "@store/teacher.store.js";

export const verifyStudent = async ({ studentId }) => {
    try {
        const res = await axios.post("/student/verifyStudent", { studentId });
        if (res.data.success) {
            useTeacherStore.getState().verifyStudent(studentId);
        }
    } catch (error) {
        console.error("Error while verifying Student: ", error);
    }
};

export const cancelStudentVerification = async ({ studentId }) => {
    try {
        const res = await axios.post("/student/cancelStudentVerification", {
            studentId
        });
        if (res.data.success){
            useTeacherStore.getState().removeStudent(studentId);
            router.back()
        }
    } catch (error) {
        console.error(error);
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
        return false;
    }
};

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
        return null;
    }
};
