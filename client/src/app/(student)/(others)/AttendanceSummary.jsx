import React from 'react';
import {
  View,
  Text
} from 'react-native';
import FlashList from '@shopify/flash-list'

import Header from '@components/common/Header.jsx'

import queryClient from '@utils/queryClient.js'

const AttendanceSummary = () => {

  const report = queryClient.getQueryData(['OverallAttendenceReport'])
  
  console.log(report)

  return (
    <View className="flex-1 bg-primary">
      <Header title={'Attendance Summary'} />
      
      <FlashList />
    </View>
  );
};


export default AttendanceSummary;