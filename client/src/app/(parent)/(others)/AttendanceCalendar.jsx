import React from 'react';
import { ScrollView, Text } from 'react-native';

import Header from '@components/common/Header'
import { AttendanceCalendar as Calendar } from '@components/student/AttendanceCalendarReport'

const AttendanceCalendar = () => {
  return (
    <ScrollView className="grow bg-primary">
      <Header title={'Attendance Calendar'} />
      <Calendar />
    </ScrollView>
  );
};



export default AttendanceCalendar;