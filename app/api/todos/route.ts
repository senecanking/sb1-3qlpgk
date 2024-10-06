import { NextResponse } from 'next/server';
import { db } from '@/db';
import { todos } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const allTodos = await db.select().from(todos).orderBy(todos.createdAt);
  return NextResponse.json(allTodos);
}

export async function POST(request: Request) {
  const { title } = await request.json();
  const newTodo = await db.insert(todos).values({ title }).returning();
  return NextResponse.json(newTodo[0]);
}

export async function PUT(request: Request) {
  const { id, completed } = await request.json();
  const updatedTodo = await db
    .update(todos)
    .set({ completed })
    .where(eq(todos.id, id))
    .returning();
  return NextResponse.json(updatedTodo[0]);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await db.delete(todos).where(eq(todos.id, id));
  return NextResponse.json({ success: true });
}