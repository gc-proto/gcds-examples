const path = require("path");

module.exports = function(eleventyConfig) {
  // Date filter for formatting dates - ensure this is properly registered
  eleventyConfig.addFilter("date", function(date, format) {
    if (!date) return "";
    
    const d = new Date(date);
    
    // Handle different format strings
    if (format === "YYYY-MM-DD") {
      return d.toISOString().split('T')[0];
    }
    
    if (format === "iso") {
      return d.toISOString().split('T')[0];
    }
    
    // Default to ISO date format (YYYY-MM-DD)
    return d.toISOString().split('T')[0];
  });

  // Passthrough copy for static assets if needed later
  eleventyConfig.addPassthroughCopy({ "templates/public": "/" });

  // Collections: english and french
  eleventyConfig.addCollection("english", (collectionApi) => {
    return collectionApi.getFilteredByGlob("templates/english/**/*.{html,njk,liquid,md}");
  });
  eleventyConfig.addCollection("french", (collectionApi) => {
    return collectionApi.getFilteredByGlob("templates/french/**/*.{html,njk,liquid,md}");
  });

  function groupByTopic(items, lang) {
    const groups = new Map();
    for (const item of items) {
      const input = item.inputPath || (item.data && item.data.page && item.data.page.inputPath) || "";
      // Expect paths like ./templates/english/<topic>/...
      const parts = input.replace(/\\\\/g, "/").split("/");
      const langIdx = parts.indexOf(lang);
      const topic = langIdx > -1 && parts.length > langIdx + 1 ? parts[langIdx + 1] : "misc";
      if (!groups.has(topic)) groups.set(topic, []);
      groups.get(topic).push(item);
    }
    // Convert to array of { topic, items }
    return Array.from(groups.entries())
      .map(([topic, items]) => ({ topic, items }))
      .sort((a, b) => a.topic.localeCompare(b.topic));
  }

  eleventyConfig.addCollection("englishTopics", (collectionApi) => {
    const items = collectionApi.getFilteredByGlob("templates/english/**/*.{html,njk,liquid,md}");
    return groupByTopic(items, "english");
  });
  eleventyConfig.addCollection("frenchTopics", (collectionApi) => {
    const items = collectionApi.getFilteredByGlob("templates/french/**/*.{html,njk,liquid,md}");
    return groupByTopic(items, "french");
  });

  // Filter to build language switch link using page.data.langAltUrl
  eleventyConfig.addFilter("langSwitchHref", (page) => {
    if (page && page.data) {
      if (page.data.langAltAbsolute) return page.data.langAltAbsolute;
      if (page.data.langAltUrl) return page.data.langAltUrl;
    }
    return "#";
  });

  // Clean URLs
  return {
    dir: {
      input: "templates",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "liquid", "html", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    pathPrefix: "/"
  };
};
