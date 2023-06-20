import useMessageContext from "../../../hooks/chat-messages/useMessageContext";
import useMessageReply from "../../../hooks/chat-messages/useMessageReply";
import MessageResponseIcon from "../../Icons/MessageResponseIcon";
import MessageButton from "./MessageButton";

const MessageRespondButton = () => {
  const message = useMessageContext();
  const { setReplyMessageId } = useMessageReply()!;
  const handleClick = () => {
    if (message) setReplyMessageId!(message.id);
  };
  return (
    <MessageButton label="Répondre" action={handleClick}>
      <MessageResponseIcon size={20} />
    </MessageButton>
  );
};

export default MessageRespondButton;
