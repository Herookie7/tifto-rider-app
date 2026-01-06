import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Alert, Platform } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { CREATE_HOLIDAY_REQUEST } from "@/lib/apollo/mutations/rider.mutation";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "expo-router";

export default function HolidayRequestScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation();

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [reason, setReason] = useState("");

    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [createHolidayRequest, { loading }] = useMutation(CREATE_HOLIDAY_REQUEST, {
        onCompleted: () => {
            Alert.alert(t("Success"), t("Holiday request submitted successfully"), [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        },
        onError: (error) => {
            Alert.alert(t("Error"), error.message || t("Something went wrong"));
        }
    });

    const submitRequest = () => {
        if (!startDate || !endDate || !reason) {
            Alert.alert(t("Error"), t("Please fill all fields"));
            return;
        }

        createHolidayRequest({
            variables: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                reason
            }
        });
    };

    const onChangeStart = (event: any, selectedDate?: Date) => {
        setShowStartPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const onChangeEnd = (event: any, selectedDate?: Date) => {
        setShowEndPicker(Platform.OS === 'ios');
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    return (
        <View className="flex-1 p-4 bg-white">
            <Text className="text-xl font-bold mb-4 text-black">{t("Request Holiday")}</Text>

            <View className="mb-4">
                <Text className="mb-1 text-gray-600">{t("Start Date")}</Text>
                <TouchableOpacity
                    className="border border-gray-300 rounded p-3"
                    onPress={() => setShowStartPicker(true)}
                >
                    <Text className="text-black">{startDate.toDateString()}</Text>
                </TouchableOpacity>
                {showStartPicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={onChangeStart}
                        minimumDate={new Date()}
                    />
                )}
            </View>

            <View className="mb-4">
                <Text className="mb-1 text-gray-600">{t("End Date")}</Text>
                <TouchableOpacity
                    className="border border-gray-300 rounded p-3"
                    onPress={() => setShowEndPicker(true)}
                >
                    <Text className="text-black">{endDate.toDateString()}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={onChangeEnd}
                        minimumDate={startDate}
                    />
                )}
            </View>

            <View className="mb-4">
                <Text className="mb-1 text-gray-600">{t("Reason")}</Text>
                <TextInput
                    className="border border-gray-300 rounded p-2 h-24 text-black"
                    multiline
                    textAlignVertical="top"
                    placeholder={t("Brief reason for leave...")}
                    placeholderTextColor="#9CA3AF"
                    value={reason}
                    onChangeText={setReason}
                />
            </View>

            <TouchableOpacity
                className={`bg-orange-500 rounded-full py-3 items-center mt-4 ${loading ? 'opacity-50' : ''}`}
                onPress={submitRequest}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white font-bold text-lg">{t("Submit Request")}</Text>
                )}
            </TouchableOpacity>
        </View>
    );
}
