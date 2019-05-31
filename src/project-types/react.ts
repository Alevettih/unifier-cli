import { Answer } from "@src/main";
import { exec } from "child_process";
import { ReactSpecifier } from "@specifier/react";

export const react = ({ title } = { title: '' } as Answer): void => {
  if (!title) {
    throw new Error('Title is required!')
  }

  exec(
    `npx create-react-app ${title}`,
    async (error) => {
      if (error) {
        throw new Error(`create-react-app CLI was fell ${error}`);
      }

      await new ReactSpecifier(title).specify();
    }
  ).stdout.pipe(process.stdout);
};
