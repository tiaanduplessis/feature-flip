import React from "react";
import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { FeatureFlip, FeatureFlipsProvider } from "../src";

describe("FeatureFlipsProvider", () => {
  test("should render if key is true", () => {
    render(
      <FeatureFlipsProvider value={{ blog: { footer: true } }}>
        <FeatureFlip name="blog.footer">
          <footer>Footer</footer>
        </FeatureFlip>
      </FeatureFlipsProvider>
    );
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  test("should not render if key is false", () => {
    render(
      <FeatureFlipsProvider value={{ blog: { footer: false } }}>
        <FeatureFlip name="blog.footer">
          <footer>Footer</footer>
        </FeatureFlip>
      </FeatureFlipsProvider>
    );
    expect(screen.queryAllByText("Footer")).toEqual([]);
  });

  test("should render fallback if key is false", () => {
    render(
      <FeatureFlipsProvider value={{ blog: { footer: false } }}>
        <FeatureFlip name="blog.footer" fallback={<div>Fallback</div>}>
          <footer>Footer</footer>
        </FeatureFlip>
      </FeatureFlipsProvider>
    );
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });

  test("should allow seperator option to be configured", () => {
    render(
      <FeatureFlipsProvider
        config={{ seperator: "/" }}
        value={{ blog: { footer: true } }}
      >
        <FeatureFlip name="blog/footer">
          <footer>Footer</footer>
        </FeatureFlip>
      </FeatureFlipsProvider>
    );
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });
});
