import { useState } from "react";
import { View, TextInput } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { editProfile } from "@controller/common/profile.controller.js";

import Header from "@components/common/Header2.jsx";

import { useAppStore } from "@store/app.store.js";

const EditProfile = () => {
  const currentFullname = useAppStore((state) => state.user.fullname) || "";
  const currentUsername = useAppStore((state) => state.user.userId) || "";
  const currentPhone = useAppStore((state) => state.user.phone) || "";
  const currentEmail = useAppStore((state) => state.user.email) || "";
  const currentAbout = useAppStore((state) => state.user.about) || "";

  const [fullname, setFullname] = useState(currentFullname);
  const [username, setUsername] = useState(currentUsername);
  const [phone, setPhone] = useState(currentPhone);
  const [email, setEmail] = useState(currentEmail);
  const [about, setAbout] = useState(currentAbout);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    
    if(fullname.trim() === "" || username.trim() === "") {
      setMessage("Fullname and Username cannot be empty.");
      setSaving(false);
      return;
    }

    if(phone && !/^\+?[1-9]\d{1,14}$/.test(phone)) {
      setMessage("Invalid phone number format.");
      setSaving(false);
      return;
    }

    if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Invalid email format.");
      setSaving(false);
      return;
    }

    await editProfile({ fullname, username, phone, email, about });

    setSaving(false);
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow:1 }}  className="bg-primary">
      <Header onSave={handleSave} saving={saving} />

      <View className="px-2 gap-4 mt-4">
        <TextInput
          className="bg-card px-4 py-5 rounded-2xl text-text font-bold text-lg"
          placeholder="fullname"
          defaultValue={currentFullname}
          returnKeyType="next"
          value={fullname}
          onChangeText={setFullname}
          />
        <TextInput
          className="bg-card px-4 py-5 rounded-2xl text-text font-bold text-lg"
          placeholder="username"
          defaultValue={currentUsername}
          returnKeyType="next"
          value={username}
          onChangeText={setUsername}
          />
        <TextInput
          className="bg-card px-4 py-5 rounded-2xl text-text font-bold text-lg"
          placeholder="Phone number"
          defaultValue={currentPhone}
          keyboardType="phone-pad"
          returnKeyType="next"
          value={phone}
          onChangeText={setPhone}
          />

        <TextInput
          className="bg-card px-4 py-5 rounded-2xl text-text font-bold text-lg"
          placeholder="Email"
          defaultValue={currentEmail}
          keyboardType="email-address"
          returnKeyType="next"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          />

        <TextInput
          className="bg-card px-4 py-5 rounded-2xl text-text font-bold text-lg"
          placeholder="About you"
          multiline
          numberOfLines={4}
          defaultValue={currentAbout}
          value={about}
          onChangeText={setAbout}
          
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EditProfile;
