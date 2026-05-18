'use client';

import Link from 'next/link';
import { useBlog } from '@/lib/blog-context';
import { ChevronRight, Calendar, User } from 'lucide-react';
import { UserNav } from '@/components/user-nav';

const getSnippet = (content: string) => {
  if (!content) return '';
  // Basic markdown strip for snippet
  const plainText = content.replace(/[#*`_-]/g, '').replace(/\n+/g, ' ').trim();
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return dateStr;
};

export default function BlogPage() {
  const { posts } = useBlog();
  const sortedPosts = [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-primary">
            Alpha Tax Consultant
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-foreground hover:text-primary transition-colors hidden sm:block"
            >
              Back to Home
            </Link>
            <UserNav />
          </div>
        </nav>
      </header>

      {/* Blog Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Accounting Insights & Resources
        </h1>
        <p className="text-lg text-muted-foreground">
          Expert tips, tax updates, and financial advice to help your business thrive
        </p>
      </div>

      {/* All Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        {sortedPosts.length === 0 ? (
          <div className="py-16 text-center bg-card border border-border rounded-lg">
            <p className="text-muted-foreground text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedPosts.map((post: any, index: number) => (
              <Link
                key={post._id || post.id || index}
                href={`/blog/${post.slug || post._id}`}
                className="group flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image Section */}
                {post.image ? (
                  <div className="h-56 bg-muted overflow-hidden relative flex justify-center items-center">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.classList.add('hidden');
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-xs font-semibold text-primary bg-background/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
                        {post.category || 'General'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-3 bg-primary"></div>
                )}

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  {!post.image && (
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                        {post.category || 'General'}
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                    {getSnippet(post.content)}
                  </p>

                  {/* Meta / Footer of Card */}
                  <div className="pt-4 border-t border-border flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.date || post.createdAt)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[80px]">{post.author || 'Admin'}</span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Alpha Tax Consultant. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
