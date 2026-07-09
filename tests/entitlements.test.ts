import { describe, expect, it } from "vitest";
import {
  checkActiveProposalLimit,
  checkAiGenerationLimit,
  canUseFeature,
  isSubscriptionUsable,
} from "@/billing/entitlements";

describe("entitlements", () => {
  it("allows active starter proposals under limit", () => {
    const result = checkActiveProposalLimit({
      planId: "starter",
      status: "active",
      usage: { activeProposals: 2, templates: 1, aiGenerationsThisMonth: 0 },
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.remaining).toBe(1);
  });

  it("blocks when active proposal limit is reached", () => {
    const result = checkActiveProposalLimit({
      planId: "starter",
      status: "active",
      usage: { activeProposals: 3, templates: 1, aiGenerationsThisMonth: 0 },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.upgradeRequired).toBe(true);
      expect(result.reason).toBe("limit_reached");
    }
  });

  it("blocks paid plan features when subscription is past_due", () => {
    const result = checkActiveProposalLimit({
      planId: "pro",
      status: "past_due",
      usage: { activeProposals: 0, templates: 0, aiGenerationsThisMonth: 0 },
    });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("subscription_blocked");
  });

  it("gates branding removal by plan", () => {
    expect(
      canUseFeature(
        {
          planId: "starter",
          status: "active",
          usage: { activeProposals: 0, templates: 0, aiGenerationsThisMonth: 0 },
        },
        "removeBranding",
      ),
    ).toBe(false);
    expect(
      canUseFeature(
        {
          planId: "pro",
          status: "active",
          usage: { activeProposals: 0, templates: 0, aiGenerationsThisMonth: 0 },
        },
        "removeBranding",
      ),
    ).toBe(true);
  });

  it("checks AI generation monthly limit", () => {
    const result = checkAiGenerationLimit({
      planId: "starter",
      status: "active",
      usage: { activeProposals: 0, templates: 0, aiGenerationsThisMonth: 10 },
    });
    expect(result.ok).toBe(false);
  });

  it("treats trialing as usable", () => {
    expect(isSubscriptionUsable("trialing")).toBe(true);
    expect(isSubscriptionUsable("canceled")).toBe(false);
  });
});
