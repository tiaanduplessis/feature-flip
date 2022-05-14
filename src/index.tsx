import React, { createContext, ReactNode, useContext, useMemo } from "react";
import get from "get-value";

export type Value = boolean | string | string[];
export type FeatureFlips = { [name: string]: Value | FeatureFlips };
export type FeatureFlipsConfig = {
  onParseValue?: (value: any) => boolean;
  seperator?: RegExp | string;
};

const context = createContext<{
  config?: FeatureFlipsConfig;
  featureFlips?: FeatureFlips;
}>({});

export const defaultValueParser = (value: any) => {
  const val = typeof value === "function" ? value() : value;
  if (typeof val === "boolean") return val;
  if (val === undefined || val === null) return false;
  if (typeof val !== "string") return false;
  if (["yes", "on", "true", "1"].includes(val.toLowerCase())) return true;
  if (["no", "off", "false", "0"].includes(val.toLowerCase())) return false;

  return false;
};

export const useFeatureFlips = () => useContext(context);

export const useFeatureFlip = (name: string, fallback: boolean = false) => {
  const { featureFlips, config } = useFeatureFlips();

  return useMemo(() => {
    if (!featureFlips || !config) return false;
    const value = get(featureFlips, name, {
      default: fallback,
      separator: config.seperator,
    });
    return config.onParseValue !== undefined
      ? config.onParseValue(value)
      : value;
  }, [name, featureFlips, config, fallback]);
};

export type FeatureFlipsProviderProps = {
  value: FeatureFlips;
  children: ReactNode;
  config?: FeatureFlipsConfig;
};

const defaultConfig: FeatureFlipsConfig = {
  onParseValue: defaultValueParser,
  seperator: ".",
};

export const FeatureFlipsProvider = ({
  value: featureFlips,
  config,
  children,
}: FeatureFlipsProviderProps) => {
  const value = useMemo(
    () => ({
      featureFlips,
      config: config ? { ...defaultConfig, ...config } : defaultConfig,
    }),
    [featureFlips, config]
  );
  return <context.Provider value={value}>{children}</context.Provider>;
};

export type FeatureFlipProps = {
  name: string;
  children: ReactNode | ((isOn: boolean) => JSX.Element);
  fallback?: ReactNode;
};

export const FeatureFlip = ({
  name,
  children,
  fallback = null,
}: FeatureFlipProps) => {
  const isOn = useFeatureFlip(name);
  if (typeof children === "function") return children(isOn);
  return <>{isOn ? children : fallback}</>;
};

export const withFeatureFlip = (
  name: string,
  fallback: ReactNode | null = null
) => {
  return (WrappedComponent: any) => (props: any) => {
    return (
      <FeatureFlip name={name} fallback={fallback}>
        <WrappedComponent {...props} />
      </FeatureFlip>
    );
  };
};

export const Provider = FeatureFlipsProvider;
export const withFeature = withFeatureFlip;
export const useFeature = useFeatureFlip;
export const useFeatures = useFeatureFlips;
export const Feature = FeatureFlip;
