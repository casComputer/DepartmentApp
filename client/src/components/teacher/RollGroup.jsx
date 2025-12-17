import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";

import GroupItem from "@components/teacher/RollGroupItem.jsx";

import { assignRollByGroup } from "@controller/teacher/students.controller.js";

const RollGroup = ({ students, inCharge, setLoading }) => {
    const [groups, setGroups] = useState([]);

    const getAssignedMap = () => {
        const map = {};
        groups.forEach(g => {
            g.selectedStudents.forEach(id => (map[id] = g.id));
        });
        return map;
    };

    // Compute available students for a specific group
    const getAvailableStudents = groupId => {
        const assigned = getAssignedMap();

        return students.filter(
            s => !assigned[s.studentId] || assigned[s.studentId] === groupId
        );
    };

    const updateGroup = (id, selectedIds) => {
        setGroups(prev =>
            prev.map(g =>
                g.id === id ? { ...g, selectedStudents: selectedIds } : g
            )
        );
    };

    const deleteGroup = id => {
        setGroups(prev => prev.filter(g => g.id !== id));
    };

    const addGroup = () => {
        setGroups(prev => [
            ...prev,
            {
                id: (prev.at(-1)?.id || 0) + 1,
                selectedStudents: []
            }
        ]);
    };

    const handleSave = async () => {
        setLoading(true);
        let rollno = 1;

        const sortedGroups = groups.map(group => {
            // Filter students assigned to this group
            const groupStudents = group.selectedStudents
                .map(id => students.find(s => s.studentId === id))
                .filter(Boolean);

            // Sort by fullname
            groupStudents.sort((a, b) => a.fullname.localeCompare(b.fullname));

            // Assign roll numbers
            const studentsWithrollno = groupStudents.map(s => ({
                ...s,
                rollno: rollno++
            }));

            return {
                ...group,
                students: studentsWithrollno
            };
        });

        await assignRollByGroup({
            students: sortedGroups,
            course: inCharge.course,
            year: inCharge.year
        });
        setLoading(false);
    };

    return (
        <View className="w-full px-3">
            <Text className="text-3xl font-bold py-3 text-text">
                Create Groups
            </Text>

            <TouchableOpacity
                onPress={addGroup}
                className="self-start rounded-full bg-btn px-5 py-3 flex-row justify-center items-center gap-2 mb-8 ">
                <Text className="font-bold text-3xl text-text">+</Text>
                <Text className="font-bold text-lg text-text">
                    Create Group
                </Text>
            </TouchableOpacity>

            {groups.length === 0 ? (
                <>
                    <Text className="font-bold text-lg text-center dark:text-zinc-300">
                        Create groups to organize Students.{"\n"}Sorting follows
                        the order in which groups are created.
                    </Text>
                    <Text className="mt-3 font-bold text-lg text-center text-orange-500">
                        Note: This will remove already assigned roll umber for
                        all students in this class
                    </Text>
                </>
            ) : (
                <>
                    {groups.map(g => (
                        <GroupItem
                            key={g.id}
                            group={g}
                            onDelete={deleteGroup}
                            onUpdate={updateGroup}
                            getAvailableStudents={getAvailableStudents}
                        />
                    ))}
                    <TouchableOpacity
                        onPress={handleSave}
                        className="mt-5 rounded-full px-5">
                        <Text className="font-semibold text-5xl text-center text-green-500">
                            Save
                        </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

export default RollGroup;
