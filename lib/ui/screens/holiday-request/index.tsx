import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    Platform,
} from 'react-native';
import { useMutation } from '@apollo/client';
import { CREATE_HOLIDAY_REQUEST } from '@/lib/apollo/mutations/rider.mutation';
import { useTheme } from '@/lib/hooks/useTheme';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function HolidayRequestScreen() {
    const { colors } = useTheme();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [reason, setReason] = useState('');
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    const [createHolidayRequest, { loading }] = useMutation(CREATE_HOLIDAY_REQUEST, {
        onCompleted: (data) => {
            Alert.alert('Success', 'Holiday request submitted successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        },
        onError: (error) => {
            Alert.alert('Error', error.message);
        }
    });

    const handleSubmit = async () => {
        if (endDate < startDate) {
            Alert.alert('Invalid Dates', 'End date must be after start date');
            return;
        }

        await createHolidayRequest({
            variables: {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                reason: reason.trim() || null
            }
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.title, { color: colors.text }]}>Request Holiday/Leave</Text>

            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Start Date</Text>
                <TouchableOpacity
                    style={[styles.dateButton, { backgroundColor: colors.card }]}
                    onPress={() => setShowStartPicker(true)}
                >
                    <Text style={[styles.dateText, { color: colors.text }]}>
                        {formatDate(startDate)}
                    </Text>
                </TouchableOpacity>
                {showStartPicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        minimumDate={new Date()}
                        onChange={(event, date) => {
                            setShowStartPicker(Platform.OS === 'ios');
                            if (date) setStartDate(date);
                        }}
                    />
                )}
            </View>

            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>End Date</Text>
                <TouchableOpacity
                    style={[styles.dateButton, { backgroundColor: colors.card }]}
                    onPress={() => setShowEndPicker(true)}
                >
                    <Text style={[styles.dateText, { color: colors.text }]}>
                        {formatDate(endDate)}
                    </Text>
                </TouchableOpacity>
                {showEndPicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        minimumDate={startDate}
                        onChange={(event, date) => {
                            setShowEndPicker(Platform.OS === 'ios');
                            if (date) setEndDate(date);
                        }}
                    />
                )}
            </View>

            <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Reason (Optional)</Text>
                <TextInput
                    style={[styles.textInput, { backgroundColor: colors.card, color: colors.text }]}
                    placeholder="Enter reason for leave..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={4}
                    value={reason}
                    onChangeText={setReason}
                />
            </View>

            <TouchableOpacity
                style={[styles.submitButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.submitButtonText}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    dateButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        fontWeight: '600',
    },
    textInput: {
        padding: 15,
        borderRadius: 10,
        textAlignVertical: 'top',
        minHeight: 100,
        fontSize: 16,
    },
    submitButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
