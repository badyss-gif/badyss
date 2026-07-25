// Shapes based on the official WordPress REST API v2 schema:
// https://developer.wordpress.org/rest-api/reference/
// NOT_VERIFIED against the actual BADYSS backend yet.

export interface WordPressRenderedField {
  rendered: string;
}

export interface WordPressPost {
  id: number;
  slug: string;
  date: string;
  title: WordPressRenderedField;
  excerpt: WordPressRenderedField;
  content: WordPressRenderedField;
  featured_media: number;
}

export interface WordPressPage {
  id: number;
  slug: string;
  title: WordPressRenderedField;
  content: WordPressRenderedField;
}
