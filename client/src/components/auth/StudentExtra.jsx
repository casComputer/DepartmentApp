import { Text, TouchableOpacity, View } from "react-native";

export const Chip = ({ isSelected, year, setSelected }) => (
    <TouchableOpacity
        className={`rounded-2xl py-3 flex-1 justify-center items-center ${
            isSelected && "bg-[#f8459e]"
        } `}
        onPress={() => setSelected(year)}>
        <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            className=" text-black font-bold text-center text-md dark:text-white">
            {year}
        </Text>
    </TouchableOpacity>
);

const StudentExtra = ({ course, setCourse, year, setYear }) => {
    return (
        <View className="flex-1">
            <Text className="text-black font-bold text-xl dark:text-white">
                Year:
            </Text>
            <View className="flex-row justify-center items-center py-5 px-3 gap-5">
                {["First", "Second", "Third", "Fourth"].map(y => (
                    <Chip
                        key={y}
                        year={y}
                        setSelected={setYear}
                        isSelected={year === y}
                    />
                ))}
            </View>

            <Text className="text-black font-bold text-xl dark:text-white">
                Course:
            </Text>
            <View className="flex-row justify-center items-center pt-5 px-3 gap-5">
                {["Bca", "Bsc"].map(c => (
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
