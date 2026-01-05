// Core
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { ReactNativeModal } from "react-native-modal";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useTranslation } from "react-i18next";

// Components
import { CustomContinueButton } from "@/lib/ui/useable-components";
import { SpinnerComponent } from "@/lib/ui/useable-components/spinner";

interface INotDeliveredModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (reason: string, reasonType: string) => Promise<void>;
  loading?: boolean;
}

const REASON_OPTIONS = [
  { value: "USER_NOT_AVAILABLE", label: "User not available" },
  { value: "WRONG_ADDRESS", label: "Wrong address" },
  { value: "REFUSED_DELIVERY", label: "Refused delivery" },
  { value: "OTHER", label: "Other" },
];

export default function NotDeliveredModal({
  isVisible,
  onClose,
  onSubmit,
  loading = false,
}: INotDeliveredModalProps) {
  const { appTheme } = useApptheme();
  const { t } = useTranslation();
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [customReason, setCustomReason] = useState<string>("");

  const handleSubmit = async () => {
    if (!selectedReason) {
      return;
    }

    const reasonText =
      selectedReason === "OTHER"
        ? customReason.trim()
        : REASON_OPTIONS.find((r) => r.value === selectedReason)?.label || "";

    if (selectedReason === "OTHER" && !reasonText) {
      return;
    }

    await onSubmit(reasonText, selectedReason);
    // Reset form
    setSelectedReason("");
    setCustomReason("");
  };

  return (
    <ReactNativeModal
      isVisible={isVisible}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      onBackdropPress={onClose}
      style={{
        maxHeight: "70%",
        width: "100%",
        backgroundColor: appTheme.themeBackground,
        borderRadius: 20,
        padding: 20,
        margin: 0,
        marginTop: "auto",
        marginBottom: 0,
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-col gap-4">
          <Text
            className="font-bold text-xl text-center mb-2"
            style={{ color: appTheme.fontMainColor }}
          >
            {t("Mark as Not Delivered")}
          </Text>

          <Text
            className="text-base mb-4"
            style={{ color: appTheme.fontSecondColor }}
          >
            {t("Please select a reason why the order could not be delivered:")}
          </Text>

          {REASON_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSelectedReason(option.value)}
              className={`border rounded-lg p-4 ${
                selectedReason === option.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
              style={{
                borderColor:
                  selectedReason === option.value
                    ? appTheme.primary
                    : appTheme.borderLineColor,
                backgroundColor:
                  selectedReason === option.value
                    ? `${appTheme.primary}20`
                    : "transparent",
              }}
            >
              <Text
                className="font-medium"
                style={{
                  color:
                    selectedReason === option.value
                      ? appTheme.primary
                      : appTheme.fontMainColor,
                }}
              >
                {t(option.label)}
              </Text>
            </TouchableOpacity>
          ))}

          {selectedReason === "OTHER" && (
            <View className="mt-2">
              <Text
                className="text-sm mb-2"
                style={{ color: appTheme.fontSecondColor }}
              >
                {t("Please provide details:")}
              </Text>
              <TextInput
                value={customReason}
                onChangeText={setCustomReason}
                placeholder={t("Enter reason...")}
                placeholderTextColor={appTheme.fontSecondColor}
                multiline
                numberOfLines={4}
                className="border rounded-lg p-3"
                style={{
                  borderColor: appTheme.borderLineColor,
                  color: appTheme.fontMainColor,
                  backgroundColor: appTheme.screenBackground,
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
              />
            </View>
          )}

          <View className="flex flex-row gap-3 mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 border rounded-lg p-3 items-center"
              style={{
                borderColor: appTheme.borderLineColor,
              }}
            >
              <Text style={{ color: appTheme.fontMainColor }}>
                {t("Cancel")}
              </Text>
            </TouchableOpacity>

            <View className="flex-1">
              <CustomContinueButton
                title={loading ? t("Submitting...") : t("Submit")}
                disabled={!selectedReason || loading || (selectedReason === "OTHER" && !customReason.trim())}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ReactNativeModal>
  );
}
