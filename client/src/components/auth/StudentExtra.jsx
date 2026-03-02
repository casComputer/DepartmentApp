import { Text, TouchableOpacity, View } from "react-native";

export const Chip = ({ isSelected, year, setSelected }) => (
  <TouchableOpacity
    className={`rounded-2xl py-3 flex-1 border border-border justify-center items-center ${
      isSelected && "bg-card-selected"
    } `}
    onPress={() => setSelected(year)}
  >
    <Text
      adjustsFontSizeToFit
      numberOfLines={1}
      className="text-text font-bold text-center text-mg"
    >
      {year}
    </Text>
  </TouchableOpacity>
);

const StudentExtra = ({ course, setCourse, year, setYear }) => {
  return (
    <View className="flex-1">
      <Text className="text-text font-bold text-xl">
        Year:
      </Text>
      <View className="flex-row justify-center items-center py-2 px-3 gap-5">
        {["First", "Second", "Third", "Fourth"].map((y) => (
          <Chip
            key={y}
            year={y}
            setSelected={setYear}
            isSelected={year === y}
          />
        ))}
      </View>

      <Text className="text-text font-bold text-xl">
        Course:
      </Text>
      <View className="flex-row justify-center items-center pt-2 px-3 gap-5">
        {["Bca", "Bsc"].map((c) => (
          <Chip
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

export default StudentExtra;
