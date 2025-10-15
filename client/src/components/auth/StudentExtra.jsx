import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const YearChip = ({ isSelected = false, year, setSelected }) => {
  return (
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

const Courses = () => {
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

const StudentExtra = ({ getData }) => {
  return (
    <View>
      <Years />
      <Courses />
    </View>
  );
};

const styles = StyleSheet.create({
  yearContainer: {
    flexDirection: "row",
    marginVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    gap: 10,
  },
  yearContainerText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 22,
    minWidth: 80,
  },
  yearItem: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minWidth: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d2f2e4",
    borderWidth: 1,
  },
  yearItemText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default StudentExtra;
