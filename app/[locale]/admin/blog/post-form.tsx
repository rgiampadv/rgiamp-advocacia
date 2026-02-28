"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type PostFormProps = {
  post?: { id: string; slug: string; title: string; excerpt: string; content: string };
  onSuccess?: () => void;
};

export function PostForm({ post, onSuccess }: PostFormProps) {
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (post) {
        const res = await fetch(`/api/posts/${post.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, title, excerpt, content }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Erro ao salvar");
      } else {
        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, title, excerpt, content }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Erro ao criar");
      }
      if (!post) {
        setSlug("");
        setTitle("");
        setExcerpt("");
        setContent("");
      }
      onSuccess?.();
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-12 rounded-lg border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="text-lg font-semibold text-[var(--blue-deep)]">
        {post ? "Editar post" : "Novo post"}
      </h2>
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium">Slug (URL)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="meu-post"
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Resumo</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Conteúdo</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
            className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" variant="accent" disabled={loading}>
          {loading ? "Salvando..." : post ? "Salvar" : "Publicar"}
        </Button>
      </div>
    </form>
  );
}
