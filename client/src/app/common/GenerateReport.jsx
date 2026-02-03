import { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    ToastAndroid
} from "react-native";

import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import { FontAwesome6, Octicons, FontAwesome } from "@icons";

import Header from "@components/common/Header";
import Toggle from "@components/common/Toggle";

import {
    getAttendanceXl,
    deleteReport
} from "@controller/teacher/attendance.controller.js";

import { useAppStore } from "@store/app.store.js";

import {
    downloadFile,
    checkFileExists,
    deleteFileEverywhere,
    downloadToSAF
} from "@utils/file.js";
import { openFile, shareFile } from "@utils/generateReport.js";
import confirm from "@utils/confirm.js";

const formatMonthYear = date =>
    `${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;

const ReportFileItem = ({
    icon,
    filename,
    exists,
    onDownload,
    onOpen,
    onShare
}) => (
    <View className="flex-row items-center justify-between py-3 px-4">
        <View className="flex-row items-center w-[75%]">
            {icon}
            <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                className="w-full text-text font-bold pl-3"
            >
                {filename}
            </Text>
        </View>

        {!exists ? (
            <TouchableOpacity onPress={onDownload}>
                <Octicons name="download" size={24} />
            </TouchableOpacity>
        ) : (
            <View className="flex-row items-center gap-3">
                <TouchableOpacity onPress={onShare}>
                    <Text className="text-green-500 text-lg font-bold">
                        Share
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onOpen}>
                    <Text className="text-blue-500 text-lg font-bold">
                        Open
                    </Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
);

const Selector = ({
    toggler,
    setToggler,
    dateText,
    onSinglePress,
    onStartPress,
    onEndPress
}) => (
    <View className="px-3">
        <Toggle text1={"month"} text2={"sem"} onChange={setToggler} />

        <Text className="text-xl font-black mt-3 px-4 text-center text-text-secondary">
            GENERATE ATTENDANCE REPORT FOR {dateText}
        </Text>

        {toggler === 0 ? (
            <TouchableOpacity onPress={onSinglePress}>
                <Text className="text-xl font-bold text-center text-blue-500">
                    Change Month
                </Text>
            </TouchableOpacity>
        ) : (
            <View className="flex-row items-center justify-center gap-15">
                <TouchableOpacity onPress={onStartPress}>
                    <Text className="text-xl font-bold text-blue-500">
                        Start Month
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onEndPress}>
                    <Text className="text-xl font-bold text-blue-500">
                        End Month
                    </Text>
                </TouchableOpacity>
            </View>
        )}
    </View>
);

const GenerateReport = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [showPicker, setShowPicker] = useState(false);
    const [activePicker, setActivePicker] = useState(null); // single | start | end

    const [generating, setGenerating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [result, setResult] = useState({});
    const [toggler, setToggler] = useState(0);

    const course = useAppStore(state => state.user.in_charge_course);
    const year = useAppStore(state => state.user.in_charge_year);

    const dateText =
        toggler === 0
            ? formatMonthYear(startDate)
            : `${formatMonthYear(startDate)} → ${formatMonthYear(endDate)}`;

    const handleGeneration = async () => {
        if (!year || !course) return;
        setGenerating(true);

        const payload =
            toggler === 0
                ? {
                      course,
                      year,
                      startMonth: startDate.getMonth(),
                      startYear: startDate.getFullYear(),
                      endMonth: startDate.getMonth(),
                      endYear: startDate.getFullYear()
                  }
                : {
                      course,
                      year,
                      startMonth: startDate.getMonth(),
                      startYear: startDate.getFullYear(),
                      endMonth: endDate.getMonth(),
                      endYear: endDate.getFullYear()
                  };

        const {
            success,
            pdf_url,
            xl_url,
            pdf_public_id,
            xl_public_id,
            filename,
            message = "",
            startYear: startYearRes,
            endYear: endYearRes,
            startMonth: startMonthRes,
            endMonth: endMonthRes
        } = await getAttendanceXl(payload);

        if (success) {
            const existPdf = await checkFileExists(filename + ".pdf");
            const existXl = await checkFileExists(filename + ".xlsx");

            setResult({
                pdf: {
                    url: pdf_url,
                    publicId: pdf_public_id,
                    exists: existPdf.exists && existPdf.contentUri
                },
                xl: {
                    url: xl_url,
                    publicId: xl_public_id,
                    exists: existXl.exists && existXl.contentUri
                },
                filename,
                message,
                startYear: startYearRes,
                endYear: endYearRes,
                startMonth: startMonthRes,
                endMonth: endMonthRes
            });
        }

        setGenerating(false);
    };

    const handleDownload = async type => {
        ToastAndroid.show("Downloading...", ToastAndroid.SHORT);

        const file = type === "pdf" ? result.pdf : result.xl;
        if (!file?.url) return;

        const res = await downloadFile(
            file.url,
            type === "pdf" ? "pdf" : "xlsx",
            `${result.filename}.${ext}`,
            false
        );

        if (res.success && res.contentUri) {
            setResult(p => ({
                ...p,
                [type]: { ...p[type], exists: true }
            }));
        }
    };

    const handleDeleteReport = () => {
        confirm("Are you sure to delete this record ?", async () => {
            setDeleting(true);

            const { success, message } = await deleteReport({
                year,
                course,
                startMonth: result.startMonth,
                endMonth: result.endMonth,
                pdf_public_id: result.pdf?.publicId,
                xl_public_id: report.xl?.publicId
            });

            if (success) {
                await deleteFileEverywhere(result.pdf?.filename + ".pdf");
                await deleteFileEverywhere(result.xl?.filename + ".xlsx");
                setResult({ message });
            }

            setDeleting(false);
        });
    };

    return (
        <ScrollView className="grow bg-primary">
            <Header title={"Generate Report"} />

            <Selector
                toggler={toggler}
                setToggler={setToggler}
                dateText={dateText}
                onSinglePress={() => {
                    setActivePicker("single");
                    setShowPicker(true);
                }}
                onStartPress={() => {
                    setActivePicker("start");
                    setShowPicker(true);
                }}
                onEndPress={() => {
                    setActivePicker("end");
                    setShowPicker(true);
                }}
            />

            {result.message && (
                <>
                    <Text className="text-yellow-300 text-md mt-4 font-bold text-center">
                        {result.message}
                    </Text>

                    {(result.pdf || result.xl) && (
                        <TouchableOpacity
                            disabled={deleting}
                            onPress={handleDeleteReport}
                        >
                            <Text className="text-red-500 my-1 mb-3 text-xl font-black text-center">
                                {deleting ? "Deleting.." : "Delete Report"}
                            </Text>
                        </TouchableOpacity>
                    )}
                </>
            )}

            {result.pdf?.url && (
                <ReportFileItem
                    icon={<FontAwesome6 name="file-pdf" size={25} />}
                    filename={`${result.filename}.pdf`}
                    exists={result.pdf.exists}
                    onDownload={() => handleDownload("pdf")}
                    onOpen={() => openFile("pdf", result.filename)}
                    onShare={() => shareFile("pdf", result.filename)}
                />
            )}

            {result.xl?.url && (
                <ReportFileItem
                    icon={<FontAwesome name="file-excel-o" size={24} />}
                    filename={`${result.filename}.xlsx`}
                    exists={result.xl.exists}
                    onDownload={() => handleDownload("xl")}
                    onOpen={() => openFile("xl", result.filename)}
                    onShare={() => shareFile("xl", result.filename)}
                />
            )}

            <TouchableOpacity
                disabled={generating}
                className="py-5 bg-btn rounded-2xl mt-8 mx-3 justify-center items-center"
                onPress={handleGeneration}
            >
                <Text className="text-xl font-bold text-center text-text">
                    {generating ? "Generating" : "Generate"} Report
                </Text>

                {generating && (
                    <ActivityIndicator
                        style={{ position: "absolute", right: "20%" }}
                    />
                )}
            </TouchableOpacity>

            {showPicker && (
                <DateTimePickerAndroid
                    mode="date"
                    value={activePicker === "end" ? endDate : startDate}
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (event.type !== "set" || !selectedDate) return;

                        if (activePicker === "single") {
                            setStartDate(selectedDate);
                            setEndDate(selectedDate);
                        }

                        if (activePicker === "start") {
                            setStartDate(selectedDate);
                            if (selectedDate > endDate) {
                                setEndDate(selectedDate);
                            }
                        }

                        if (
                            activePicker === "end" &&
                            selectedDate >= startDate
                        ) {
                            setEndDate(selectedDate);
                        }

                        setActivePicker(null);
                    }}
                />
            )}
        </ScrollView>
    );
};

export default GenerateReport;
