//import { execSync } from "child_process";
//import { readFileSync, writeFileSync } from "fs";
//import OpenAI from "openai";

const { execSync } = require("child_process");
const { readFileSync, writeFileSync } = require("fs");
const OpenAI = require("openai");

// See README.md for how to use

export const locales = ["en", "no"]; // or import it from your project
export const pathToLocales = "src/lib/i18n/locales";
const pathToHere = "scripts";

// -----

const path = process.argv[2];

const processEnvOpenAIApiKey = () => {
  const env = readFileSync(`${path}/${pathToHere}/.env`, "utf8");
  const openAILines = env
    .split("\n")
    .filter((it: string) => /OPENAI_API_KEY/.test(it));
  if (openAILines.length == 0) {
    console.log(
      "Could not find OPENAI_API_KEY in ./.env, please add the environment variable"
    );
    return "";
  }
  const openAILine = openAILines[0];
  const key = openAILine.split("=")[1];
  return key;
};

function findWordAfterKeyword(text: string, keyword: string): string | null {
  const regex = new RegExp(`${keyword}\\s*:\\s*([^\n]+)`);
  const match = text.match(regex);
  return match ? match[1] : null;
}

const run = async () => {
  const arg = execSync("pbpaste").toString();

  const filePath = `${path}/${pathToLocales}/en/common.json`;
  const fileContent = readFileSync(filePath, "utf8");
  if (fileContent.split(`"${arg}": `).length > 1) {
    console.log("Already in translation");
    return;
  }
  const prompt = `Translate "${arg}" for the languages ${locales.join(
    ", "
  )} in this format:
  ${locales.map((locale) => `${locale}:`).join("\n")}`;
  const openai = new OpenAI({
    apiKey: processEnvOpenAIApiKey(),
  });
  const completion = await openai.completions.create({
    prompt: prompt,
    model: "gpt-3.5-turbo-instruct",
    max_tokens: 1500,
    temperature: 0,
  });
  const _response = completion.choices[0].text!;
  const localeToTranslation = (locale: string) => {
    return findWordAfterKeyword(_response, locale + "");
  };

  console.log("Added translations:");
  console.log(
    locales.map((it: string) => `${it}: ${localeToTranslation(it)}`).join("\n")
  );

  for (const locale of locales) {
    const filePath = `${path}/${pathToLocales}/${locale}/common.json`;
    const fileContent = readFileSync(filePath, "utf8");
    const fileContentSplit = fileContent
      .split("\n")
      .filter((it: string) => it !== "");
    fileContentSplit[fileContentSplit.length - 2] += `,\n\t"${arg.replace(
      / *\n */,
      " "
    )}": "${localeToTranslation(locale)}"`;
    const newFileContent = fileContentSplit.join("\n");
    writeFileSync(filePath, newFileContent, "utf8");
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
