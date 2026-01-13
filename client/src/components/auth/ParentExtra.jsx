import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import MultiSelect from "@components/common/MultiSelectModal.jsx";
import Select from "@components/common/Select.jsx";

import { YEAR, COURSES, HOURS } from "@constants/ClassAndCourses";

import { fetchStudentsByClass } from "@controller/parent/students.controller.js";

const ParentExtra = ({ course, year }) => {
    const [open, setOpen] = useState(false);
    const [list, setList] = useState([]);

    useEffect(() => {
        if (!course || !year) return;
        
        const fetch = async () => {
            await fetchStudentsByClass();
        };
        fetch();
        
    }, [course, year]);

    return (
        <View>
            <TouchableOpacity onPress={() => setOpen(true)}>
                <Text className="text-3xl py-4 font-bold text-blue-500 text-center">
                    Select student
                </Text>
            </TouchableOpacity>

            <MultiSelect
                list={list}
                // selected={}
                shouldShow={open}
                title={`Select students for Group`}
                onDone={() => setOpen(false)}
            />
        </View>
    );
};

export default ParentExtra;
