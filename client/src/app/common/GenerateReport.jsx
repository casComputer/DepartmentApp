import { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    ToastAndroid,
} from "react-native";

import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import { FontAwesome6, Octicons, FontAwesome } from "@icons";

import Header from "@components/common/Header";
import Toggle from "@components/common/Toggle";

import {
    getAttendanceXl,
    deleteReport,
} from "@controller/teacher/attendance.controller.js";

import { useAppStore } from "@store/app.store.js";

import {
    downloadFile,
    checkFileExists,
    openFileWithDefaultApp,
    deleteIfExists,
} from "@utils/file.js";
import { openFile, shareFile } from "@utils/generateReport.js";
import confirm from "@utils/confirm.js";

const ReportFileItem = ({
    icon,
    filename,
    exists,
    onDownload,
    onOpen,
    onShare,
}) => {
    return (
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
};

const Selector = ({ dateText, setShowPicker, toggler, setToggler }) => {
    console.log(toggler);

    return (
        <View className="px-3">
            <Toggle text1={"month"} text2={"sem"} onChange={setToggler} />

            <Text className="text-xl font-black mt-3 px-4 text-center text-text-secondary">
                GENERATE ATTENDANCE REPORT FOR {dateText}
            </Text>

            {toggler === 0 ? (
                <TouchableOpacity onPress={() => setShowPicker(true)}>
                    <Text className="text-xl font-bold text-center text-blue-500">
                        Change Date
                    </Text>
                </TouchableOpacity>
            ) : (
                <View className="flex-row items-center justify-center gap-15 mt-2">
                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <Text className="text-xl font-bold text-center text-blue-500">
                            Start Date
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setShowPicker(true)}>
                        <Text className="text-xl font-bold text-center text-blue-500">
                            End Date
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const GenerateReport = () => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [result, setResult] = useState({});
    const [toggler, setToggler] = useState(0);

    const course = useAppStore((state) => state.user.in_charge_course);
    const year = useAppStore((state) => state.user.in_charge_year);

    const dateText =
        (date.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        date.getFullYear();

    const handleGeneration = async () => {
        if (!year || !course || !date) return;
        setGenerating(true);

        const {
            success,
            pdf_url,
            xl_url,
            filename,
            message = "",
        } = await getAttendanceXl({
            course,
            year,
            month: date.getMonth(),
            calendarYear: date.getFullYear(),
        });

        if (success) {
            const existPdf = await checkFileExists(filename + ".pdf");
            const existXl = await checkFileExists(filename + ".xlsx");

            setResult({
                pdf: {
                    url: pdf_url,
                    filename: filename,
                    exists: existPdf.exists && existPdf.contentUri,
                },
                xl: {
                    url: xl_url,
                    filename: filename,
                    exists: existXl.exists && existXl.contentUri,
                },
                message,
            });
        }
        setGenerating(false);
    };

    const handleDownload = async (type) => {
        ToastAndroid.show("Downloading...", ToastAndroid.SHORT);
        if (type === "pdf" && result.pdf?.url?.trim()) {
            const downloadRes = await downloadFile(
                result.pdf?.url,
                "pdf",
                result.pdf?.filename + ".pdf",
                false,
            );

            if (downloadRes.success && downloadRes.contentUri)
                setResult((p) => ({
                    ...p,
                    pdf: { ...p.pdf, exists: true },
                }));
        } else if (type === "xl" && result.xl?.url?.trim()) {
            const downloadRes = await downloadFile(
                result.xl?.url,
                "xlsx",
                result.xl?.filename + ".xlsx",
                false,
            );

            if (downloadRes.success && downloadRes.contentUri)
                setResult((p) => ({
                    ...p,
                    xl: { ...p.xl, exists: true },
                }));
        }
    };

    const handleDeleteReport = () => {
        confirm("Are you sure to delete this record ?", async () => {
            setDeleting(true);
            const { success, message } = await deleteReport({
                year,
                course,
                calendarMonth: date.getMonth(),
                calendarYear: date.getFullYear(),
            });
            if (success) {
                await deleteIfExists(null, result.pdf.filename + ".pdf");
                await deleteIfExists(null, result.xl.filename + ".xlsx");

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
                setShowPicker={setShowPicker}
            />

            {result.message ? (
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
            ) : null}

            {result.pdf?.url && (
                <ReportFileItem
                    icon={<FontAwesome6 name="file-pdf" size={25} />}
                    filename={`${result.pdf.filename}.pdf`}
                    exists={result.pdf.exists}
                    onDownload={() => handleDownload("pdf")}
                    onOpen={() => openFile("pdf", result.pdf.filename)}
                    onShare={() => shareFile("pdf", result.pdf.filename)}
                />
            )}

            {result.xl?.url && (
                <ReportFileItem
                    icon={<FontAwesome name="file-excel-o" size={24} />}
                    filename={`${result.xl.filename}.xlsx`}
                    exists={result.xl.exists}
                    onDownload={() => handleDownload("xl")}
                    onOpen={() => openFile("xl", result.xl.filename)}
                    onShare={() => shareFile("xl", result.xl.filename)}
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
                        style={{
                            position: "absolute",
                            right: "20%",
                        }}
                    />
                )}
            </TouchableOpacity>
            {showPicker && (
                <DateTimePickerAndroid
                    mode="date"
                    onChange={(event, selectedDate) => {
                        setShowPicker(false);
                        if (event.type === "set" && selectedDate) {
                            setDate(selectedDate);
                        }
                    }}
                    value={date}
                />
            )}
        </ScrollView>
    );
};

export default GenerateReport;
