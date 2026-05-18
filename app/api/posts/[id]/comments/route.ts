import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';

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
    const { text } = body;

    if (!text || text.trim() === '') {
      return NextResponse.json({ error: 'Comment text is required' }, { status: 400 });
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

    const newComment = {
      id: randomUUID(),
      userId: userId,
      userName: session.user.name || 'Anonymous',
      userImage: session.user.image,
      text: text.trim(),
      createdAt: new Date().toISOString()
    };

    await db.collection('posts').updateOne(
      { _id: post._id },
      { $push: { comments: newComment } }
    );

    return NextResponse.json({ success: true, comment: newComment }, { status: 201 });
  } catch (error) {
    console.error('Comment API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
