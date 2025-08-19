"use client";
interface RetroButtonProps {
  text: string;
}

const RetroButton = ({ text }: RetroButtonProps) => {
  return (
    <div className="z-20 flex min-h-[100px] items-center justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="w-fit cursor-pointer bg-[#B83280] px-6 py-1 font-medium shadow-[3.5px_3.5px_0px_black] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:bg-[#9F2B6D] hover:shadow-none"
      >
        {text}
      </button>
    </div>
  );
};

export default RetroButton;
