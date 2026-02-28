"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { PostForm } from "./post-form";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  createdAt: Date;
  author?: { name: string | null } | null;
};

export function PostList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [editing, setEditing] = useState<Post | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este post?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
      setPosts((p) => p.filter((x) => x.id !== id));
      setEditing(null);
    } catch {
      alert("Erro ao excluir.");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold text-[var(--blue-deep)]">Posts publicados</h2>
      {editing && (
        <div className="mb-8">
          <PostForm
            post={editing}
            onSuccess={() => setEditing(null)}
          />
          <Button variant="outline" size="sm" onClick={() => setEditing(null)}>
            Cancelar edição
          </Button>
        </div>
      )}
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-3"
          >
            <div className="min-w-0 flex-1">
              <Link href={`/blog/${post.slug}`} className="font-medium text-[var(--blue-deep)] hover:underline" target="_blank">
                {post.title}
              </Link>
              <p className="truncate text-sm text-[var(--muted-foreground)]">/blog/{post.slug}</p>
            </div>
            <div className="ml-4 flex gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setEditing(post)}>
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-50"
                onClick={() => handleDelete(post.id)}
                disabled={deleting === post.id}
              >
                {deleting === post.id ? "..." : "Excluir"}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {posts.length === 0 && (
        <p className="text-sm text-[var(--muted-foreground)]">Nenhum post ainda. Crie o primeiro acima.</p>
      )}
    </div>
  );
}
