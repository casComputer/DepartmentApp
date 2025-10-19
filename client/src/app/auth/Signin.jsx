import { useState } from "react"
import { router } from 'expo-router';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';


const Signin = () => {
    const [password, setPassword] = useState("")
    
    
  return (
    <View style={styles.container} className="bg-red-500">
      <Text style={styles.title}>SignIn</Text>

      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.input}
          placeholder="username"
          placeholderTextColor={
              "rgba(255, 255, 255, 0.7)"
          }
          keyboardType="username"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={
              "rgba(255, 255, 255, 0.7)"
          }
          autoCapitalize="none"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Sign In</Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    paddingTop: 70,
    paddingHorizontal: 10
  },
  title: {
    fontSize: 65,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "white"
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
    color: "white"
  },
  btn: {
    backgroundColor: "#45db3aff",
    paddingVertical: 18,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    marginTop: 50
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 30
  },
  redirectText: {
    color: 'white',
    fontSize: 20,
    textAlign: "center",
    marginTop: 20
  }

})

export default Signin