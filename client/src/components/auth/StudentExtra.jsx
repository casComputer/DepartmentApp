import { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

const YearChip = ({ isSelected = false, year, setSelected }) => {
    return (
        <TouchableOpacity
            onPress={() => setSelected(year)}
            style={[
                styles.yearItem,
                {
                    borderColor: !isSelected ? "white" : "transparent",
                    backgroundColor: isSelected ? "#f8459e" : "transparent"
                }
            ]}
        >
            <Text style={styles.yearItemText}>{year}</Text>
        </TouchableOpacity>
    );
};

const Years = () => {
    const [selected, setSelected] = useState("");

    return (
        <View style={styles.yearContainer}>
            <Text style={styles.yearContainerText}>Year:</Text>

            <YearChip
                year="First"
                setSelected={setSelected}
                isSelected={selected === "First"}
            />
            <YearChip
                year="Second"
                setSelected={setSelected}
                isSelected={selected === "Second"}
            />
            <YearChip
                year="Third"
                setSelected={setSelected}
                isSelected={selected === "Third"}
            />
            <YearChip
                year="Fourth"
                setSelected={setSelected}
                isSelected={selected === "Fourth"}
            />
        </View>
    );
};

const Courses= () => {
    const [selected, setSelected] = useState("");

    return (
        <View style={styles.yearContainer}>
            <Text style={styles.yearContainerText}>Course:</Text>

            <YearChip
                year="Bca"
                setSelected={setSelected}
                isSelected={selected === "Bca"}
            />
            <YearChip
                year="Bsc"
                setSelected={setSelected}
                isSelected={selected === "Bsc"}
            />
        </View>
    );
};

const StudentExtra = ()=>{
    return(
        <View>
        <Years />
        </View>
        )
}

const styles = StyleSheet.create({
    yearContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    yearContainerText: {
        color: "white",
        fontWeight: "bold",
        paddingRight: 20,
        fontSize: 22
    },
    yearItem: {
        borderRadius: 14,
        paddingHorizontal: 10,
        paddingVertical: 10,
        minWidth: 60,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#d2f2e4",
        borderWidth: 1
    },
    yearItemText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12
    }
});

export default StudentExtra;
