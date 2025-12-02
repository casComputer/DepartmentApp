import { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import MultiSelect from "@components/common/MultiSelectModal.jsx";

const GroupItem = ({ group, onDelete, onUpdate, getAvailableStudents }) => {
    const [open, setOpen] = useState(false);
    const [list, setList] = useState([]);

    const openModal = () => {
        const allowed = getAvailableStudents(group.id);
        setList(allowed);
        setOpen(true);
    };

    const handleDone = selected => {
        onUpdate(group.id, selected);
        setOpen(false);
    };

    return (
        <View
            className="w-full py-7 my-2 rounded-3xl bg-white dark:bg-zinc-900"
            style={{ boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.5)" }}>
            <Text className="font-bold text-3xl text-center dark:text-white">
                Group {group.id}
            </Text>

            <Text className="font-bold text-xl text-center mt-4 dark:text-white">
                Selected Students: {group?.selectedStudents?.length}
            </Text>

            <View className="mt-6 flex-row items-center gap-6 justify-center">
                <TouchableOpacity
                    onPress={() => onDelete(group.id)}
                    style={styles.button
                        
                    }>
                    <Text className="font-bold text-red-500 text-lg px-4 py-3">
                        Remove Group
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={openModal}
                    style={styles.button
                    
                    }>
                    <Text className="font-bold text-violet-500 text-lg px-4 py-3">
                        Add/Remove
                    </Text>
                </TouchableOpacity>
            </View>

            <MultiSelect
                list={list}
                selected={group.selectedStudents}
                shouldShow={open}
                title={`Select students for Group ${group.id}`}
                onDone={handleDone}
            />
        </View>
    );
};


const styles = StyleSheet.create({
  button: {elevation: 3,
                        borderRadius: 24,
                        backgroundColor: "#fff",
                        shadowColor: "#000"
    
  },
});

export default GroupItem;