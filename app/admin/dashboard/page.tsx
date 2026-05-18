'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBlog } from '@/lib/blog-context';
import { useAuth } from '@/lib/admin-auth';
import { useRouter } from 'next/navigation';
import { AdminProtected } from '@/components/admin-protected';
import { Plus, Edit, Trash2, LogOut, Loader2, FileText, MessageSquare, Users, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';

// Pagination Helper Component
function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-3 sm:px-6 mt-4">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Showing page <span className="font-medium text-foreground">{currentPage}</span> of <span className="font-medium text-foreground">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-muted-foreground ring-1 ring-inset ring-border hover:bg-muted focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { posts } = useBlog();
  const { logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'posts' | 'queries' | 'users'>('posts');
  
  // Data States
  const [queries, setQueries] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeletingQuery, setIsDeletingQuery] = useState<string | null>(null);

  // Pagination States
  const [currentPostPage, setCurrentPostPage] = useState(1);
  const [currentQueryPage, setCurrentQueryPage] = useState(1);
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const itemsPerPage = 10;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  useEffect(() => {
    if (activeTab === 'queries' && queries.length === 0) {
      fetchQueries();
    }
    if (activeTab === 'users' && users.length === 0) {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/queries');
      if (res.ok) {
        const data = await res.json();
        setQueries(data);
      }
    } catch (error) {
      console.error('Failed to fetch queries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuery = async (id: string) => {
    if (!confirm('Are you sure you want to delete this query?')) return;
    setIsDeletingQuery(id);
    try {
      const res = await fetch(`/api/queries/${id}`, { method: 'DELETE' });
      if (res.ok) setQueries(queries.filter(q => q._id !== id));
      else alert('Failed to delete query');
    } catch (error) {
      console.error('Error deleting query:', error);
    } finally {
      setIsDeletingQuery(null);
    }
  };

  const renderPostsTable = () => {
    const totalPages = Math.ceil(posts.length / itemsPerPage);
    const displayedPosts = posts
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice((currentPostPage - 1) * itemsPerPage, currentPostPage * itemsPerPage);

    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center gap-2"><FileText className="w-5 h-5" /> Blog Posts</h2>
          <Link
            href="/admin/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create New
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Title</th>
                <th className="px-6 py-3 text-left font-medium">Category</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedPosts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No posts found.</td>
                </tr>
              ) : (
                displayedPosts.map((post: any) => (
                  <tr key={post.id || post._id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{post.title}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <span className="inline-flex px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">{post.category}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {new Date(post.createdAt || post.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <Link href={`/admin/edit/${post._id}`} className="p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"><Edit className="w-4 h-4" /></Link>
                        <Link href={`/admin/delete/${post._id}`} className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors"><Trash2 className="w-4 h-4" /></Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPostPage} totalPages={totalPages} onPageChange={setCurrentPostPage} />
      </div>
    );
  };

  const renderQueriesTable = () => {
    if (isLoading && queries.length === 0) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const totalPages = Math.ceil(queries.length / itemsPerPage);
    const displayedQueries = queries.slice((currentQueryPage - 1) * itemsPerPage, currentQueryPage * itemsPerPage);

    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center gap-2"><MessageSquare className="w-5 h-5" /> Customer Queries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Contact Info</th>
                <th className="px-6 py-3 text-left font-medium">Service</th>
                <th className="px-6 py-3 text-left font-medium">Date</th>
                <th className="px-6 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedQueries.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No queries found.</td></tr>
              ) : (
                displayedQueries.map((query) => (
                  <tr key={query._id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{query.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      <div className="flex flex-col gap-1">
                        <span>{query.email}</span>
                        <span className="text-xs">{query.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4"><span className="inline-flex px-2 py-1 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 rounded-md text-xs font-medium">{query.service || 'General'}</span></td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{new Date(query.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleDeleteQuery(query._id)} disabled={isDeletingQuery === query._id} className="p-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-50">
                        {isDeletingQuery === query._id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentQueryPage} totalPages={totalPages} onPageChange={setCurrentQueryPage} />
      </div>
    );
  };

  const renderUsersTable = () => {
    if (isLoading && users.length === 0) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    const totalPages = Math.ceil(users.length / itemsPerPage);
    const displayedUsers = users.slice((currentUserPage - 1) * itemsPerPage, currentUserPage * itemsPerPage);

    return (
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Users className="w-5 h-5" /> Registered Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-medium">User</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                <th className="px-6 py-3 text-left font-medium">Registered On</th>
              </tr>
            </thead>
            <tbody>
              {displayedUsers.length === 0 ? (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No users found.</td></tr>
              ) : (
                displayedUsers.map((user) => (
                  <tr key={user._id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full border border-border" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                        )}
                        <span className="font-medium text-foreground">{user.name || 'Unnamed User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentUserPage} totalPages={totalPages} onPageChange={setCurrentUserPage} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-muted/20 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-card border-r border-border flex flex-col flex-shrink-0 md:min-h-screen">
        <div className="p-6 border-b border-border flex flex-col items-center justify-center gap-3 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/5 border-2 border-primary/20 flex items-center justify-center overflow-hidden p-1 shadow-sm">
            {/* Real logo or fallback */}
            <img src="/icon.png" alt="Logo" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
          </div>
          <div>
            <h2 className="font-bold text-lg text-foreground leading-tight">Alpha Tax Consultant</h2>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          <button
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'posts' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <FileText className="w-5 h-5" /> Posts
          </button>
          
          <button
            onClick={() => setActiveTab('queries')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'queries' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <MessageSquare className="w-5 h-5" /> Queries
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              activeTab === 'users' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Users className="w-5 h-5" /> Users
          </button>
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto w-full max-w-full">
        {/* Header (Mobile context & Breadcrumb) */}
        <div className="mb-8 hidden md:block">
          <h1 className="text-2xl font-bold text-foreground capitalize flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" /> Dashboard / {activeTab}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your website data and interactions efficiently.</p>
        </div>

        {/* Dynamic Content */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === 'posts' && renderPostsTable()}
          {activeTab === 'queries' && renderQueriesTable()}
          {activeTab === 'users' && renderUsersTable()}
        </div>
      </main>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <AdminProtected>
      <DashboardContent />
    </AdminProtected>
  );
}
