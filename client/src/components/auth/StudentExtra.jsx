import { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const YearChip = ({ isSelected, year, setSelected }) => (
  <TouchableOpacity
    onPress={() => setSelected(year)}
    style={[
      styles.yearItem,
      {
        borderColor: !isSelected ? "white" : "transparent",
        backgroundColor: isSelected ? "#f8459e" : "transparent",
      },
    ]}
  >
    <Text style={styles.yearItemText}>{year}</Text>
  </TouchableOpacity>
);

const StudentExtra = ({ getData }) => {
  const [year, setYear] = useState("");
  const [course, setCourse] = useState("");

  useEffect(() => {
    getData({ year, course });
  }, [year, course]);

  return (
    <View>
      <View style={styles.yearContainer}>
        <Text style={styles.yearContainerText}>Year:</Text>
        {["First", "Second", "Third", "Fourth"].map((y) => (
          <YearChip
            key={y}
            year={y}
            setSelected={setYear}
            isSelected={year === y}
          />
        ))}
      </View>

      <View style={styles.yearContainer}>
        <Text style={styles.yearContainerText}>Course:</Text>
        {["Bca", "Bsc"].map((c) => (
          <YearChip
            key={c}
            year={c}
            setSelected={setCourse}
            isSelected={course === c}
          />
        ))}
      </View>
    </View>
  );
};


const styles= StyleSheet.create({
    yearContainer: {
        flexDirection: "row",
        marginVertical: 10,
        paddingHorizontal: 8,
        alignItems: "center",
        gap: 10
    },
    yearContainerText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 22,
        minWidth: 80
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
        fontSize: 14
    }
});


export default StudentExtra