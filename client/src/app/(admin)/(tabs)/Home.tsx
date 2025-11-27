import { ScrollView } from "react-native";
import React from "react";

import Header from "@components/common/HomeHeader.jsx";
// import AdminOptions from "@components/admin/AdminOptions.jsx";

const Home = () => {

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 60, paddingBottom: 150 }} >
      <Header />
      {/* <AdminOptions /> */}

      
    </ScrollView>
  );
};

export default Home;
