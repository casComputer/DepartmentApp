import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";

const MultiSelectModal = ({
  list = [],
  onDone,
  title = "",
  shouldShow = false,
  isLoading= false
}) => {
  const [selected, setSelected] = useState([]);

  const toggleSelect = (id) => {
    let updated;

    if (selected.includes(id)) updated = selected.filter((s) => s !== id);
    else updated = [...selected, id];

    setSelected(updated);
  };

  const handleDone = () => {
    onDone(selected);
    setSelected([]);
  };

  const renderItem = ({ item }) => {
    const isSelected = selected.includes(item.studentId);

    return (
      <TouchableOpacity
        onPress={() => toggleSelect(item.studentId)}
        className={`bg-card p-5 rounded-3xl my-1 ${
          isSelected && "border-[#3399ff] bg-card-selected"
        }`}
      >
        <Text className="text-text">{item.fullname}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={shouldShow} animationType="slide">
      <View className="pt-10 bg-primary flex-1">
        <Text className="text-2xl font-bold text-center text-text">
          {title}
        </Text>
        <FlashList
          data={list}
          renderItem={renderItem}
          contentContainerStyle={{ gap: 50, paddingBottom: 70 }}
          ListHeaderComponent={
              isLoading &&
                    <ActivityIndicator size={'large'} />
                }
        />
        <TouchableOpacity
          onPress={handleDone}
          className="bg-btn py-4 mb-8 rounded-2xl"
        >
          <Text className="text-white text-center text-xl font-bold">Done</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default MultiSelectModal;
