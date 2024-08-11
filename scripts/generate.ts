import { globSync } from "glob";
import fs from "node:fs";
import path from "node:path";

interface Metadata {
  title: string;
  tags: string[];
}

interface Item {
  title: string;
  content: string;
  tags: string[];
  preview: string;
}

const MASTER_RAW_URL =
  "https://raw.githubusercontent.com/recontentapp/mjml-templates/master";

const run = () => {
  const output: Item[] = [];
  const templates = globSync("templates/**/template.mjml");

  for (const template of templates) {
    const folder = template.replace("/template.mjml", "");
    const remoteFolderAssetPath = [MASTER_RAW_URL, folder, "assets"].join("/");

    const rawContent = fs.readFileSync(
      path.resolve(process.cwd(), template),
      "utf-8"
    );
    const metadata: Metadata = JSON.parse(
      fs.readFileSync(
        path.resolve(process.cwd(), folder, "metadata.json"),
        "utf-8"
      )
    );

    const content = rawContent.replace(/\.\/assets/g, remoteFolderAssetPath);

    output.push({
      title: metadata.title,
      tags: metadata.tags,
      content,
      preview: [MASTER_RAW_URL, folder, "preview.png"].join("/"),
    });
  }

  fs.writeFileSync(
    path.resolve(process.cwd(), "output.json"),
    JSON.stringify(output, null, 2)
  );
};

run();
