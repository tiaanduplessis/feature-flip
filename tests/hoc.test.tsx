import React from "react";
import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { withFeatureFlip, FeatureFlipsProvider } from "../src";

describe("withFeatureFlip", () => {
  test("should render if key is true", () => {
    const Component = withFeatureFlip("footer")(() => <footer>Footer</footer>);
    render(
      <FeatureFlipsProvider value={{ footer: true }}>
        <Component />
      </FeatureFlipsProvider>
    );
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  test("should not render if key is false", () => {
    const Component = withFeatureFlip("undefined-key")(() => (
      <footer>Footer</footer>
    ));
    render(
      <FeatureFlipsProvider value={{ footer: true }}>
        <Component />
      </FeatureFlipsProvider>
    );
    expect(screen.queryAllByText("Footer")).toEqual([]);
  });

  test("should render fallback if key is false", () => {
    const Fallback = () => <div>Fallback</div>;
    const Component = withFeatureFlip(
      "footer",
      <Fallback />
    )(() => <footer>Footer</footer>);
    render(
      <FeatureFlipsProvider value={{ footer: false }}>
        <Component />
      </FeatureFlipsProvider>
    );
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });
});
