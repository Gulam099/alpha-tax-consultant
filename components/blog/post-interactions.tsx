'use client';

import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ThumbsUp, Heart, Lightbulb, PartyPopper, MessageSquare, Send, Loader2 } from 'lucide-react';
import { BlogPost, Comment } from '@/lib/blog-types';

export function PostInteractions({ post }: { post: BlogPost }) {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localComments, setLocalComments] = useState<Comment[]>(post.comments || []);
  const [localReactions, setLocalReactions] = useState(
    post.reactions || { like: [], love: [], insightful: [], celebrate: [] }
  );

  const userId = session?.user ? (session.user as any).id || session.user.email : null;

  const handleRequireLogin = (action: string) => {
    if (!session) {
      // User is not authenticated, trigger Google login directly
      signIn('google');
      return false;
    }
    return true;
  };

  const toggleReaction = async (type: string) => {
    if (!handleRequireLogin('react')) return;

    // Optimistic UI update
    const hasReacted = localReactions[type as keyof typeof localReactions]?.includes(userId);
    
    setLocalReactions(prev => {
      const updated = { ...prev };
      if (!updated[type as keyof typeof updated]) {
        updated[type as keyof typeof updated] = [];
      }
      
      if (hasReacted) {
        updated[type as keyof typeof updated] = updated[type as keyof typeof updated].filter((id: string) => id !== userId);
      } else {
        updated[type as keyof typeof updated] = [...updated[type as keyof typeof updated], userId];
      }
      return updated;
    });

    try {
      const res = await fetch(`/api/posts/${post._id || post.id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reactionType: type })
      });
      if (!res.ok) {
        // Revert on error (could be improved, but sufficient for now)
        console.error('Failed to update reaction');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleRequireLogin('comment')) return;
    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/posts/${post._id || post.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText })
      });

      if (res.ok) {
        const data = await res.json();
        setLocalComments(prev => [...prev, data.comment]);
        setCommentText('');
      } else {
        console.error('Failed to post comment');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const ReactionButton = ({ type, icon: Icon, color, label }: any) => {
    const list = localReactions[type as keyof typeof localReactions] || [];
    const count = list.length;
    const isActive = userId && list.includes(userId);

    return (
      <Button
        variant={isActive ? "secondary" : "outline"}
        size="sm"
        className={`flex items-center gap-2 rounded-full ${isActive ? color : 'text-muted-foreground hover:text-foreground'}`}
        onClick={() => toggleReaction(type)}
      >
        <Icon className="w-4 h-4" />
        <span className="hidden sm:inline">{label}</span>
        {count > 0 && <span className="font-semibold ml-1">{count}</span>}
      </Button>
    );
  };

  return (
    <div className="mt-12 pt-8 border-t border-border">
      {/* Reactions Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <ReactionButton type="like" icon={ThumbsUp} color="text-blue-500 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900" label="Like" />
        <ReactionButton type="love" icon={Heart} color="text-red-500 bg-red-50 hover:bg-red-100 dark:bg-red-950 dark:hover:bg-red-900" label="Love" />
        <ReactionButton type="insightful" icon={Lightbulb} color="text-yellow-500 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950 dark:hover:bg-yellow-900" label="Insightful" />
        <ReactionButton type="celebrate" icon={PartyPopper} color="text-green-500 bg-green-50 hover:bg-green-100 dark:bg-green-950 dark:hover:bg-green-900" label="Celebrate" />
      </div>

      {/* Comments Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-xl font-bold">
          <MessageSquare className="w-5 h-5" />
          <h3>Comments ({localComments.length})</h3>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="flex flex-col gap-4">
          <Textarea
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onFocus={() => handleRequireLogin('comment')}
            className="resize-none min-h-[100px]"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting || !commentText.trim()} className="flex gap-2">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Post Comment
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6 mt-8">
          {localComments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              {comment.userImage ? (
                <img src={comment.userImage} alt={comment.userName} className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-primary">{comment.userName.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <div className="flex-1">
                <div className="bg-muted/50 p-4 rounded-2xl rounded-tl-none">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{comment.userName}</h4>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{comment.text}</p>
                </div>
              </div>
            </div>
          ))}
          
          {localComments.length === 0 && (
            <p className="text-center text-muted-foreground italic py-8">
              No comments yet. Be the first to share your thoughts!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
