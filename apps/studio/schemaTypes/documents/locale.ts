import { defineType } from "sanity";

export const localeType = defineType({
  name: "locale",
  title: "Locale",
  type: "document",
  fields: [
    {
      name: "title",
      type: "string",
      description: "The name of the locale",
    },
    {
      name: "code",
      type: "string",
      description: "The code of the locale",
    },
  ],
});
