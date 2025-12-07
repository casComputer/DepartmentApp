import { ScrollView, View } from "react-native";
import React from "react";

import Header from "../../../components/common/HomeHeader";
import TeacherOptions from "../../../components/teacher/TeacherOptions";

// import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

// async function openPdf(url) {
//   const localUri = FileSystem.cacheDirectory + "temp.pdf";

//   const download = await FileSystem.downloadAsync(url, localUri);

//   if (!(await Sharing.isAvailableAsync())) {
//     alert("Sharing not available");
//     return;
//   }

//   await Sharing.shareAsync(download.uri);
// }

const Home = () => {
    return (
        <ScrollView
            className="bg-white dark:bg-black"
            contentContainerStyle={{
                paddingBottom: 150,
                flexGrow: 1
            }}>
            <Header />
            <TeacherOptions />
        </ScrollView>
    );
};

export default Home;
