import {
    View,
    Text,
    Image,
    ScrollView,
    Pressable,
    Dimensions
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { SharedTransition, withSpring } from "react-native-reanimated";

import Header from "@components/common/Header";
import { formatDate, getTime } from "@utils/date.js";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const TARGET_LABEL = {
    all: "Everyone",
    teacher: "Teachers",
    student: "Students",
    parent: "Parents",
    class: "Class"
};

const NoticeDetail = () => {
    const { notice: noticeStr } = useLocalSearchParams();
    const notice = JSON.parse(noticeStr ?? "{}");

    const handleImagePress = () => {
        router.push({
            pathname: "/common/ImageFullView",
            params: {
                url: notice.image,
                tag: `notice-${notice._id}`
            }
        });
    };

    const dateLabel = formatDate(notice.createdAt);
    const timeLabel = getTime(notice.createdAt);

    return (
        <View className="flex-1 bg-primary">
            <Header title="Notice" />
            <ScrollView
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
                className="pt-16 px-4">
                {/* Image */}
                {notice.image && (
                    <Pressable
                        onPress={handleImagePress}
                        className="w-full overflow-hidden rounded-3xl mt-4"
                        style={{ height: SCREEN_WIDTH * 0.6 }}>
                        <Image
                            sharedTransitionTag={`notice-${notice._id}`}
                            source={{ uri: notice.image }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                        />
                    </Pressable>
                )}

                {/* Metadata row */}
                <View className="flex-row items-center justify-between mt-5">
                    <View className="bg-card-selected px-4 py-1.5 rounded-full border border-border">
                        <Text className="text-blue-500 font-bold text-sm">
                            {TARGET_LABEL[notice.target] ?? notice.target}
                            {notice.yearCourse ? ` · ${notice.yearCourse}` : ""}
                        </Text>
                    </View>
                    <Text className="text-text/50 font-semibold text-sm">
                        {dateLabel} · {timeLabel}
                    </Text>
                </View>

                {/* Title */}
                <Text className="text-text font-black text-3xl mt-4 leading-tight">
                    {notice.title}
                </Text>

                {/* Description */}
                {notice.description ? (
                    <Text className="text-text/80 font-medium text-base mt-4 leading-relaxed">
                        {notice.description}
                    </Text>
                ) : null}
            </ScrollView>
        </View>
    );
};

export default NoticeDetail;
