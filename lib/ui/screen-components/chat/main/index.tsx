// Core
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

// Gifted Chat
import { useApptheme } from "@/lib/context/global/theme.context";
import { useChatScreen } from "@/lib/hooks/useChat";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

export default function ChatMain() {
  // Hooks
  const { appTheme, currentTheme } = useApptheme();
  const { t } = useTranslation();
  const {
    messages,
    onSend,
    inputMessage,
    setInputMessage,
    profile,
    hasOrderId,
  } = useChatScreen();

  const renderSend = () => {
    return (
      <View className="m-2">
        <Ionicons
          width={30}
          height={30}
          name="send"
          color={appTheme.primary}
          onPress={() => {
            if (inputMessage?.trim()) {
              onSend();
            }
          }}
        />
      </View>
    );
  };

  const renderBubble = (props: React.ComponentProps<typeof Bubble>) => {
    return (
      <Bubble
        {...props}
        textStyle={{
          right: {
            color: appTheme.fontMainColor,
            borderWidth: currentTheme === "dark" ? 1 : 0,
            borderColor: appTheme.borderLineColor,
            borderRadius: 12,
            paddingVertical: 4,
            paddingHorizontal: 15,
            alignItems: "center",
            justifyContent: "center",
          },
          left: {
            color: appTheme.fontMainColor,
          },
        }}
        wrapperStyle={{
          right: {
            ...styles.bubbleRight,
            backgroundColor: appTheme.themeBackground,
          },
          left: { ...styles.bubbleLeft, backgroundColor: appTheme.primary },
        }}
        usernameStyle={{ color: appTheme.fontMainColor }}
      />
    );
  };

  const scrollToBottomComponent = () => {
    return (
      <FontAwesome
        name="angle-double-down"
        size={22}
        color={appTheme.primary}
      />
    );
  };

  const renderChatEmpty = () => {
    return (
      <View className="flex-1 justify-center items-center mt-[300px]">
        <FontAwesome
          name="comments"
          size={48}
          color={appTheme.fontSecondColor}
        />
      </View>
    );
  };

  if (!hasOrderId) {
    return (
      <View
        className="flex-1 justify-center items-center p-6"
        style={{ backgroundColor: appTheme.screenBackground }}
      >
        <Ionicons
          name="chatbubble-outline"
          size={64}
          color={appTheme.fontSecondColor}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <View
        className="flex-1"
        style={[
          styles.chatContainer,
          { backgroundColor: appTheme.screenBackground },
        ]}
      >
        <GiftedChat
          messages={messages}
          user={{
            _id: profile?._id ?? "",
            name: profile?.name ?? "",
          }}
          renderBubble={renderBubble}
          renderSend={renderSend}
          onSend={(msg) => {
            const text = msg?.[0]?.text;
            if (text) onSend(text);
          }}
          scrollToBottom
          scrollToBottomComponent={scrollToBottomComponent}
          renderAvatar={null}
          renderUsernameOnMessage
          renderChatEmpty={renderChatEmpty}
          inverted={Platform.OS !== "web" || messages.length === 0}
          timeTextStyle={{
            left: { color: appTheme.fontMainColor },
            right: { color: appTheme.primary },
          }}
          placeholder={t("Chats Here")}
          text={inputMessage ?? ""}
          messagesContainerStyle={{
            backgroundColor: appTheme.screenBackground,
          }}
          onInputTextChanged={(m) => setInputMessage(String(m ?? ""))}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  chatContainer: {
    marginBottom: 0,
  },
  bubbleRight: {
    padding: 5,
    marginBottom: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 0,
  },
  bubbleLeft: {
    padding: 5,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 15,
  },
});
