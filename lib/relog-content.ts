import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

export type ContentStatus = "draft" | "published";
export type ArticleFormat = "mini" | "feature" | "project";

export type Material = {
  title: string;
  material_type: string;
  description: string;
  attachment: string;
  external_url: string;
  display_order: number;
};

export type Article = {
  title: string;
  slug: string;
  content_type: ArticleFormat;
  parent_issue_number: string;
  category: string;
  tags: string[];
  excerpt: string;
  icon: string;
  cover_image: string;
  gallery: string[];
  reading_time: string;
  status: ContentStatus;
  featured: boolean;
  show_in_email: boolean;
  email_layout: string;
  oliver_comment: string;
  body: string;
  html: string;
  materials: Material[];
};

export type Edition = {
  slug: string;
  number: string;
  date: string;
  status: ContentStatus;
  title: string;
  summary: string;
  coverImage: string;
  articles: Article[];
  closingLeak: string;
  materials: Material[];
};

export type RelogContent = { editions: Edition[]; articles: Article[] };

type FrontmatterRecord = {
  slug: string;
  data: Record<string, unknown>;
  body: string;
};

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readMarkdownCollection(collection: string): FrontmatterRecord[] {
  const directory = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"))
    .map((entry) => {
      const filename = entry.name;
      const source = fs.readFileSync(path.join(directory, filename), "utf8");
      const parsed = matter(source);
      return {
        slug: filename.replace(/\.md$/i, ""),
        data: parsed.data as Record<string, unknown>,
        body: parsed.content.trim(),
      };
    });
}

function stringValue(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) return fallback;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).trim() || fallback;
}

function listValue(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function booleanValue(value: unknown): boolean {
  return value === true || value === "true" || value === 1 || value === "1";
}

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function statusValue(value: unknown): ContentStatus {
  return stringValue(value).toLowerCase() === "published" ? "published" : "draft";
}

function normaliseIssueNumber(value: unknown): string {
  return stringValue(value).replace(/^issue\s*/i, "").trim();
}

function toMaterial(record: FrontmatterRecord): Material {
  const data = record.data;
  return {
    title: stringValue(data.title, record.slug),
    material_type: stringValue(data.material_type, "document"),
    description: stringValue(data.description),
    attachment: stringValue(data.attachment),
    external_url: stringValue(data.external_url),
    display_order: numberValue(data.display_order),
  };
}

function safeSlug(value: unknown, fallback: string): string {
  const candidate = stringValue(value, fallback).toLowerCase();
  return candidate.replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || fallback;
}

/**
 * Reads Pages CMS Markdown collections. The Markdown file body is the canonical
 * article content; YAML frontmatter contains editorial metadata and relationships.
 */
export async function getContent(): Promise<RelogContent> {
  const logRecords = readMarkdownCollection("logs");
  const articleRecords = readMarkdownCollection("articles");
  const materialRecords = readMarkdownCollection("materials");

  const publishedLogs = logRecords
    .filter((record) => statusValue(record.data.status) === "published")
    .map((record) => {
      const data = record.data;
      const issueNumber = normaliseIssueNumber(data.issue_number);
      return {
        slug: safeSlug(record.slug, `issue-${issueNumber || "untitled"}`),
        number: issueNumber,
        date: stringValue(data.date),
        status: "published" as const,
        title: stringValue(data.title, `Transmission ${issueNumber}`),
        summary: stringValue(data.excerpt),
        coverImage: stringValue(data.cover_image),
        orderedArticleSlugs: listValue(data.article_slugs),
        closingLeak: stringValue(data.closing_note),
      };
    });

  const publishedIssueNumbers = new Set(publishedLogs.map((log) => log.number).filter(Boolean));
  const publishedArticleRecords = articleRecords.filter((record) =>
    statusValue(record.data.status) === "published" &&
    publishedIssueNumbers.has(normaliseIssueNumber(record.data.parent_issue_number))
  );

  const articleBase: Article[] = await Promise.all(publishedArticleRecords.map(async (record) => {
    const data = record.data;
    const slug = safeSlug(data.slug, record.slug);
    const body = record.body || stringValue(data.body);
    const parsedFormat = stringValue(data.content_type, "mini");
    const contentType: ArticleFormat = parsedFormat === "feature" || parsedFormat === "project" ? parsedFormat : "mini";

    return {
      title: stringValue(data.title, slug),
      slug,
      content_type: contentType,
      parent_issue_number: normaliseIssueNumber(data.parent_issue_number),
      category: stringValue(data.category, "Uncategorised"),
      tags: listValue(data.tags),
      excerpt: stringValue(data.excerpt),
      icon: stringValue(data.icon),
      cover_image: stringValue(data.cover_image),
      gallery: listValue(data.gallery),
      reading_time: stringValue(data.reading_time, "3 min"),
      status: "published",
      featured: booleanValue(data.featured),
      show_in_email: data.show_in_email === undefined ? true : booleanValue(data.show_in_email),
      email_layout: stringValue(data.email_layout, "standard"),
      oliver_comment: stringValue(data.oliver_comment),
      body,
      html: String(await marked.parse(body, { async: false })),
      materials: [],
    };
  }));

  const publishedMaterialRecords = materialRecords.filter((record) => statusValue(record.data.status) === "published");
  const issueMaterials = new Map<string, Material[]>();
  const articleMaterials = new Map<string, Material[]>();

  for (const record of publishedMaterialRecords) {
    const data = record.data;
    const material = toMaterial(record);
    const parentArticle = stringValue(data.parent_article);
    const parentIssue = normaliseIssueNumber(data.parent_issue_number);

    if (parentArticle) {
      const current = articleMaterials.get(parentArticle) ?? [];
      current.push(material);
      articleMaterials.set(parentArticle, current);
    } else if (parentIssue && publishedIssueNumbers.has(parentIssue)) {
      const current = issueMaterials.get(parentIssue) ?? [];
      current.push(material);
      issueMaterials.set(parentIssue, current);
    }
  }

  const articles = articleBase.map((article) => ({
    ...article,
    materials: (articleMaterials.get(article.slug) ?? []).sort((a, b) => a.display_order - b.display_order),
  }));

  const editions: Edition[] = publishedLogs.map((log) => {
    const issueArticles = articles.filter((article) => article.parent_issue_number === log.number);
    const order = new Map(log.orderedArticleSlugs.map((slug, index) => [slug, index]));
    const orderedArticles = [...issueArticles].sort((a, b) => {
      const aOrder = order.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
      const bOrder = order.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
      return aOrder - bOrder || a.title.localeCompare(b.title);
    });

    return {
      slug: log.slug,
      number: log.number,
      date: log.date,
      status: log.status,
      title: log.title,
      summary: log.summary,
      coverImage: log.coverImage,
      articles: orderedArticles,
      closingLeak: log.closingLeak,
      materials: (issueMaterials.get(log.number) ?? []).sort((a, b) => a.display_order - b.display_order),
    };
  }).sort((a, b) => b.date.localeCompare(a.date));

  return { editions, articles };
}

export async function getEdition(slug: string): Promise<Edition | undefined> {
  const { editions } = await getContent();
  return editions.find((edition) => edition.slug === slug);
}
