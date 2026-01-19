import { View, Text, Image, Dimensions, ScrollView } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";

import Header from "@components/common/Header2.jsx";

import { fetchAllTeachers } from "@controller/student/teachers.controller.js";

import { useAppStore } from "@store/app.store.js";

const { width: vw } = Dimensions.get("window");

const TeacherItem = ({ item, course, year }) => {
  return (
    <View
      className={`bg-card my-2 rounded-3xl p-4 justify-center items-center`}
      style={{ width: vw * 0.9, marginHorizontal: vw * 0.05 }}
    >
      <View className="bg-card-selected w-[100px] h-[100px] rounded-full overflow-hidden justify-center items-center">
        {item?.dp ? (
          <Image
            source={{ uri: item?.dp }}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        ) : (
          <Text
            allowFontScale={false}
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{ fontSize: vw * 0.15 }}
            className="w-full text-center px-4 text-text-secondary font-black"
          >
            {item.fullname[0]}
          </Text>
        )}
      </View>

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        className="w-full mt-1 text-center text-text-secondary font-semibold text-md"
      >
        @{item.teacherId}
      </Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        className="w-full text-center text-text font-bold text-4xl"
      >
        {item.fullname}
      </Text>

      {!!item.courses?.length && (
        <View className="w-full mt-4">
          <Text className="text-text font-black text-3xl text-center pt-2">
            Courses
          </Text>
          {item.courses?.map((c, index) => (
            <Text
              key={index}
              numberOfLines={1}
              adjustsFontSizeToFit
              className={`w-full text-center font-bold text-md ${c.course === course && c.year === year ? "text-text-secondary" : "text-text"} `}
            >
              {c.year} {c.course} - {c.course_name}
            </Text>
          ))}
        </View>
      )}

      <View className="w-full">
        {item.inCharge && (
          <Text className="text-text font-black text-2xl text-center pt-2">
            In Charge: {item.inCharge?.year} {item.inCharge?.course}
          </Text> 
        )}

        <Text className="text-blue-500 font-bold text-xl text-center">
          {item?.phone}
        </Text>
      </View>
    </View>
  );
};

const TeachersList = () => {
  const { data } = useQuery({
    queryKey: ["teachers"],
    queryFn: fetchAllTeachers,
  });

  const course = useAppStore((state) => state.user.course);
  const year = useAppStore((state) => state.user.year_of_study);

  const yourTeachers =
    data?.filter(
      (teacher) =>
        teacher.inCharge?.course === course && teacher.inCharge?.year === year,
    ) || [];

  const otherTeachers =
    data?.filter(
      (teacher) =>
        teacher.inCharge?.course !== course || teacher.inCharge?.year !== year,
    ) || [];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} className="bg-primary">
      <Header />
      <Text className="text-text mt-4 px-3 text-2xl font-black">
        Your Teachers
      </Text>

      <View>
        <FlashList
          data={yourTeachers}
          renderItem={({ item }) => (
            <TeacherItem item={item} course={course} year={year} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.teacherId}
        />
      </View>

      <Text className="text-text my-4 px-3 text-2xl font-black">
        Other Teachers
      </Text>

      <View>
        <FlashList
          data={otherTeachers}
          renderItem={({ item }) => (
            <TeacherItem item={item} course={course} year={year} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.teacherId}
        />
      </View>
    </ScrollView>
  );
};

export default TeachersList;
