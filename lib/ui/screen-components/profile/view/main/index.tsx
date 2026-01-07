import { useApptheme } from "@/lib/context/global/theme.context";
import { IRiderProfileMainProps } from "@/lib/utils/interfaces/rider-profile.interface";
import { View } from "react-native";
import DocumentsSection from "../docs/documents";
import OtherDetailsSection from "../docs/other";
import UpdateProfileForm from "../../forms/update-profile";

export default function ProfileMain({
  setIsFormOpened,
  isFormOpened,
}: IRiderProfileMainProps & { isFormOpened: TRiderProfileBottomBarBit }) {
  // Hooks
  const { appTheme } = useApptheme();
  return (
    <View
      className="flex flex-col h-full items-center"
      style={{ backgroundColor: appTheme.screenBackground }}
    >
      <DocumentsSection setIsFormOpened={setIsFormOpened} />
      <OtherDetailsSection setIsFormOpened={setIsFormOpened} />
      {isFormOpened === "PROFILE_FORM" && (
        <UpdateProfileForm setIsFormOpened={setIsFormOpened} />
      )}
    </View>
  );
}
