import { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import handleSignin from "../../controller/auth/auth.controller.js";

const Signin = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");

  const usernameRef = useRef();

  const passwordRef = useRef();

  const handleSubmit = async () => {
    if (username.trim()?.length <= 5) {
      setMessage({
        type: "error",
        message: "username is too short",
      });
      usernameRef.current?.setNativeProps({
        style: {
          borderColor: "red",
        },
      });
      return;
    }

    if (password.trim()?.length <= 5) {
      setMessage({
        type: "error",
        message: "password is too short",
      });

      passwordRef.current?.setNativeProps({
        style: {
          borderColor: "red",
        },
      });
      return;
    }

    setMessage({
      type: "info",
      message: "please wait...",
    });

    const { success, message: resMessage } = await handleSignin({
      username,
      password,
      endpoint: "signin",
    });

    setMessage({
      type: success ? "success" : "error",
      message: resMessage,
    });
  };

  return (
    <View style={styles.container} className="bg-red-500">
      <Text style={styles.title}>SignIn</Text>

      <View style={styles.inputsContainer}>
        <Text
          className={`font-bold text-lg text-center my-5 ${
            message.type === "error"
              ? "text-red-500"
              : message.type === "info"
                ? "text-orange-500"
                : "text-green-500"
          }`}
        >
          {message?.message}
        </Text>

        <TextInput
          ref={usernameRef}
          style={styles.input}
          placeholder="username"
          placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
          keyboardType="username"
          autoCapitalize="none"
          onChangeText={(txt) =>
            setUsername(txt.replace(/[^a-zA-Z0-9._-]/g, ""))
          }
          value={username}
        />

        <TextInput
          ref={passwordRef}
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={"rgba(255, 255, 255, 0.7)"}
          autoCapitalize="none"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>

      <TouchableOpacity onPress={handleSubmit} style={styles.btn}>
        <Text style={styles.btnText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000ff",
    paddingTop: 70,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 65,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  inputsContainer: {
    marginTop: 80,
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
  btn: {
    backgroundColor: "#45db3aff",
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    marginTop: 50,
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

export default Signin;
