import { useEffect, useState } from "react";
import { View, Text, Pressable, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";

import { formatDate } from "@utils/date.js";
import getPdfPreviewUrl from "@utils/pdfPreview.js";
import {
  downloadFile,
  checkFileExists,
  openFileInBrowser,
} from "@utils/file.js";

import CircularProgress from "@components/common/CircularProgress.jsx";

import { rejectAssignment } from "@controller/teacher/assignment.controller.js";

export const AssignmentRenderItem = ({ item }) => (
  <Pressable
    onPress={() =>
      router.push({
        params: {
          item: JSON.stringify(item),
        },
        pathname: "/(teacher)/(others)/AssignmentShow",
      })
    }
    className="p-5 rounded-3xl dark:bg-zinc-900 mt-2"
    style={{ boxShadow: "0 1px 3px rgba(0, 0, 0, 0.5)" }}
  >
    <Text className="text-xl font-black dark:text-white">{item.topic}</Text>
    <Text
      numberOfLines={2}
      className="text-gray-600 font-bold text-lg pl-3 dark:text-white"
    >
      {item.description}
    </Text>

    <View className="flex-row justify-between items-center">
      <View>
        <Text className="text-xl font-black mt-3 dark:text-white">
          {item.year} {item.course}
        </Text>
        <Text className="font-black text-lg dark:text-white">
          Due Date:
          {new Date(item.dueDate).toLocaleDateString()}
        </Text>
      </View>
      <View>
        <CircularProgress
          size={60}
          strokeWidth={5}
          progress={
            item.strength < 1
              ? 0
              : (item.submissions?.length / item.strength) * 100
          }
          fraction={`${item.submissions?.length || 0} / ${item.strength || 0}`}
        />
      </View>
    </View>
  </Pressable>
);

export const AssignmentShowRenderItem = ({ item, assignmentId }) => {
  let url = item.url;

  const [isDownloaded, setIsDownloaded] = useState();

  if (item.format === "pdf") {
    url = getPdfPreviewUrl(url);
  }

  useEffect(() => {
    const checkIfDownloaded = async () => {
      const filename = url.split("/").at(-1);
      const result = await checkFileExists(filename);
      setIsDownloaded(result);
    };
    checkIfDownloaded();
  }, []);

  return (
    <View className="justify-center rounded-xl dark:bg-zinc-900 px-4 py-5 gap-1">
      <Text className="font-bold text-2xl dark:text-white ">
        {item.studentId}
      </Text>
      <Text className="font-semibold text-md dark:text-white ">
        Submitted on {formatDate(item.createdAt)}{" "}
        {item.createdAt?.split("T")?.[1]?.split(".")?.[0]}
      </Text>

      <Pressable
        className="w-[90%] self-center mt-2 rounded-lg bg-zinc-950 h-[200px] overflow-hidden mb-2"
        onPress={() => downloadFile(item.url, item.format)}
      >
        <Image
          source={{ uri: url }}
          style={{ width: "100%", height: "100%" }}
        />
        <Text className="bg-zinc-700 w-full py-1 absolute bottom-0 left-0 text-center text-white text-lg">
          {url.split("/")?.at(-1)}
        </Text>
      </Pressable>
      <TouchableOpacity
        onPress={() => downloadFile(item.url, item.format)}
        className="self-center mt-2"
      >
        {!isDownloaded?.exists ? (
          <Text className="px-3 rounded-full text-blue-500 text-xl font-bold text-center py-2">
            Download
          </Text>
        ) : (
          <Text className="px-3 rounded-full text-blue-500 text-xl font-bold text-center pt-2">
            Open File
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openFileInBrowser(item.url)}
        className="self-center mt-2"
      >
        <Text className="px-3 rounded-full text-blue-500 text-xl font-bold text-center pt-2">
          Open File In Browser
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-around mt-2">
        <TouchableOpacity onPress={()=> rejectAssignment(assignmentId, item.studentId)} className="self-center mt-2">
          <Text className="px-3 rounded-full text-red-500 text-xl font-bold text-center">
            Reject
          </Text>
        </TouchableOpacity>
        <TouchableOpacity className="self-center mt-2">
          <Text className="px-3 rounded-full text-green-500 text-xl font-bold text-center">
            Accept
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
