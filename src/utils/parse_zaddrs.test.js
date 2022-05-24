import { parseZcashURI } from "./uris";

describe("exercise parseZcashURI", () => {
  test("ZIP321 case 1", () => {
    const targets = parseZcashURI(
      "zcash:ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez?amount=1&memo=VGhpcyBpcyBhIHNpbXBsZSBtZW1vLg&message=Thank%20you%20for%20your%20purchase"
    );

    expect(targets.length).toBe(1);
    expect(targets[0].address).toBe(
      "ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez"
    );
    expect(targets[0].message).toBe("Thank you for your purchase");
    expect(targets[0].label).toBeUndefined();
    expect(targets[0].amount).toBe(1);
    expect(targets[0].memoString).toBe("This is a simple memo.");
  });

  test("ZIP321 case 2", () => {
    const targets = parseZcashURI(
      "zcash:?address=tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU&amount=123.456&address.1=ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez&amount.1=0.789&memo.1=VGhpcyBpcyBhIHVuaWNvZGUgbWVtbyDinKjwn6aE8J-PhvCfjok"
    );

    expect(targets.length).toBe(2);

    expect(targets[0].address).toBe("tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU");
    expect(targets[0].message).toBeUndefined();
    expect(targets[0].label).toBeUndefined();
    expect(targets[0].amount).toBe(123.456);
    expect(targets[0].memoString).toBeUndefined();
    expect(targets[0].memoBase64).toBeUndefined();

    expect(targets[1].address).toBe(
      "ztestsapling10yy2ex5dcqkclhc7z7yrnjq2z6feyjad56ptwlfgmy77dmaqqrl9gyhprdx59qgmsnyfska2kez"
    );
    expect(targets[1].message).toBeUndefined();
    expect(targets[1].label).toBeUndefined();
    expect(targets[1].amount).toBe(0.789);
    expect(targets[1].memoString).toBe("This is a unicode memo ✨🦄🏆🎉");
  });

  test("coinbase URI", () => {
    const targets = parseZcashURI("zcash:tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU");

    expect(targets.length).toBe(1);
    expect(targets[0].message).toBeUndefined();
    expect(targets[0].label).toBeUndefined();
    expect(targets[0].amount).toBeUndefined();
    expect(targets[0].memoString).toBeUndefined();
    expect(targets[0].memoBase64).toBeUndefined();
  });

  test("Plain URI", () => {
    const targets = parseZcashURI("tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU");

    expect(targets.length).toBe(1);
    expect(targets[0].message).toBeUndefined();
    expect(targets[0].label).toBeUndefined();
    expect(targets[0].amount).toBeUndefined();
    expect(targets[0].memoString).toBeUndefined();
    expect(targets[0].memoBase64).toBeUndefined();
  });

  test("bad protocol scheme", () => {
    // bad protocol
    const error = parseZcashURI("badprotocol:tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU?amount=123.456");
    expect(typeof error).toBe("string");
  });

  test("bad address", () => {
    // bad address
    const error = parseZcashURI("zcash:badaddress?amount=123.456");
    expect(typeof error).toBe("string");
  });

  test("no address", () => {
    // no address
    const error = parseZcashURI("zcash:?amount=123.456");
    expect(typeof error).toBe("string");
  });

  test("invalid parameter queryarg name", () => {
    // bad param name
    const error = parseZcashURI("zcash:tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU?THISISNOTAVALIDQUERYARG=3");
    expect(typeof error).toBe("string");
  });

  test("index=1 has no amount", () => {
    // index=1 doesn't have amount
    const error = parseZcashURI("zcash:tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU?amount=2&address.1=tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU");
    expect(typeof error).toBe("string");
  });

  test("queryargs must be unique", () => {
    // duplicate param
    const error = parseZcashURI("zcash:tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU?amount=3&amount=3");
    expect(typeof error).toBe("string");

  });

  test("invalid parameter queryarg name", () => {
    // bad index
    const error = parseZcashURI(
      "zcash:tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU?amount=2&address.a=tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU&amount.a=3"
    );
    expect(typeof error).toBe("string");
  });

  test("invalid parameter queryarg name", () => {

    // index=1 is missing
    const error = parseZcashURI(
      "zcash:tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU?amount=0.1&address.2=tmEZhbWHTpdKMw5it8YDspUXSMGQyFwovpU&amount.2=2"
    );
    expect(typeof error).toBe("string");
  });
});
