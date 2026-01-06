import { View, Text, TouchableOpacity, Linking, Modal, TextInput, Alert, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useApptheme } from "@/lib/context/global/theme.context";
import { useMutation } from "@apollo/client";
import { ASSIGN_SUBSCRIPTION_DELIVERY, UPDATE_SUBSCRIPTION_DELIVERY_STATUS } from "@/lib/apollo/mutations/rider.mutation";
import { GET_PENDING_DELIVERIES_FOR_ZONE, GET_RIDER_ASSIGNMENTS } from "@/lib/apollo/queries/subscription-delivery.query";
import { calculateDistance } from "@/lib/utils/methods/custom-functions";
import { useState } from "react";
import SpinnerComponent from "@/lib/ui/useable-components/spinner";
import { IconSymbol } from "@/lib/ui/useable-components/IconSymbol";
import { BikeRidingIcon } from "@/lib/ui/useable-components/svg";

interface ITiffinCardProps {
    delivery: any;
}

const TiffinCard = ({ delivery }: ITiffinCardProps) => {
    const { t } = useTranslation();
    const { appTheme } = useApptheme();
    const [modalVisible, setModalVisible] = useState(false);
    const [exceptionReason, setExceptionReason] = useState("");

    // Refresh queries: Assignments and Pending
    const refreshQueries = [
        { query: GET_PENDING_DELIVERIES_FOR_ZONE },
        { query: GET_RIDER_ASSIGNMENTS }
    ];

    const [assignDelivery, { loading: loadingAssign }] = useMutation(ASSIGN_SUBSCRIPTION_DELIVERY, {
        refetchQueries: refreshQueries,
        onError: (error) => {
            console.error("Error assigning delivery:", error);
        }
    });

    const [updateStatus, { loading: loadingUpdate }] = useMutation(UPDATE_SUBSCRIPTION_DELIVERY_STATUS, {
        refetchQueries: refreshQueries,
        onCompleted: () => {
            setModalVisible(false);
            setExceptionReason("");
        },
        onError: (error) => {
            console.error("Error updating delivery:", error);
        }
    });

    const restaurant = delivery.subscriptionId.restaurantId;
    const user = delivery.subscriptionId.user;

    // Calculate distance from Restaurant to Customer
    const distance = restaurant?.location?.coordinates && user?.location?.coordinates ?
        calculateDistance(
            Number(restaurant.location.coordinates[0]), // Longitude
            Number(restaurant.location.coordinates[1]), // Latitude
            Number(user.location.coordinates[0]),
            Number(user.location.coordinates[1])
        ) : 0;

    const openMap = (lat: number, lng: number) => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url).catch(err => console.error("Error opening maps:", err));
    };

    const handleAction = async () => {
        if (delivery.status === 'PREPARED') {
            await assignDelivery({ variables: { deliveryId: delivery._id } });
        } else if (delivery.status === 'DISPATCHED' || delivery.status === 'ASSIGNED') { // Assuming Dispatched/Assigned = Rider Accepted
            await updateStatus({ variables: { deliveryId: delivery._id, status: 'OUT_FOR_DELIVERY' } });
        } else if (delivery.status === 'OUT_FOR_DELIVERY') {
            await updateStatus({ variables: { deliveryId: delivery._id, status: 'DELIVERED' } });
        }
    };

    const handleException = async () => {
        if (!exceptionReason.trim()) {
            Alert.alert("Required", "Please provide a reason.");
            return;
        }
        await updateStatus({
            variables: {
                deliveryId: delivery._id,
                status: 'CANCELLED', // or SKIPPED
                reason: exceptionReason
            }
        });
    };

    const renderButtonLabel = () => {
        if (loadingAssign || loadingUpdate) return "Processing...";
        switch (delivery.status) {
            case 'PREPARED': return t("Accept");
            case 'DISPATCHED':
            case 'ASSIGNED': return t("Start Delivery (Picked Up)");
            case 'OUT_FOR_DELIVERY': return t("Mark Delivered");
            default: return delivery.status;
        }
    };

    const getStatusColor = () => {
        switch (delivery.status) {
            case 'PREPARED': return "bg-blue-500";
            case 'DISPATCHED':
            case 'ASSIGNED': return "bg-orange-500";
            case 'OUT_FOR_DELIVERY': return "bg-purple-500";
            default: return "bg-gray-500";
        }
    };

    const isLoading = loadingAssign || loadingUpdate;

    return (
        <View
            className="flex-1 gap-y-4 border border-1 rounded-[8px] m-4 p-4"
            style={{
                backgroundColor: appTheme.themeBackground,
                borderColor: appTheme.borderLineColor,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5
            }}
        >
            {/* Header: Status & Type */}
            <View className="flex-1 flex-row justify-between items-center">
                <View className="px-2 py-1 rounded bg-orange-100 border border-orange-300">
                    <Text className="text-orange-600 font-semibold text-xs">{t("TIFFIN")}</Text>
                </View>
                <View className="px-2 py-1 rounded bg-green-100 border border-green-300">
                    <Text className="text-green-600 font-semibold text-xs">{delivery.status.replace(/_/g, " ")}</Text>
                </View>
            </View>

            {/* Restaurant Info */}
            <View className="flex-row items-center gap-x-2">
                <IconSymbol name="apartment" size={24} color={appTheme.fontMainColor} />
                <View className="flex-1">
                    <Text className="font-bold text-base" style={{ color: appTheme.fontMainColor }}>
                        {restaurant.name}
                    </Text>
                    <Text className="text-sm" style={{ color: appTheme.fontSecondColor }}>
                        {restaurant.address}
                    </Text>
                </View>
            </View>

            {/* Customer Info */}
            <View className="flex-row items-center gap-x-2">
                <IconSymbol name="home" size={24} color={appTheme.fontMainColor} />
                <View className="flex-1">
                    <Text className="font-bold text-base" style={{ color: appTheme.fontMainColor }}>
                        {user.name}
                    </Text>
                    <Text className="text-sm" style={{ color: appTheme.fontSecondColor }}>
                        {user.location?.address || user.addressBook?.[0]?.deliveryAddress || "No address provided"}
                    </Text>
                </View>
            </View>

            {/* Distance */}
            <View className="flex-row items-center gap-x-1">
                <BikeRidingIcon color="#6b7280" />
                <Text style={{ color: appTheme.fontMainColor }}>
                    {distance.toFixed(2)} km {t("Total")}
                </Text>
            </View>

            {/* Navigation Buttons */}
            {(delivery.status === 'DISPATCHED' || delivery.status === 'ASSIGNED' || delivery.status === 'OUT_FOR_DELIVERY') && (
                <View className="flex-row gap-2 mt-2">
                    {(delivery.status === 'DISPATCHED' || delivery.status === 'ASSIGNED') && restaurant?.location?.coordinates && (
                        <TouchableOpacity
                            onPress={() => openMap(restaurant.location.coordinates[1], restaurant.location.coordinates[0])}
                            className="flex-1 bg-green-100 py-2 rounded items-center border border-green-200"
                        >
                            <Text className="text-green-800 font-medium">📍 {t("Restaurant")}</Text>
                        </TouchableOpacity>
                    )}
                    {delivery.status === 'OUT_FOR_DELIVERY' && user?.location?.coordinates && (
                        <TouchableOpacity
                            onPress={() => openMap(user.location.coordinates[1], user.location.coordinates[0])}
                            className="flex-1 bg-green-100 py-2 rounded items-center border border-green-200"
                        >
                            <Text className="text-green-800 font-medium">📍 {t("Customer")}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}


            <View className="flex-row gap-2 mt-4">
                {/* Main Action Button */}
                <TouchableOpacity
                    onPress={handleAction}
                    disabled={isLoading}
                    style={{ backgroundColor: isLoading ? '#ccc' : undefined }}
                    className={`flex-1 ${getStatusColor()} py-3 rounded-lg items-center`}
                >
                    {isLoading ? (
                        <SpinnerComponent />
                    ) : (
                        <Text className="text-white font-bold font-[Inter]">{renderButtonLabel()}</Text>
                    )}
                </TouchableOpacity>

                {/* Exception Button */}
                {(delivery.status === 'DISPATCHED' || delivery.status === 'ASSIGNED' || delivery.status === 'OUT_FOR_DELIVERY') && (
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        className="bg-red-100 px-4 py-3 rounded-lg border border-red-200 justify-center"
                    >
                        <Text className="text-red-600 font-bold">⚠</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Exception Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white m-5 p-5 rounded-xl w-[90%] shadow-xl">
                        <Text className="text-lg font-bold mb-4 text-black">{t("Report Issue / Cannot Deliver")}</Text>
                        <TextInput
                            className="border border-gray-300 rounded p-3 h-24 mb-4 text-start text-black"
                            placeholder={t("Reason (e.g., Customer not home, wrong address)...")}
                            multiline
                            textAlignVertical="top"
                            value={exceptionReason}
                            onChangeText={setExceptionReason}
                            placeholderTextColor="#999"
                        />
                        <View className="flex-row justify-end gap-3">
                            <TouchableOpacity onPress={() => setModalVisible(false)} className="px-4 py-2 rounded bg-gray-200">
                                <Text className="font-semibold text-black">{t("Close")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleException} className="px-4 py-2 rounded bg-red-500">
                                <Text className="text-white font-semibold">{t("Mark Not Delivered")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default TiffinCard;
