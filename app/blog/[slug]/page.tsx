'use client';

import { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { useBlog } from '@/lib/blog-context';
import { ArrowLeft, Calendar, User } from 'lucide-react';
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
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <nav className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/blog"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          <UserNav />
        </nav>
      </header>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Image */}
        {post.image && (
          <div className="mb-8 rounded-lg overflow-hidden bg-muted flex justify-center">
            <img
              src={post.image}
              alt={post.title}
              className="w-full max-h-[600px] object-contain"
            />
          </div>
        )}

        {/* Meta Information */}
        <div className="mb-8 border-b border-border pb-8">
          <div className="mb-4">
            <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {post.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{postDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>By {post.author}</span>
            </div>
          </div>
        </div>

        {/* Excerpt */}
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          {post.excerpt}
        </p>

        {/* Content */}
        <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
          {post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-semibold text-foreground mt-8 mb-4">
                  {paragraph.replace('## ', '')}
                </h2>
              );
            }
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={index} className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">
                  {paragraph.split('\n').map((item, itemIndex) => (
                    <li key={itemIndex} className="ml-4">
                      {item.replace('- ', '')}
                    </li>
                  ))}
                </ul>
              );
            }
            if (paragraph.match(/^\d+\./)) {
              return (
                <ol key={index} className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">
                  {paragraph.split('\n').map((item, itemIndex) => (
                    <li key={itemIndex} className="ml-4">
                      {item.replace(/^\d+\.\s/, '')}
                    </li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={index} className="mb-4 text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {paragraph}
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
