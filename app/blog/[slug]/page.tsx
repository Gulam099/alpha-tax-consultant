'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useBlog } from '@/lib/blog-context';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { UserNav } from '@/components/user-nav';
import { PostInteractions } from '@/components/blog/post-interactions';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: Props) {
  const { slug } = use(params);

  // Client component to handle the hook call
  return <BlogPostContent slug={slug} />;
}


function BlogPostContent({ slug }: { slug: string }) {
  const { getPostBySlug, isLoading } = useBlog();
  const post = getPostBySlug(slug);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  let postDate = '';
  const dateToUse = post.date || (post as any).createdAt;
  if (dateToUse) {
    const d = new Date(dateToUse);
    if (!isNaN(d.getTime())) {
      postDate = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else {
      postDate = dateToUse;
    }
  }

  // Calculate estimated reading time
  const wordCount = post.content ? post.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 225));

  // Helper to parse bold, italic, code, and links within paragraphs/list-items
  const parseInlineStyles = (text: string) => {
    const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;
    const parts = text.split(regex);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-foreground">{part.slice(1, -1)}</em>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary font-semibold">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('[') && part.includes('](')) {
        const match = part.match(/\[(.*?)\]\((.*?)\)/);
        if (match) {
          const [_, linkText, url] = match;
          return (
            <Link
              key={i}
              href={url}
              className="text-primary hover:text-primary/80 underline underline-offset-4 transition-colors font-medium"
            >
              {linkText}
            </Link>
          );
        }
      }
      return part;
    });
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-muted/40 z-50">
        <div
          className="h-full bg-primary transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Articles
          </Link>
          <UserNav />
        </nav>
      </header>

      {/* Article Content */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Title & Metadata Header */}
        <div className="mb-10 pb-8 border-b border-border/50">
          <div className="mb-4">
            <span className="text-xs font-bold tracking-wider text-primary bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full uppercase">
              {post.category}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6 leading-tight tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 py-4 border-y border-border/50 my-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm">
              {post.author ? post.author.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {post.author || 'Admin'}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {postDate}
                </span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                {/* <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {readingTime} min read
                </span> */}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image - Placed after title, styled beautifully */}
        {post.image && (
          <div className="mb-12 rounded-2xl overflow-hidden bg-muted shadow-xl border border-border/30 aspect-[16/9] w-full relative group">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
            />
          </div>
        )}

        {/* Excerpt - Highlighted introduction */}
        {post.excerpt && (
          <p className="text-xl sm:text-2xl text-foreground font-medium mb-10 leading-relaxed tracking-tight border-l-4 border-primary pl-6 py-1 italic bg-primary/5 rounded-r-xl pr-4">
            {post.excerpt}
          </p>
        )}

        {/* Body Content with rich layout parsing */}
        <div className="prose dark:prose-invert max-w-none text-foreground/90 leading-relaxed text-base sm:text-lg space-y-6">
          {post.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // 1. Heading 2 (## Heading)
            if (trimmed.startsWith('## ')) {
              return (
                <h2
                  key={index}
                  className="text-2xl sm:text-3xl font-bold text-foreground mt-12 mb-6 tracking-tight border-b border-border/50 pb-2 flex items-center gap-2"
                >
                  <span className="w-1.5 h-6 bg-primary rounded-full inline-block" />
                  {parseInlineStyles(trimmed.replace('## ', ''))}
                </h2>
              );
            }

            // 2. Heading 3 (### Heading)
            if (trimmed.startsWith('### ')) {
              return (
                <h3
                  key={index}
                  className="text-xl sm:text-2xl font-bold text-foreground mt-8 mb-4 tracking-tight"
                >
                  {parseInlineStyles(trimmed.replace('### ', ''))}
                </h3>
              );
            }

            // 3. Blockquote (> quote)
            if (trimmed.startsWith('> ')) {
              return (
                <blockquote
                  key={index}
                  className="border-l-4 border-primary pl-6 my-8 italic text-lg text-foreground bg-muted/30 py-5 pr-4 rounded-r-2xl shadow-sm border-y border-r border-border/20"
                >
                  {parseInlineStyles(trimmed.replace(/^>\s*/, ''))}
                </blockquote>
              );
            }

            // 4. Inline Image (![alt](url))
            const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
            if (imgMatch) {
              const [_, alt, url] = imgMatch;
              return (
                <figure key={index} className="my-10 flex flex-col items-center">
                  <div className="rounded-2xl overflow-hidden shadow-lg border border-border/40 w-full bg-muted relative group">
                    <img
                      src={url}
                      alt={alt}
                      className="w-full h-auto max-h-[550px] object-cover transition-transform duration-500 hover:scale-[1.01]"
                    />
                  </div>
                  {alt && (
                    <figcaption className="mt-3 text-sm text-muted-foreground italic text-center">
                      {alt}
                    </figcaption>
                  )}
                </figure>
              );
            }

            // 5. Unordered List (- item)
            if (trimmed.startsWith('- ')) {
              return (
                <ul key={index} className="my-6 space-y-3 pl-2">
                  {trimmed.split('\n').map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                      <span className="text-muted-foreground leading-relaxed flex-1">
                        {parseInlineStyles(item.replace(/^- /, ''))}
                      </span>
                    </li>
                  ))}
                </ul>
              );
            }

            // 6. Ordered List (1. item)
            if (trimmed.match(/^\d+\./)) {
              return (
                <ol key={index} className="my-6 space-y-3 pl-2">
                  {trimmed.split('\n').map((item, itemIndex) => {
                    const match = item.match(/^(\d+)\.\s(.*)/);
                    const num = match ? match[1] : (itemIndex + 1).toString();
                    const text = match ? match[2] : item;
                    return (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <span className="text-sm font-bold text-primary min-w-[20px] text-right mt-0.5">
                          {num}.
                        </span>
                        <span className="text-muted-foreground leading-relaxed flex-1">
                          {parseInlineStyles(text)}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              );
            }

            // Default Paragraph
            return (
              <p
                key={index}
                className="mb-6 text-muted-foreground leading-relaxed whitespace-pre-wrap text-base sm:text-lg"
              >
                {parseInlineStyles(trimmed)}
              </p>
            );
          })}
        </div>

        {/* Post Interactions (Like/Comment) */}
        <PostInteractions post={post as any} />
      </article>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Alpha Tax Consultant. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
