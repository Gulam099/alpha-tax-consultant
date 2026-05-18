import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id || session.user.email;
    const body = await request.json();
    const { reactionType } = body; // 'like', 'love', 'insightful', 'celebrate'

    if (!['like', 'love', 'insightful', 'celebrate'].includes(reactionType)) {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    const { id } = await params;
    const db = await getDatabase();
    const post = await db.collection('posts').findOne({
      $or: [
        { _id: ObjectId.isValid(id) ? new ObjectId(id) : id },
        { id: id }
      ]
    });

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Initialize reactions if they don't exist
    const currentReactions = post.reactions || {
      like: [], love: [], insightful: [], celebrate: []
    };

    // We want to toggle the reaction for the user
    // First, remove user from ALL reactions to ensure they only have one active reaction per type,
    // or we can allow multiple different reactions per user. Let's allow toggling specific reactions.
    const hasReacted = currentReactions[reactionType]?.includes(userId);

    let updateDoc = {};
    if (hasReacted) {
      // Remove reaction
      updateDoc = {
        $pull: { [`reactions.${reactionType}`]: userId }
      };
    } else {
      // Add reaction
      updateDoc = {
        $addToSet: { [`reactions.${reactionType}`]: userId }
      };
    }

    const result = await db.collection('posts').updateOne(
      { _id: post._id },
      updateDoc
    );

    return NextResponse.json({ success: true, updated: !hasReacted });
  } catch (error) {
    console.error('Reaction API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
