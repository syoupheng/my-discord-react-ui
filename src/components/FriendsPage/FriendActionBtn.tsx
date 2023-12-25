import Spinner from "@/components/shared/Spinner";
import TooltipWrapper from "@/components/shared/TooltipWrapper";
import { ComponentProps, ReactNode } from "react";

const hoverColorMap = {
  normal: "hover:text-secondary-light",
  red: "hover:text-red",
  green: "hover:text-positive",
} as const;

type THoverColor = keyof typeof hoverColorMap;

type Props = Omit<ComponentProps<"button">, "onClick"> & {
  icon: ReactNode;
  description?: string;
  hoverColor?: THoverColor;
  action?: any;
  isLoading?: boolean;
};

const FriendActionBtn = ({ icon, description = "", hoverColor = "normal", action, isLoading = false, ...props }: Props) => {
  return (
    <button
      {...props}
      onClick={(e) => {
        e.stopPropagation();
        action();
      }}
      className="ml-2 first:ml-0 cursor-pointer"
    >
      <TooltipWrapper
        tooltipTxt={description}
        size="sm"
        className={`h-9 w-9 rounded-full text-h-secondary bg-secondary flex items-center justify-center relative mp-btn group-hover:bg-tertiary ${hoverColorMap[hoverColor]}`}
      >
        {isLoading ? (
          <div className="opacity-50">
            <Spinner white size="sm" />
          </div>
        ) : (
          icon
        )}
      </TooltipWrapper>
    </button>
  );
};

export default FriendActionBtn;
