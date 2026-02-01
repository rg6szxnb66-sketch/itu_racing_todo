// Tüm butonlar için ortak bir bileşen
interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  text,
  onClick,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="
        w-full py-3 px-4 
        bg-gradient-to-r from-green-600 to-green-800 
        text-white font-bold rounded 
        transform transition duration-300 ease-in-out
        shadow-lg
        hover:from-green-500 hover:to-green-700
        hover:shadow-[0_0_30px_rgba(34,197,94,0.6)]
        hover:scale-[1.03]
        active:scale-95 active:shadow-none
      "
    >
      {text}
    </button>
  );
}
