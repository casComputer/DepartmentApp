import { ScrollView } from "react-native";
import React from "react";

import Header from "@components/common/HomeHeader.jsx";
import AdminOptions from "@components/admin/AdminOptions.tsx";

const Home = () => {
    return (
        <ScrollView
            contentContainerStyle={{ paddingBottom: 150 }}
            className="bg-white dark:bg-black">
            <Header />
            <AdminOptions />
        </ScrollView>
    );
};

export default Home;
