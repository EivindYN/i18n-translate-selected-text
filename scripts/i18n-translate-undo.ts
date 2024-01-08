import { locales, pathToLocales } from "./i18n-translate";

const { readFileSync, writeFileSync } = require("fs");
const readline = require("readline");

// -----

const path = process.argv[2];

function askQuestion(query: any) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(query, (ans: any) => {
      rl.close();
      resolve(ans);
    })
  );
}

const run = async () => {
  let latestLines = "";
  for (const locale of locales) {
    const filePath = `${path}/${pathToLocales}/${locale}/common.json`;
    const fileContent = readFileSync(filePath, "utf8");
    const fileContentSplit = fileContent
      .split("\n")
      .filter((it: string) => it !== "");
    const latestLine = fileContentSplit[fileContentSplit.length - 2];
    latestLines += `${locale} - ${latestLine}\n`;
  }

  console.log(latestLines);
  const ans = await askQuestion("Remove these translations? (y/N)");
  if (ans == "y" || ans == "Y") {
    for (const locale of locales) {
      const filePath = `${path}/${pathToLocales}/${locale}/common.json`;
      const fileContent = readFileSync(filePath, "utf8");
      const fileContentSplit = fileContent
        .split("\n")
        .filter((it: string) => it !== "");
      fileContentSplit[fileContentSplit.length - 3] = fileContentSplit[
        fileContentSplit.length - 3
      ].replace(/,$/, "");
      fileContentSplit.splice(fileContentSplit.length - 2, 1);
      writeFileSync(filePath, fileContentSplit.join("\n"), "utf8");
    }
  }
};

if (require.main === module) {
  run()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export {};
