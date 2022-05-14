import React from "react";
import { describe, expect, test } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFeatureFlip, useFeatureFlips, FeatureFlipsProvider } from "../src";

describe("useFeatureFlips", () => {
  test("should have access to the feature flips", () => {
    const features = { blog: { footer: true } };
    const { result } = renderHook(() => useFeatureFlips(), {
      wrapper: ({ children }) => (
        <FeatureFlipsProvider value={features}>{children}</FeatureFlipsProvider>
      ),
    });
    expect(result.current.featureFlips).toEqual(features);
  });
});

describe("useFeatureFlip", () => {
  test("should return true if feature is enabled", () => {
    const features = { blog: { footer: "true", header: true, body: "yes" } };
    const { result, rerender } = renderHook(
      ({ name }: { name: string }) => useFeatureFlip(name),
      {
        initialProps: {
          name: "blog.footer",
        },
        wrapper: ({ children }) => (
          <FeatureFlipsProvider value={features}>
            {children}
          </FeatureFlipsProvider>
        ),
      }
    );

    expect(result.current).toBeTruthy();

    rerender({ name: "blog.header" });
    expect(result.current).toBeTruthy();

    rerender({ name: "blog.body" });
    expect(result.current).toBeTruthy();
  });

  test("should return false if feature is not enabled", () => {
    const features = { blog: { footer: "false", header: false, body: "no" } };
    const { result, rerender } = renderHook(
      ({ name }: { name: string }) => useFeatureFlip(name),
      {
        initialProps: {
          name: "blog.footer",
        },
        wrapper: ({ children }) => (
          <FeatureFlipsProvider value={features}>
            {children}
          </FeatureFlipsProvider>
        ),
      }
    );

    expect(result.current).toBeFalsy();

    rerender({ name: "blog.header" });
    expect(result.current).toBeFalsy();

    rerender({ name: "blog.body" });
    expect(result.current).toBeFalsy();
  });
});
