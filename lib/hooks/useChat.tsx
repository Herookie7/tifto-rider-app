import { useMutation, useQuery } from "@apollo/client";
import { useLocalSearchParams } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";

// Context
import UserContext from "../context/global/user.context";

// API
import { SEND_CHAT_MESSAGE } from "@/lib/apollo/mutations/chat.mutation";
import { CHAT } from "@/lib/apollo/queries";
import { SUBSCRIPTION_NEW_MESSAGE } from "@/lib/apollo/subscriptions";

export const useChatScreen = () => {
  const params = useLocalSearchParams<{ id?: string }>();
  const orderId = params.id ?? "";

  const { dataProfile } = useContext(UserContext);

  // States
  const [messages, setMessages] = useState<Array<{
    _id: string;
    text: string;
    createdAt: Date;
    user: { _id: string; name: string };
  }>>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [image, setImage] = useState<string[]>([]);

  // API
  const { subscribeToMore: subscribeToMessages, data: chatData } = useQuery(
    CHAT,
    {
      variables: { order: orderId },
      fetchPolicy: "network-only",
      skip: !orderId,
    },
  );
  const [send] = useMutation(SEND_CHAT_MESSAGE, {
    onCompleted,
  });

  function onCompleted(data: { sendChatMessage?: { success: boolean; message: string } }) {
    const messageResult = data?.sendChatMessage;
    if (messageResult && !messageResult.success) {
      Alert.alert("Error", messageResult.message);
    }
  }

  const onSend = (messageText?: string) => {
    if (!orderId) return;
    const textToSend = (messageText ?? inputMessage).trim();
    if (!textToSend) return;
    send({
      variables: {
        orderId: String(orderId),
        messageInput: {
          message: textToSend,
          user: {
            id: String(dataProfile?._id),
            name: String(dataProfile?.name),
          },
        },
      },
    });
    setInputMessage("");
    setImage([]);
  };

  useEffect(() => {
    if (!orderId) return;
    const unsubscribe = subscribeToMessages({
      document: SUBSCRIPTION_NEW_MESSAGE,
      variables: { order: orderId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newMessage = subscriptionData.data.subscriptionNewMessage;
        if (!newMessage) return prev;
        return {
          chat: [newMessage, ...(prev?.chat ?? [])],
        };
      },
    });
    return unsubscribe;
  }, [orderId, subscribeToMessages]);

  useEffect(() => {
    const chat = chatData?.chat ?? [];
    setMessages(
      chat.map((message: {
        id?: string;
        message?: string;
        createdAt?: Date;
        user?: { id?: string; name?: string };
      }) => ({
        _id: message?.id ?? "",
        text: message?.message ?? "",
        createdAt: message.createdAt ?? new Date(),
        user: {
          _id: message?.user?.id ?? "",
          name: message?.user?.name ?? "",
        },
      })),
    );
  }, [chatData]);

  return {
    messages,
    onSend,
    image,
    setImage,
    inputMessage,
    setInputMessage,
    profile: dataProfile,
    hasOrderId: !!orderId,
  };
};
