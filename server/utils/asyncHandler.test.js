import { describe, it, expect, vi } from "vitest";
import asyncHandler from "../../utils/asyncHandler.js";

describe("asyncHandler", () => {
  it("calls the wrapped function with req, res, next", async () => {
    const fn = vi.fn().mockResolvedValue(undefined);
    const wrapped = asyncHandler(fn);
    const req = {};
    const res = {};
    const next = vi.fn();

    await wrapped(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it("forwards a thrown/rejected error to next() instead of throwing", async () => {
    const testError = new Error("something broke");
    const fn = vi.fn().mockRejectedValue(testError);
    const wrapped = asyncHandler(fn);
    const next = vi.fn();

    // Critically: this must NOT throw — that's the entire point of
    // asyncHandler. It should swallow the rejection and hand it to
    // next() so Express's error middleware can process it.
    await wrapped({}, {}, next);

    expect(next).toHaveBeenCalledWith(testError);
  });

  it("does not call next() when the wrapped function succeeds", async () => {
    const fn = vi.fn().mockResolvedValue("ok");
    const wrapped = asyncHandler(fn);
    const next = vi.fn();

    await wrapped({}, {}, next);

    expect(next).not.toHaveBeenCalled();
  });
});
