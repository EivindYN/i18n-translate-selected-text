import React from "react";

import { StringMap, TOptions } from "i18next";
import enCommonTranslations from "./locales/en/common.json";
import { useTranslation } from "react-i18next";

type TranslationKeys = keyof typeof enCommonTranslations;

export type TFunction = (
  key: TranslationKeys,
  options?: TOptions<StringMap> | string
) => string;

export const useT = () => {
  const { t } = useTranslation();

  const typedT: TFunction = React.useCallback(
    (key: TranslationKeys, options?: TOptions<StringMap> | string) => {
      return t(key, options);
    },
    [t]
  );

  return typedT;
};
