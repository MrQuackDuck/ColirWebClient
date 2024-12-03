export const importMarkdownFile = async (tab, languageCode) => {
  try {
    const module = await import(`../../../assets/faq/${tab}/${tab}_${languageCode}.md`);
    return module.default;
  } catch (error) {
    // Fallback to English if specific language file not found
    if (languageCode !== "en") {
      try {
        const fallbackModule = await import(`../../../assets/faq/${tab}/${tab}_en.md`);
        return fallbackModule.default;
      } catch {
        console.error(`No markdown found for tab ${tab}`);
        return "# No Content Available";
      }
    }
    console.error(`No markdown found for tab ${tab} in language ${languageCode}`);
    return "# No Content Available";
  }
};
