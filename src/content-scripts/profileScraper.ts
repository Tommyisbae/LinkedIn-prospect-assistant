function scrapeProfiles() {
  const profileWrappers = document.querySelectorAll(
    'div[data-view-name="search-entity-result-universal-template"]'
  );
  const profiles = [];

  for (const wrapper of profileWrappers) {
    const container = wrapper.closest("li");
    if (!container) continue;

    const nameElement = container.querySelector(
      'span[dir="ltr"] span[aria-hidden="true"]'
    );
    // --- THIS IS THE CORRECTED LINE ---
    const headlineElement = container.querySelector(
      "div.t-14.t-black.t-normal"
    );
    //
    const connectionElement = container.querySelector(
      'span.entity-result__badge-text > span[aria-hidden="true"]'
    );

    let connectionDegree = null;
    if (connectionElement && connectionElement.textContent) {
      connectionDegree = connectionElement.textContent.replace("•", "").trim();
    }

    // NEW LOGIC: Find the profile URL
    let profileUrl = "";
    if (nameElement) {
      // Find the closest ancestor 'a' tag to the name element
      const linkElement = nameElement.closest("a");
      if (linkElement) {
        profileUrl = linkElement.href;
      }
    }

    if (nameElement && profileUrl) {
      // Only add if we successfully found the name AND URL
      profiles.push({
        name: nameElement.textContent?.trim() || "Name not found",
        headline: (headlineElement?.textContent?.trim() || "Headline not found")
          .replace(/\s+/g, " ")
          .trim(),
        connectionDegree: connectionDegree,
        profileUrl: profileUrl, // Add the new data point
      });
    }
  }
  return profiles;
}

scrapeProfiles();
