import React from "react";
import { defaultAvatarColor, initials } from "@/app-components/utilities/avatar";
import { readableTextColor } from "@/app-components/utilities/color";

const sizes = {
  sm: "size-9 rounded-full text-sm",
  md: "size-12 rounded-2xl text-lg",
  lg: "size-16 rounded-2xl text-2xl sm:size-20 sm:text-3xl",
};

// Foto de perfil, ou um círculo (quadrado arredondado nos tamanhos maiores) com as iniciais na cor escolhida.
const Avatar = ({ name, color, image, size = "sm", className = "" }) => {
  const background = /^#[0-9a-f]{6}$/i.test(String(color || "")) ? color : defaultAvatarColor;

  if (image) {
    return <img src={image} alt="" className={`shrink-0 object-cover ${sizes[size]} ${className}`} />;
  }

  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: background, color: readableTextColor(background) }}
      className={`flex shrink-0 items-center justify-center font-bold ${sizes[size]} ${className}`}
    >
      {initials(name)}
    </span>
  );
};

export default Avatar;
