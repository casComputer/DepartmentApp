import { View } from "react-native";

import RollNumberBadge from "@components/student/AnimatedRollNo";
import { useAppStore } from "@store/app.store.js";

export default function StudentExtra() {
    const rollno = useAppStore(state => state.user.rollno);

    if (!rollno) return null;

    return (
        <View style={{ flex: 1 }}>
            <RollNumberBadge rollno={rollno} />
        </View>
    );
}
