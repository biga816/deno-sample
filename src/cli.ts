import { iterateReader } from "https://deno.land/std/streams/conversion.ts";

const stdinRid = Deno.stdin.rid;
if (Deno.isatty(stdinRid)) {
  Deno.setRaw(stdinRid, true);
}

const showMessage = (text: string) => {
  console.log(`\x1b[32m?\x1b[0m ${text}`);
};

showMessage("Press the key");
for await (const data of iterateReader(Deno.stdin)) {
  if (data[0] === 0x03) {
    // Ctrl+C
    Deno.exit(0);
  }
  console.log(data);
}
