interface Props {
  size?: number;
}

const MessageResponseIcon = ({ size = 24 }: Props) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M10 8.26667V4L3 11.4667L10 18.9333V14.56C15 14.56 18.5 16.2667 21 20C20 14.6667 17 9.33333 10 8.26667Z" fill="currentColor"></path>
    </svg>
  );
};

export default MessageResponseIcon;
