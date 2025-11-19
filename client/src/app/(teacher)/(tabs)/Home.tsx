import { ScrollView } from "react-native";
import React from "react";

import Header from "@components/student/home/Header";
import TeacherOptions from "@components/teacher/TeacherOptions";


const Home = () => {

  return (
    <ScrollView contentContainerStyle={{ paddingTop: 60, paddingBottom: 150 }} >
      <Header />
      <TeacherOptions />

      
    </ScrollView>
  );
};

export default Home;
