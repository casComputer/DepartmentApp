import { useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator
} from "react-native";
import * as Sharing from "expo-sharing";
import DateTimePickerAndroid from "@react-native-community/datetimepicker";
import { FontAwesome6, Octicons, FontAwesome } from "@icons";

import Header from "@components/common/Header";

import { getAttendanceXl } from "@controller/teacher/attendance.controller.js";

import { useAppStore } from "@store/app.store.js";

import { downloadFile, checkFileExists } from "@utils/file.js";
import getMimeType from "@utils/getMimeType.js";

const GenerateReport = () => {
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState({});

    const course = useAppStore(state => state.user.in_charge_course);
    const year = useAppStore(state => state.user.in_charge_year);

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
            message = ""
        } = await getAttendanceXl({
            course,
            year,
            month: date.getMonth(),
            calendarYear: date.getFullYear()
        });
        setGenerating(false);

        if (success) {
            const existPdf = await checkFileExists(filename + ".pdf");
            const existXl = await checkFileExists(filename + ".xlsx");

            setResult({
                pdf: {
                    url: pdf_url,
                    filename: filename,
                    exists: existPdf.exists
                },
                xl: {
                    url: xl_url,
                    filename: filename,
                    exists: existXl.exists
                },
                message
            });
        }
    };

    const handleDownload = async type => {
        if (type === "pdf" && result.pdf?.url?.trim()) {
            const done = await downloadFile(
                result.pdf?.url,
                "pdf",
                result.pdf?.filename + ".pdf",
                false
            );

            if (done)
                setResult(p => ({
                    ...p,
                    pdf: { ...p.pdf, exists: true }
                }));
        } else if (type === "xl" && result.xl?.url?.trim()) {
            const done = await downloadFile(
                result.xl?.url,
                "xlsx",
                result.xl?.filename + ".xlsx",
                false
            );

            if (done)
                setResult(p => ({
                    ...p,
                    xl: { ...p.xl, exists: true }
                }));
        }
    };

    const openFile = async type => {
        if (type === "pdf")
            await downloadFile(
                result.pdf?.url,
                "pdf",
                result.pdf?.filename + ".pdf",
                true
            );
        else if (type === "xl")
            await downloadFile(
                result.xl?.url,
                "xlsx",
                result.xl?.filename + ".xlsx",
                true
            );
    };

    const shareFile = async type => {
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
            ToastAndroid.show(
                "Sharing is not available on this device",
                ToastAndroid.SHORT
            );
            return;
        }

        if (type === "pdf") {
            const mimeType = getMimeType("pdf");
            const { foundUri } = await checkFileExists(
                result.pdf.filename + ".pdf"
            );

            if (foundUri) {
                await Sharing.shareAsync(foundUri, {
                    mimeType: "audio/mpeg",
                    dialogTitle: "Share via WhatsApp"
                });
            } else
                ToastAndroid.show(
                    "Unable to share the file",
                    ToastAndroid.SHORT
                );
        }
    };

    return (
        <ScrollView className="grow bg-primary">
            <Header title={"Generate Report"} />
            <Text className="text-xl font-black mt-3 px-4 text-center text-text-secondary">
                GENERATE ATTENDANCE REPORT FOR {dateText}
            </Text>

            <TouchableOpacity onPress={() => setShowPicker(true)}>
                <Text className="text-xl font-bold text-center text-blue-500">
                    Change Date
                </Text>
            </TouchableOpacity>

            {result.message ? (
                <>
                    <Text className="text-red-300 text-md mt-4 font-bold text-center">
                        {result.message}
                    </Text>
                    <TouchableOpacity>
                        <Text className="text-red-500 my-1 mb-3 text-xl font-black text-center">
                            Delete Report
                        </Text>
                    </TouchableOpacity>
                </>
            ) : null}

            {result.pdf?.url && (
                <View className="mt-3 flex-row items-center justify-between py-3 px-4">
                    <View className="flex-row items-center w-[75%]">
                        <FontAwesome6 name="file-pdf" size={25} />
                        <Text className="w-full text-text font-bold pl-2">
                            {result.pdf?.filename}.pdf
                        </Text>
                    </View>
                    {!result.pdf?.exists ? (
                        <TouchableOpacity onPress={() => handleDownload("pdf")}>
                            <Octicons name="download" size={24} />
                        </TouchableOpacity>
                    ) : (
                        <View className="flex-row items-center gap-3">
                            <TouchableOpacity onPress={() => shareFile("pdf")}>
                                <Text className="text-green-500 text-lg font-bold">
                                    Share
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openFile("pdf")}>
                                <Text className="text-blue-500 text-lg font-bold">
                                    Open
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            {result.xl?.url && (
                <View className="flex-row items-center justify-between py-3 px-4">
                    <View className="flex-row items-center w-[75%]">
                        <FontAwesome name="file-excel-o" size={24} />
                        <Text
                            numberOfLines={1}
                            adjustsFontSizeToFit
                            className="w-full text-text font-bold pl-3"
                        >
                            {result.xl?.filename}.xlsx
                        </Text>
                    </View>
                    {!result.xl?.exists ? (
                        <TouchableOpacity onPress={() => handleDownload("xl")}>
                            <Octicons name="download" size={24} />
                        </TouchableOpacity>
                    ) : (
                        <View className="flex-row items-center gap-3">
                            <TouchableOpacity onPress={() => shareFile("xl")}>
                                <Text className="text-green-500 text-lg font-bold">
                                    Share
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => openFile("xl")}>
                                <Text className="text-blue-500 text-lg font-bold">
                                    Open
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}

            <TouchableOpacity
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
                            right: "20%"
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
