import { ScrollView, View,  } from "react-native";

import Header from "../../../components/common/HomeHeader";
import ParentOptions from "../../../components/parent/ParentOptions";

const Home = () => {
  return (
    <ScrollView
      className="bg-primary"
      contentContainerStyle={{
        paddingBottom: 150,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Header />
      <ParentOptions />
    </ScrollView>
  );
};

export default Home;
