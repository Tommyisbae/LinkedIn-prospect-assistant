// src/content-scripts/deepProfileScraper.ts

interface ActivityItem {
  type: "post" | "repost" | "comment" | "unknown";
  content: string | null;
}

interface ExperienceItem {
  title: string;
  company: string | null;
  dates: string | null;
  description: string | null;
}

interface EducationItem {
  school: string;
  degree: string | null;
  dates: string | null;
}

interface ScrapedProfileData {
  about: string | null;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  activity: ActivityItem[];
}

function scrapeData(): ScrapedProfileData {
  const getText = (
    selector: string,
    element: ParentNode = document
  ): string | null => {
    const foundElement = element.querySelector(selector);
    return foundElement?.textContent?.trim().replace(/\s+/g, " ") || null;
  };

  const about =
    getText("#about ~ div.display-flex span[aria-hidden='true']") || null;

  const experienceItems = Array.from(
    document.querySelectorAll("#experience ~ div ul > li.artdeco-list__item")
  );
  const experience = experienceItems
    .map((item) => {
      const title = getText(
        'div > div > div > div > span[aria-hidden="true"]',
        item
      );
      if (!title) return null;
      const companyAndDates = Array.from(
        item.querySelectorAll('span.t-14.t-normal > span[aria-hidden="true"]')
      );
      const description = getText(
        ".pvs-list__item--with-top-padding span[aria-hidden='true']",
        item
      );
      const company = companyAndDates[0]?.textContent?.trim() || null;
      const dates = companyAndDates[1]?.textContent?.trim() || null;
      return { title, company, dates, description };
    })
    .filter((item): item is ExperienceItem => item !== null);

  const educationItems = Array.from(
    document.querySelectorAll("#education ~ div ul > li.artdeco-list__item")
  );
  const education = educationItems
    .map((item) => {
      const school = getText('div > div > a span[aria-hidden="true"]', item);
      if (!school) return null;
      const degreeAndDates = Array.from(
        item.querySelectorAll('span.t-14.t-normal > span[aria-hidden="true"]')
      );
      const degree = degreeAndDates[0]?.textContent?.trim() || null;
      const dates = degreeAndDates[1]?.textContent?.trim() || null;
      return { school, degree, dates };
    })
    .filter((item): item is EducationItem => item !== null);

  // --- SKILLS (CORRECTED FILTER) ---
  const skillsSection = document.querySelector("section:has(#skills)");
  const skillsItems = skillsSection
    ? Array.from(skillsSection.querySelectorAll("ul > li"))
    : [];
  const skills = skillsItems
    .map((item) =>
      getText('div > div > div > div > span[aria-hidden="true"]', item)
    )
    // This is the corrected, type-safe filter.
    .filter((skill): skill is string => {
      // First, ensure the skill is a non-empty string.
      if (!skill) {
        return false;
      }
      // Now that TypeScript knows 'skill' is a string, we can safely call .toLowerCase()
      return skill.toLowerCase() !== "show all 25 skills";
    });

  // --- ACTIVITY ---
  const activitySection = document.querySelector(
    "section:has(#content_collections)"
  );
  const activityItems = activitySection
    ? Array.from(activitySection.querySelectorAll("div.feed-shared-update-v2"))
    : [];
  const activity = activityItems
    .slice(0, 5)
    .map((item): ActivityItem | null => {
      let type: ActivityItem["type"] = "unknown";
      const repostHeader = getText(
        ".update-components-header__text-view",
        item
      );
      if (repostHeader && repostHeader.includes("reposted this")) {
        type = "repost";
      } else {
        type = "post";
      }
      const content = getText(
        'div.update-components-text span[dir="ltr"]',
        item
      );
      if (!content) return null;
      return { type, content };
    })
    .filter((act): act is ActivityItem => act !== null);

  return { about, experience, education, skills, activity };
}

function runScraper(): Promise<ScrapedProfileData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = scrapeData();
      resolve(data);
    }, 7000);
  });
}

runScraper();
