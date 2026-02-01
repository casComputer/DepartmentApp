import {
    View,
    Text,
    Image,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";

import Header from "@components/common/Header2.jsx";

import { fetchAllTeachers } from "@controller/student/teachers.controller.js";

import { useAppStore } from "@store/app.store.js";
import { openPhone, openWhatsApp, openEmail } from "@utils/openApp.js";

const { width: vw } = Dimensions.get("window");

const iconSize = 18;

const TeacherItem = ({ item }) => {
    const fullname = useAppStore(state => state.user.fullname);
    const students = useAppStore(state => state.user.students);

    const studentText =
        students.length === 1
            ? students[0]
            : students.slice(0, -1).join(", ") + " and " + students.at(-1);

    const message = `*Hi ${item.fullname} 👋*
    
I’m reaching out regarding *${studentText}*.


Just wanted to ask about (your message here...)

*Thanks in advance 🤝.*`;

    return (
        <View
            className={`bg-card my-2 rounded-3xl p-4 justify-center items-center`}
            style={{ width: vw * 0.9, marginHorizontal: vw * 0.05 }}
        >
            <View className="bg-card-selected w-[150px] h-[150px] rounded-full overflow-hidden justify-center items-center">
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
                className="w-full -mt-4 text-center text-text-secondary font-semibold text-xl"
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
                <View className="w-full mt-2">
                    <Text className="text-text font-black text-2xl text-center pt-2">
                        • COURSES •
                    </Text>
                    {item.courses?.map((c, index) => (
                        <Text
                            key={index}
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            className="w-full text-center font-bold text-md text-text"
                        >
                            {c.year} {c.course} - {c.course_name}
                        </Text>
                    ))}
                </View>
            )}

            <View className="w-full">
                {item.inCharge && (
                    <Text className="text-text font-black text-xl text-center pt-2">
                        In Charge : {item.inCharge?.year}{" "}
                        {item.inCharge?.course}
                    </Text>
                )}

                {item?.email ? (
                    <TouchableOpacity onPress={() => openEmail(item.email)}>
                        <Text className="text-blue-500 font-bold text-sm text-center">
                            {item.email}
                        </Text>
                    </TouchableOpacity>
                ) : null}
                {item?.phone ? (
                    <View className="mt-1 flex-row items-center justify-center gap-3">
                        <TouchableOpacity onPress={() => openPhone(item.phone)}>
                            <Text className="text-blue-500 font-bold text-xl text-center">
                                {item.phone}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => openPhone(item.phone)}>
                            <MaterialIcons
                                name="call"
                                size={iconSize}
                                color="rgb(59, 130, 246)"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => openWhatsApp(item.phone, message)}
                        >
                            <FontAwesome
                                name="whatsapp"
                                size={iconSize}
                                color="rgb(34, 197, 94)"
                            />
                        </TouchableOpacity>
                    </View>
                ) : null}
            </View>
        </View>
    );
};

const TeachersList = () => {
    const { data: teachers, isLoading , refetch,
        isRefetching} = useQuery({
        queryKey: ["teachers"],
        queryFn: fetchAllTeachers
    });

    return (
        <View className="flex-1 bg-primary">
            <FlashList
                data={teachers}
                renderItem={({ item }) => <TeacherItem item={item} />}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item.teacherId}
                contentContainerStyle={{
                    paddingTop: 40,
                    paddingBottom: 80
                }}
                ListEmptyComponent={
                    isLoading ? (
                        <ActivityIndicator size="large" />
                    ) : (
                        <Text className="text-text text-lg font-bold text-center">
                            No teachers registered yet!.
                        </Text>
                    )
                }
                onRefresh={refetch}
                refreshing={isRefetching}
            />
        </View>
    );
};

export default TeachersList;
