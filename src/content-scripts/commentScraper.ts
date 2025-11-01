// src/content-scripts/commentScraper.ts

function scrapeCommenters() {
  const commentContainers = document.querySelectorAll(
    "article.comments-comment-entity"
  );

  const prospects = [];
  const capturedUrls = new Set(); // Use a Set to prevent duplicate profiles

  for (const container of commentContainers) {
    const urlElement = container.querySelector(
      "a.comments-comment-meta__description-container"
    );
    const nameElement = container.querySelector(
      "span.comments-comment-meta__description-title"
    );
    const headlineElement = container.querySelector(
      "div.comments-comment-meta__description-subtitle"
    );

    if (urlElement && nameElement && headlineElement) {
      const profileUrl = (urlElement as HTMLAnchorElement).href;

      // If we haven't already captured this person, add them.
      if (!capturedUrls.has(profileUrl)) {
        prospects.push({
          name: nameElement.textContent?.trim() || "Name not found",
          headline: headlineElement.textContent?.trim() || "Headline not found",
          profileUrl: profileUrl,
          // Note: Connection degree is not available in the comment section
          connectionDegree: null,
        });
        capturedUrls.add(profileUrl);
      }
    }
  }
  return prospects;
}

scrapeCommenters();
