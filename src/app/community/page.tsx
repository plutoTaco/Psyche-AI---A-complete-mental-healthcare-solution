"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Post {
  id: string;
  author: string;
  isAnonymous: boolean;
  category: string;
  title: string;
  content: string;
  date: string;
  upvotes: number;
  comments: Comment[];
  userUpvoted: boolean;
}

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

const CATEGORIES = ["All", "Anxiety", "Depression", "Relationships", "Recovery", "General"];

const SAMPLE_POSTS: Post[] = [
  {
    id: "1",
    author: "HopefulStar",
    isAnonymous: true,
    category: "Anxiety",
    title: "Small wins matter — I spoke up in a meeting today",
    content: "For the first time in months, I raised my hand and shared my idea in a team meeting. My heart was pounding the entire time, but I did it. It wasn't perfect, but it was progress. Just wanted to share with people who understand how big these 'small' moments really are.",
    date: "2 hours ago",
    upvotes: 24,
    comments: [
      { id: "c1", author: "GentleBreeze", content: "That's amazing! So proud of you. These are the victories that build confidence over time. 💛", date: "1 hour ago" },
      { id: "c2", author: "QuietStrength", content: "I know exactly how that feels. You should be really proud. The fact that you tried is what matters most.", date: "45 min ago" },
    ],
    userUpvoted: false,
  },
  {
    id: "2",
    author: "MountainClimber",
    isAnonymous: false,
    category: "Recovery",
    title: "6 months sober — things I've learned",
    content: "Today marks 6 months since I decided to change my life. It hasn't been easy, but here are some things I've learned: 1) It's okay to ask for help. 2) Bad days don't erase progress. 3) The people who stay are your real support system. 4) You're stronger than you think.",
    date: "5 hours ago",
    upvotes: 67,
    comments: [
      { id: "c3", author: "NewDawn", content: "Congratulations! This is incredibly inspiring. Thank you for sharing your journey with us. 🎉", date: "4 hours ago" },
    ],
    userUpvoted: true,
  },
  {
    id: "3",
    author: "SeaStar42",
    isAnonymous: true,
    category: "Depression",
    title: "Has anyone tried journaling? Does it actually help?",
    content: "My therapist suggested I try journaling but I don't even know where to start. I find it hard to put my feelings into words. Would love to hear if anyone else has had success with this and how they got started.",
    date: "1 day ago",
    upvotes: 18,
    comments: [
      { id: "c4", author: "InkAndThoughts", content: "Yes! Start super simple — even just writing 3 words about your day. Don't pressure yourself to write paragraphs. The Serenity AI daily log feature has great prompts to get started.", date: "22 hours ago" },
    ],
    userUpvoted: false,
  },
  {
    id: "4",
    author: "SunflowerMind",
    isAnonymous: true,
    category: "Relationships",
    title: "Setting boundaries with family — how do you cope?",
    content: "I've been trying to set healthier boundaries with my parents but the guilt is overwhelming. They say I'm being selfish. How do you deal with the emotional fallout of protecting your own mental health?",
    date: "1 day ago",
    upvotes: 31,
    comments: [],
    userUpvoted: false,
  },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "General", isAnonymous: true });
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState<"trending" | "recent">("trending");

  const filtered = posts
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .sort((a, b) => (sortBy === "trending" ? b.upvotes - a.upvotes : 0));

  const toggleUpvote = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? { ...p, upvotes: p.userUpvoted ? p.upvotes - 1 : p.upvotes + 1, userUpvoted: !p.userUpvoted }
          : p
      )
    );
  };

  const addPost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    const post: Post = {
      id: Date.now().toString(),
      author: newPost.isAnonymous ? `Anonymous${Math.floor(Math.random() * 999)}` : "You",
      isAnonymous: newPost.isAnonymous,
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      date: "Just now",
      upvotes: 0,
      comments: [],
      userUpvoted: false,
    };
    setPosts((prev) => [post, ...prev]);
    setNewPost({ title: "", content: "", category: "General", isAnonymous: true });
    setShowNewPost(false);
  };

  const addComment = (postId: string) => {
    if (!newComment.trim()) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: Date.now().toString(), author: "You", content: newComment, date: "Just now" },
              ],
            }
          : p
      )
    );
    if (selectedPost?.id === postId) {
      setSelectedPost((prev) =>
        prev
          ? {
              ...prev,
              comments: [
                ...prev.comments,
                { id: Date.now().toString(), author: "You", content: newComment, date: "Just now" },
              ],
            }
          : null
      );
    }
    setNewComment("");
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 32 }}>
      {/* ─── Sidebar ─── */}
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Categories</h3>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setSelectedPost(null); }}
            style={{
              display: "block",
              width: "100%",
              textAlign: "left",
              padding: "12px 16px",
              borderRadius: "var(--radius)",
              background: activeCategory === cat ? "rgba(236,91,19,0.1)" : "transparent",
              color: activeCategory === cat ? "var(--primary)" : "var(--text-secondary)",
              fontWeight: activeCategory === cat ? 700 : 500,
              fontSize: 14,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              marginBottom: 4,
              transition: "all 0.2s",
            }}
          >
            {cat}
          </button>
        ))}

        <div style={{ borderTop: "1px solid var(--border-color)", margin: "20px 0", paddingTop: 20 }}>
          <div
            style={{
              padding: 20,
              borderRadius: "var(--radius)",
              background: "linear-gradient(135deg, rgba(236,91,19,0.1), rgba(236,91,19,0.03))",
              border: "1px solid rgba(236,91,19,0.15)",
            }}
          >
            <span className="material-symbols-outlined" style={{ color: "var(--primary)", fontSize: 28, marginBottom: 8 }}>
              shield
            </span>
            <h4 style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>Safe Space</h4>
            <p style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.5 }}>
              This community is AI-moderated. Be kind, be supportive, and respect everyone&apos;s journey.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Main Feed ─── */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>Community Forum</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
              A safe space to share, connect, and support each other.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 4, marginRight: 8 }}>
              {(["trending", "recent"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "var(--radius-full)",
                    background: sortBy === s ? "var(--text-primary)" : "transparent",
                    color: sortBy === s ? "#fff" : "var(--text-secondary)",
                    border: "none",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textTransform: "capitalize",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowNewPost(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 24px",
                borderRadius: "var(--radius-full)",
                background: "var(--primary)",
                color: "#fff",
                fontWeight: 700,
                fontSize: 14,
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 16px var(--shadow-primary)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
              New Post
            </button>
          </div>
        </div>

        {/* New Post Modal */}
        <AnimatePresence>
          {showNewPost && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                overflow: "hidden",
                marginBottom: 24,
                background: "#fff",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border-color)",
                padding: 24,
              }}
            >
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Create a Post</h3>
              <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost((p) => ({ ...p, category: e.target.value }))}
                  style={{
                    padding: "10px 16px",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border-color)",
                    fontFamily: "inherit",
                    fontSize: 14,
                  }}
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={newPost.isAnonymous}
                    onChange={(e) => setNewPost((p) => ({ ...p, isAnonymous: e.target.checked }))}
                  />
                  Post anonymously
                </label>
              </div>
              <input
                type="text"
                placeholder="Title"
                value={newPost.title}
                onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", fontFamily: "inherit", fontSize: 15, marginBottom: 12, outline: "none" }}
              />
              <textarea
                placeholder="Share your thoughts..."
                value={newPost.content}
                onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                rows={4}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius)", border: "1px solid var(--border-color)", fontFamily: "inherit", fontSize: 15, resize: "vertical", outline: "none", marginBottom: 12 }}
              />
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button onClick={() => setShowNewPost(false)} style={{ padding: "10px 20px", borderRadius: "var(--radius)", border: "none", background: "rgba(0,0,0,0.05)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                  Cancel
                </button>
                <button onClick={addPost} style={{ padding: "10px 20px", borderRadius: "var(--radius)", border: "none", background: "var(--primary)", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>
                  Post
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedPost(selectedPost?.id === post.id ? null : post)}
              style={{
                padding: 24,
                borderRadius: "var(--radius)",
                background: "#fff",
                border: `1px solid ${selectedPost?.id === post.id ? "var(--primary)" : "var(--border-color)"}`,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-light))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{post.isAnonymous ? "visibility_off" : "person"}</span>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{post.author}</span>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>• {post.date}</span>
                </div>
                <span style={{ padding: "4px 12px", borderRadius: "var(--radius-full)", background: "rgba(236,91,19,0.08)", color: "var(--primary)", fontSize: 11, fontWeight: 700 }}>
                  {post.category}
                </span>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{post.title}</h3>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: selectedPost?.id === post.id ? 999 : 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {post.content}
              </p>

              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleUpvote(post.id); }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer",
                    color: post.userUpvoted ? "var(--primary)" : "var(--text-secondary)", fontWeight: 600, fontSize: 14, fontFamily: "inherit",
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
                    {post.userUpvoted ? "favorite" : "favorite_border"}
                  </span>
                  {post.upvotes}
                </button>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--text-secondary)", fontSize: 14 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>chat_bubble_outline</span>
                  {post.comments.length}
                </span>
              </div>

              {/* Comments */}
              <AnimatePresence>
                {selectedPost?.id === post.id && post.comments.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: "hidden", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-color)" }}
                  >
                    {post.comments.map((c) => (
                      <div key={c.id} style={{ padding: "12px 0", borderBottom: "1px solid rgba(0,0,0,0.03)" }}>
                        <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700 }}>{c.author}</span>
                          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{c.date}</span>
                        </div>
                        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.5 }}>{c.content}</p>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        placeholder="Write a supportive comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") addComment(post.id); }}
                        style={{ flex: 1, padding: "10px 16px", borderRadius: "var(--radius-full)", border: "1px solid var(--border-color)", fontFamily: "inherit", fontSize: 14, outline: "none" }}
                      />
                      <button
                        onClick={() => addComment(post.id)}
                        style={{ padding: "10px 20px", borderRadius: "var(--radius-full)", background: "var(--primary)", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Reply
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
