import axios from "@utils/axios.js";

import {
    useTeacherStore
} from "@store/teacher.store.js";
import {
    useAppStore,
    toast
} from "@store/app.store.js";

export const assignRollByGroup = async ({
    students, year, course
}) => {
    try {
        students = students
        .map(st => st.students)
        .flat()
        .map(s => ({
            studentId: s.userId,
            rollno: s.rollno
        }));

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

            toast.success(
                `Successfully assigned roll numbers to ${res.data?.updated?.length} students.`
            );
        }
    } catch (error) {
        toast.error("Roll numbers assigning failed!");
    }
};

export const assignRollAlphabetically = async ({
    course, year
}) => {
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
            toast.success(
                "Roll numbers assigned successfully",
            );
        }
    } catch (error) {
        toast.error("Roll numbers assignment failed");
    }
};

export const verifyMultipleStudents = async students => {
    try {
        const allVerified = students.every(s => s.is_verified);

        if (allVerified) {
            return toast.info(
                "Students were already verified!",
            );
        }

        students = students.map(s => s.userId);
        if (!students)
            return toast.error(
            "Currently you have no students!",
        );

        const res = await axios.post("/student/verifyMultipleStudents", {
            students
        });

        if (res.data.success) {
            students.forEach(id => {
                useTeacherStore.getState().verifyStudent(id);
            });
            toast.success(
                `${students.length} students verified`
            );
        }
    } catch (error) {
        toast.error("Failed to verify students");
    }
};

export const saveStudentDetails = async ({
    studentId, rollno
}) => {
    try {
        rollno = parseInt(rollno, 10);
        if (!studentId || !rollno || rollno == 0 || rollno < 0) {
            toast.warn(
                "Please Provide a valid roll number"
            );
            return;
        }

        const res = await axios.post("/student/saveStudentDetails", {
            studentId,
            rollno
        });

        if (res.data.success) {
            useTeacherStore.getState().updateStudentRollNo(studentId, rollno);
            toast.success("Details saved successfull");
        } else {
            toast.error("Failed to update student details", res.data?.message ?? "");
        }
    } catch (error) {
        toast.error("Failed to update student details",
            error.response?.data?.message ?? ""
        );
    }
};

export const verifyStudent = async ({
    studentId
}) => {
    try {
        const res = await axios.post("/student/verifyStudent", {
            studentId
        });
        if (res.data.success) {
            useTeacherStore.getState().verifyStudent(studentId);
            toast.success("Student successfully verified");
        }
    } catch (error) {
        toast.error("Failed to verify student");
    }
};

export const cancelStudentVerification = async ({
    studentId
}) => {
    try {
        toast.info("Removing student...",);

        const res = await axios.post("/student/cancelStudentVerification", {
            studentId
        });
        if (res.data.success) {
            useTeacherStore.getState().removeStudent(studentId);
            toast.success("Student removez successfully");
        } else {
            toast.error(
                `Student couldn't removed: ${res.data?.message} `
            );
        }
    } catch (error) {
        toast.error("Failed to delete student");
    }
};

export const removeAllStudents = async () => {
    try {
        const res = await axios.post("/student/removeAllByClassTeacher");
        if (res.data.success) {
            useTeacherStore.getState().clearStudents();
            toast.success(
                "Students removed successfully",
            );
        } else {
            toast.error(
                `Student couldn't removed: ${res.data?.message ?? ""} `,
            );
        }
    } catch (error) {
        toast.error("Students couldn't removed",);
    }
};

// note: use this when current user is a class teacher
export const fetchStudentsByClassTeacher = async ({
    setStatus
}) => {
    try {
        const {
            data
        } = await axios.get(
            "/student/fetchStudentsByClassTeacher"
        );

        if (data?.success) {
            useAppStore.getState().updateUser({
                in_charge_course: data?.course,
                in_charge_year: data?.year
            });

            useTeacherStore.setState({
                students: data.students
            });

            setStatus("HAS_STUDENTS");
            return null;
        }

        if (!data.course || !data.year) {
            useTeacherStore.setState({
                students: []
            });
            useAppStore.getState().updateUser({
                in_charge_course: "",
                in_charge_year: ""
            });
            setStatus("NO_CLASS_ASSIGNED");
            return null;
        }

        useTeacherStore.setState({
            students: []
        });

        useAppStore.getState().updateUser({
            in_charge_course: data?.course,
            in_charge_year: data?.year
        });

        setStatus("CLASS_EMPTY");

        return {
            course: data.course,
            year: data.year
        };
    } catch (error) {
        setStatus("ERROR");

        toast.error("Failed to get students list!!");
        return null;
    }
};

export const getStudentList = async ({
    course, year
})=> {
    try {
        const {
            data
        } = await axios.post('/student/fetchStudentsByClass', {
                course, year
            })
        if (data.success) return data.students

        toast.error("Failed to get students list");
        return []
    }catch(err) {
        toast.error("Failed to get students list");
        return []
    }
}