import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import StudentExtra from '../../components/auth/StudentExtra';


const Signin = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>SignIn</Text>

      <View style={styles.inputsContainer}>
        <TextInput
          style={styles.input}
          placeholder="username"
          keyboardType="username"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Sign In</Text>
      </TouchableOpacity>

      <StudentExtra />


      <TouchableOpacity >
        <Text style={styles.redirectText}>Don't have an account? SignUp</Text>
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
    borderColor: "white"
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