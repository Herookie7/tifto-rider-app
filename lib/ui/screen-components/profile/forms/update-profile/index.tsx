// Core
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Keyboard,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
} from "react-native";

// Components
import { CustomContinueButton } from "@/lib/ui/useable-components";
import FormHeader from "../form-header";

// Flash Message
import { showMessage } from "react-native-flash-message";

// GraphQL
import { EDIT_RIDER } from "@/lib/apollo/mutations/rider.mutation";
import { RIDER_PROFILE } from "@/lib/apollo/queries";

// Types & Interfaces
import { TRiderProfileBottomBarBit } from "@/lib/utils/types/rider";

// Hooks
import { useApptheme } from "@/lib/context/global/theme.context";
import { useUserContext } from "@/lib/context/global/user.context";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

export default function UpdateProfileForm({
    setIsFormOpened,
}: {
    setIsFormOpened: Dispatch<SetStateAction<TRiderProfileBottomBarBit>>;
}) {
    // Hooks
    const { t } = useTranslation();
    const { userId, dataProfile } = useUserContext();
    const { appTheme } = useApptheme();

    // States
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
    });

    // Mutations
    const [mutateRider] = useMutation(EDIT_RIDER, {
        onError: (error) => {
            showMessage({
                message: error.message || t("Failed to update profile"),
                type: "danger",
            });
            console.log("Failed to update profile", error);
        },
        onCompleted: () => {
            setIsLoading(false);
            showMessage({
                message: t("Profile updated successfully"),
                type: "success",
            });
            setIsFormOpened(null);
        },
        refetchQueries: [{ query: RIDER_PROFILE, variables: { id: userId } }],
    });

    const handleInputChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        try {
            if (!formData.name) {
                return showMessage({
                    message: t("Please enter your name"),
                    type: "danger",
                });
            }
            if (!formData.phone) {
                return showMessage({
                    message: t("Please enter your phone number"),
                    type: "danger",
                });
            }

            setIsLoading(true);
            await mutateRider({
                variables: {
                    riderInput: {
                        _id: userId,
                        name: formData.name,
                        phone: formData.phone,
                    },
                },
            });
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setFormData({
            name: dataProfile?.name ?? "",
            phone: dataProfile?.phone ?? "",
        });
    }, [dataProfile]);

    return (
        <View className="w-full">
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View className="flex flex-col justify-between w-full p-2 h-[90%] mt-0 ">
                    <FormHeader title={t("Edit Profile")} />
                    <View>
                        <View className="flex flex-col w-full my-2">
                            <Text style={{ color: appTheme.fontMainColor }}>
                                {t("Name")}
                            </Text>
                            <TextInput
                                value={formData.name}
                                onChangeText={(text) => handleInputChange("name", text)}
                                style={{
                                    borderColor: appTheme.borderLineColor,
                                    color: appTheme.fontMainColor,
                                }}
                                className="w-full rounded-md border p-3 my-2"
                            />
                        </View>

                        <View className="flex flex-col w-full my-2">
                            <Text style={{ color: appTheme.fontMainColor }}>
                                {t("Phone")}
                            </Text>
                            <TextInput
                                value={formData.phone}
                                onChangeText={(text) => handleInputChange("phone", text)}
                                style={{
                                    borderColor: appTheme.borderLineColor,
                                    color: appTheme.fontMainColor,
                                }}
                                keyboardType="phone-pad"
                                className="w-full rounded-md border p-3 my-2"
                            />
                        </View>

                        <View>
                            <CustomContinueButton
                                title={isLoading ? t("Please wait") : t("Update")}
                                onPress={handleSubmit}
                                disabled={isLoading}
                            />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
}
