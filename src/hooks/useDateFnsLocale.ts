import { enUS, vi } from "date-fns/locale";
import { useTranslation } from "react-i18next";

export const useDateFnsLocale = () => {
  const { i18n } = useTranslation();

  switch (i18n.language) {
    case "vi-VN":
      return vi;
    default:
      return enUS;
  }
};

export default useDateFnsLocale;
