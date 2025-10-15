import { router } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import StudentExtra from "../../components/auth/StudentExtra.jsx";

const Signup = () => {

  const [formData, setFormData] = useState({});

  const handleSubmit = () => {
    console.log(formData);
  }

  return (
    <View style={styles.container} className="bg-slate-100 rounded-xl">
      <Text style={styles.title}>Signup</Text>

      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.input}
          placeholder="username"
          keyboardType="username"
          autoCapitalize="none"
          onChangeText={(text) => setFormData({ ...formData, username: text })}
          value={formData.username}
        />

        <TextInput
          style={styles.input}
          placeholder="full name"
          keyboardType="full-name"
          onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          value={formData.fullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          value={formData.password}
        />

        <StudentExtra />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btnText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("auth/SignIn")}>
          <Text style={styles.redirectText}>
            Already have an account? SignIn
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000ff",
    paddingTop: 70,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 65,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  inputsContainer: {
    marginTop: 80,
    flex: 1,
  },
  input: {
    height: 70,
    borderRadius: 26,
    paddingHorizontal: 18,
    marginBottom: 20,
    borderWidth: 1,
    fontSize: 18,
    borderColor: "white",
    color: "white",
  },
  footer: {
    paddingBottom: 100,
  },

  btn: {
    backgroundColor: "#45db3aff",
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 30,
  },
  redirectText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
  },
});

export default Signup;
