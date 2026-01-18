import {
    View,
    Text,
} from 'react-native';

import Header from '@components/common/Header2.jsx';
import LeaderBoard from '@components/student/AttendanceLeaderboard.jsx';

import queryClient from '@utils/queryClient.js';

const ShortSummary = ({
    summary, time_analysis, projections
})=> {


    return (
        <View className="px-3 py-4 mt-8 gap-1 rounded-3xl mx-2 bg-card">
            <Text className="text-text text-2xl font-bold ">⚡Quick Overview</Text>

            <Text className="mt-3 text-text-secondary text-md font-bold text-center">You attended {summary?.classesAttended} of the {summary?.totalClassesSoFar} {summary?.totalClassesSoFar > 1 ? 'classes': 'class'} over a span of {time_analysis?.passedWorkingDays} {summary?.totalClassesSoFar > 1 ? 'days': 'day'}.</Text>
            <Text className="mt-2 text-text-secondary text-md text-center">{projections?.message}</Text>
            <Text className=" text-text-secondary text-sm text-center">Estimated attendance if all remaining classes were attended: <Text className="font-black">
                {projections?.expectedMaxPercentage}</Text>
            </Text>



            <Text className="mt-3 text-text-secondary text-md text-center">
                Attendance Status: {summary?.status + '\n'}
                Remaining Days: {time_analysis?.remainingDays + '\n'}
                Remaining Hours: {time_analysis?.remainingHours}
            </Text>
        </View>
    )
}

const AttendanceSummary = () => {
    const report = queryClient.getQueryData(['OverallAttendenceReport']) ?? {}

    return (
        <View className="flex-1 bg-primary">
            <Header title="Attendance Summary" />
            <LeaderBoard comparison={report?.comparison} />

            <ShortSummary summary={report?.summary} projections={report?.projections} time_analysis={report?.time_analysis} />

        </View>
    );
};

export default AttendanceSummary;