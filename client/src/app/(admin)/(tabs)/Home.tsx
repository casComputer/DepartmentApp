import { ScrollView } from "react-native";
import React from "react";

import Header from "@components/student/home/Header";
import AdminOptions from "@components/admin/AdminOptions";


const Home = () => {

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 60, paddingBottom: 150 }} >
      <Header />
      <AdminOptions />

      
    </ScrollView>
  );
};

export default Home;
